import { OutboundTrigger } from "../../models/workflow-models";
import { localDb } from "../../repository/local-repo";
import { batchInsertExecutions, deleteExecutionsById, getExecutionsById, insertExecution } from "../../repository/unified-repo";
import { randomUUID } from 'crypto';
import firecrawl from "../firecrawl";
import { Document, ExtractResponse, SearchData, SearchResultWeb } from "@mendable/firecrawl-js";
import { generateObject, generateText } from "ai";
import * as z from "zod";
import { tursoDb } from "../../repository/turso-repo";

const paragonContext = `Paragon is an embedded integration platform (embedded ipaas). 
We help B2B SaaS companies build product integrations between their product and their users'
3rd-party platforms like Google Drive, Slack, Salesforce, Hubspot, Jira, etc. We have 150+ 
integration connectors.

Paragon specializes in helping AI companies with agent tools and large-scale data ingestion for 
use cases like RAG. Paragon's APIs are developer friendly APIs that make it easy for customers to 
send 3rd-party API calls on behalf of their users.

Some of the use cases our current customers use us for is agent tool calling, in-app workflow builders, 
RAG ingestion, CRM syncs, and messaging automations.

Some of our most successful customers are Postman, Dropbox, Crew.ai, and Copy.ai.`

const outboundTemplate = `A good outbound email is concise and quickly goes over the value of Paragon's API (ActionKit) 
and Paragon's data ingestion service (Managed Sync) and how Paragon can be a good fit for their product 
integrations.

Be friendly, and offer to set up a call if they're interested`;

export const triggerOutboundWorkflow = async (trigger: OutboundTrigger): Promise<string> => {
	const execId: string = randomUUID();

	const companyInfo: { company: string, website: string } = await parseEmail(execId, trigger.email);
	console.log("[COMPANY INFO] ", companyInfo);

	const extractData: ExtractResponse | undefined = await crawlUrl(execId, companyInfo.website, companyInfo.company);
	console.log("[EXTRACTED DATA] ", extractData);

	let searchData: SearchData | undefined;
	let finalResult: string = "undefined";

	if (extractData && extractData.success) {
		if (extractData.data) {
			//@ts-ignore
			const extracted: {
				largerThanTenEmployees: boolean,
				isB2B: boolean,
			} = extractData.data;
			if (extracted.isB2B && extracted.largerThanTenEmployees) {
				searchData = await searchCompany(execId, companyInfo.company);
			} else {
				finalResult = "Unqualified";
			}
		}
	} else {
		searchData = await searchCompany(execId, companyInfo.company);
	}

	console.log("[SEARCH DATA] ", searchData);
	if (searchData) {
		const fit: { isFit: boolean, context: string | undefined } | undefined = await determineFit(execId, searchData, companyInfo.company);
		console.log("[FIT] ", fit);
		if (fit && fit.isFit && fit.context) {
			finalResult = await writeOutbound(execId, companyInfo.company, fit.context);
			console.log("[OUTBOUND] ", finalResult);
		} else {
			finalResult = "Not a good fit";
		}
	} else {
		finalResult = "Not enough context to determine";
	}
	const allExecutions = await getExecutionsById(localDb, execId);
	if (allExecutions) {
		await batchInsertExecutions(tursoDb, allExecutions)
	}
	await deleteExecutionsById(localDb, execId);
	return finalResult;
}

const writeOutbound = async (execId: string, company: string, context: string) => {
	const response = await generateText({
		model: 'gpt-5-mini',
		system: `You are a Sales Developer Rep (SDR) for Paragon. 

${paragonContext}

${outboundTemplate}`,
		prompt: `Based off this context for ${company}, write an outbound email: 

${context}`,
	});
	await insertExecution(localDb, {
		executionId: execId,
		data: { context: context, finalReponse: response.text },
		step: "writeOutbound",
	});

	return response.text;
}

const determineFit = async (execId: string, searchData: SearchData, company: string): Promise<{ isFit: boolean, context: string | undefined } | undefined> => {
	if (!searchData.web) return;
	let context: string | undefined;
	let numResource: number = 0;
	let isFit: boolean = false;

	while (!isFit && (numResource < searchData.web.length && numResource < 4)) {
		const result = searchData.web[numResource];
		if (result && typeof result === 'object' && 'description' in result) {
			context = (result as SearchResultWeb).description;
			const verdict = await generateObject({
				model: 'gpt-5-mini',
				schema: z.object({
					isFit: z.boolean(),
				}),
				system: `You are a Sales Developer Rep (SDR) for Paragon. 

${paragonContext}

Determine if prospective companies are good fits for Paragon to outbound to.`,
				prompt: `Based off this context for ${company}, are they a good fit to outbound to: 

${context}`,
			});
			isFit = verdict.object.isFit;
			numResource += 1;
		}
	}
	await insertExecution(localDb, {
		executionId: execId,
		data: { context: context },
		step: "determineFit",
	});

	return { isFit, context };
}

const parseEmail = async (execId: string, email: string): Promise<{ company: string, website: string }> => {
	const res = {
		company: email.split("@")[1]?.split(".")[0] ?? "",
		website: email.split("@")[1] ?? "",
	}
	await insertExecution(localDb, {
		executionId: execId,
		data: res,
		step: "parseEmail",
	})
	return res;
}

const searchCompany = async (execId: string, company: string): Promise<SearchData | undefined> => {
	if (company === "") return;
	const searchData: SearchData = await firecrawl.search(company + " integrations", {
		sources: ['web'],
		limit: 10,
		timeout: 10000,
	});
	await insertExecution(localDb, {
		executionId: execId,
		data: searchData,
		step: "searchCompany",
	})
	return searchData;
}

const crawlUrl = async (execId: string, website: string, company: string): Promise<undefined | ExtractResponse> => {
	if (website === "") return;
	const schema = {
		type: 'object',
		properties: {
			largerThanTenEmployees: { type: 'boolean' },
			isB2B: { type: 'boolean' },
		},
		required: ['isB2B', 'largerThanTenEmployees']
	};

	const res: ExtractResponse = await firecrawl.extract({
		urls: ['https://' + website + "/*"],
		prompt: `Extract info about ${company} as a company`,
		schema,
		scrapeOptions: { formats: [{ type: 'json', prompt: `Extract info about ${company}`, schema }] },
		enableWebSearch: true,
		timeout: 10000,
	});
	await insertExecution(localDb, {
		executionId: execId,
		data: res,
		step: "crawlUrl",
	})
	return res;
}
