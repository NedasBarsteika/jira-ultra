ALTER TABLE "task" ALTER COLUMN "estimated_hours" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "tags" SET DEFAULT '{}';