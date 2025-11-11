import { OutboundTrigger } from "../../models/workflow-models";
import { localDb } from "../../repository/local-repo";
import { Client } from "@libsql/client/.";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { insertExecution } from "../../repository/unified-repo";
import { v4 } from "uuid";

const localRepo: LibSQLDatabase<Record<string, never>> & { $client: Client; } = localDb;

export const triggerOutboundWorkflow = async (trigger: OutboundTrigger) => {
	const execId: string = v4();
	const companyInfo: { company: string, website: string } = await parseEmail(execId, trigger.email);
}

const parseEmail = async (execId: string, email: string): Promise<{ company: string, website: string }> => {
	const res = {
		company: email.split("@")[1]?.split(".")[0] ?? "",
		website: email.split("@")[1] ?? "",
	}
	await insertExecution(localRepo, {
		executionId: execId,
		data: res,
		step: "parseEmail",
	})
	return res;
}
