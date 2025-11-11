import { Client } from "@libsql/client/.";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Execution, ExecutionInsert, executionTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const insertExecution = async (
	db: LibSQLDatabase<Record<string, never>> & { $client: Client; },
	execution: ExecutionInsert
): Promise<Execution | undefined> => {
	try {
		const exec: Execution[] = (await db.insert(executionTable).values(execution).returning());
		return exec[0];
	} catch (e) {
		console.error("[Insert Execution]: ", e);
	}
}

export const getExecutionsById = async (
	db: LibSQLDatabase<Record<string, never>> & { $client: Client; },
	execId: string,
): Promise<Execution[] | undefined> => {
	try {
		return await db.select().from(executionTable).where(eq(executionTable.executionId, execId));
	} catch (e) {
		console.error("[Get All Executions]: ", e);
	}
}

export const deleteExecutionsById = async (
	db: LibSQLDatabase<Record<string, never>> & { $client: Client; },
	execId: string,
): Promise<void> => {
	try {
		await db.delete(executionTable).where(eq(executionTable.executionId, execId));
	} catch (e) {
		console.error("[Get All Executions]: ", e);
	}
}



export const batchInsertExecutions = async (
	db: LibSQLDatabase<Record<string, never>> & { $client: Client; },
	executions: Execution[]
): Promise<void> => {
	try {
		const queries = executions.map((exec) => {
			return db.insert(executionTable).values(exec);
		});
		await db.batch(queries as any);
	} catch (e) {
		console.error("[Batch Execution]: ", e);
	}
}
