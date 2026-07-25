import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
});

export const interviewStatsTable = pgTable("interview_stats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    total_score: integer().notNull(),
    total_interview_count: integer().notNull(),
    feedback: text().notNull(),
    relevance: text().notNull(),
    clarity: text().notNull(),
    depth: text().notNull(),
    experience: text().notNull(),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .unique()
        .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const overallStatsTable = pgTable("overall_stats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    total_score: integer().notNull(),
    total_interview_count: integer().notNull(),
    feedback: text().notNull(),
    gap_analysis: text().notNull(),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .unique()
        .references(() => usersTable.id, { onDelete: "cascade" }),
});
