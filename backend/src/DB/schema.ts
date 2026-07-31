import { integer, pgTable, varchar, timestamp, text, pgEnum, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
    feedback: text().notNull(),
    relevance: text().notNull(),
    clarity: text().notNull(),
    depth: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),  
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
},
);

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


export const MessageType = pgEnum("message_type", [
    "user",
    "agent",
]);

export const conversation = pgTable("conversation", {
    id: varchar("id", { length: 255 }).primaryKey(),
    type: MessageType("type").notNull(),
    messages: text().array().notNull(),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
  
    interviewStatsId: integer()
        .notNull()
        .unique()
        .references(() => interviewStatsTable.id, { onDelete: "cascade" }),
    created_at: timestamp().defaultNow().notNull(),

});

export const resumesTable = pgTable("resumes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  rawText: text("raw_text").notNull(),
  fileName: varchar("file_name", { length: 255 }),
  createdAt: timestamp().defaultNow().notNull(),
})


export const githubMetadataTable = pgTable("github_metadata", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  data: text("metadata").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const jobDescriptionMetadataTable = pgTable("job_description_metadata", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  data: text("jd_text").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})
