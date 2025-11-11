import { Client } from "@libsql/client/.";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Execution, ExecutionInsert, executionTable } from "../db/schema";

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
