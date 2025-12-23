ALTER TABLE "transactions" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;