CREATE TABLE "interview_stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "interview_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"total_score" integer NOT NULL,
	"total_interview_count" integer NOT NULL,
	"feedback" text NOT NULL,
	"relevance" text NOT NULL,
	"clarity" text NOT NULL,
	"depth" text NOT NULL,
	"experience" text NOT NULL,
	"user_id" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "overall_stats" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "overall_stats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"total_score" integer NOT NULL,
	"total_interview_count" integer NOT NULL,
	"feedback" text NOT NULL,
	"gap_analysis" text NOT NULL,
	"user_id" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interview_stats" ADD CONSTRAINT "interview_stats_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "overall_stats" ADD CONSTRAINT "overall_stats_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;