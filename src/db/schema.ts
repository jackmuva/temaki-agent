import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { randomUUID } from 'crypto';

export const executionTable = sqliteTable("execution_table", {
	id: text().primaryKey().$defaultFn(() => randomUUID()),
	executionId: text().notNull(),
	data: text({ mode: 'json' }).notNull(),
	step: text().notNull(),
	executionTime: text().$defaultFn(() => new Date().toISOString()),
});

export type Execution = InferSelectModel<typeof executionTable>;
export type ExecutionInsert = InferInsertModel<typeof executionTable>;
