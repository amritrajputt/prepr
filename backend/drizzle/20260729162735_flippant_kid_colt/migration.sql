CREATE TYPE "message_type" AS ENUM('user', 'agent');--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" varchar(255) PRIMARY KEY,
	"type" "message_type" NOT NULL,
	"messages" text[] NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"interviewStatsId" integer NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_interviewStatsId_interview_stats_id_fkey" FOREIGN KEY ("interviewStatsId") REFERENCES "interview_stats"("id") ON DELETE CASCADE;