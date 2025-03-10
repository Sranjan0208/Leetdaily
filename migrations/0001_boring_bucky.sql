ALTER TABLE "userprogress" ADD COLUMN "easy_count" integer DEFAULT 3;--> statement-breakpoint
ALTER TABLE "userprogress" ADD COLUMN "medium_count" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "userprogress" ADD COLUMN "hard_count" integer DEFAULT 1;