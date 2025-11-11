import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from 'uuid';
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const executionTable = sqliteTable("execution_table", {
	id: text().primaryKey().$defaultFn(() => v4()),
	executionId: text().notNull(),
	data: text({ mode: 'json' }).notNull(),
	step: text().notNull(),
	executionTime: text().$defaultFn(() => new Date().toISOString()),
});

export type Execution = InferSelectModel<typeof executionTable>;
export type ExecutionInsert = InferInsertModel<typeof executionTable>;
