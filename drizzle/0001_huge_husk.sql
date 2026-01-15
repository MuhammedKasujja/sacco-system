ALTER TABLE "audit_logs" ADD COLUMN "entity_type" varchar;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "entity_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "event_type" char NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "audit_logs" DROP COLUMN "table_name";--> statement-breakpoint
ALTER TABLE "audit_logs" DROP COLUMN "record_id";--> statement-breakpoint
ALTER TABLE "audit_logs" DROP COLUMN "operation";