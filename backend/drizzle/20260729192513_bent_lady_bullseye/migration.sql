ALTER TABLE "interview_stats" RENAME COLUMN "total_interview_count" TO "resume_metadata";--> statement-breakpoint
ALTER TABLE "interview_stats" DROP CONSTRAINT "interview_stats_user_id_key";--> statement-breakpoint
ALTER TABLE "interview_stats" ADD COLUMN "github_metadata" text;--> statement-breakpoint
ALTER TABLE "interview_stats" ADD COLUMN "job_description" text;--> statement-breakpoint
ALTER TABLE "interview_stats" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "interview_stats" ALTER COLUMN "resume_metadata" SET DATA TYPE text USING "resume_metadata"::text;--> statement-breakpoint
ALTER TABLE "interview_stats" ALTER COLUMN "resume_metadata" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "interview_stats" ADD CONSTRAINT "at_least_one_metadata" CHECK ("resume_metadata" IS NOT NULL OR "github_metadata" IS NOT NULL OR "job_description" IS NOT NULL);