ALTER TABLE "project" DROP CONSTRAINT "project_key_key";--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "estimated_hours" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "tags" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_key_organization_key" UNIQUE("key","organization_id");