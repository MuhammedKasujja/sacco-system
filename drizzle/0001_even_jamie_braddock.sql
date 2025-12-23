ALTER TABLE "loan_repayments" ALTER COLUMN "loan_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "loan_products" ADD COLUMN "min_amount" numeric;--> statement-breakpoint
ALTER TABLE "loan_repayments" ADD COLUMN "status" varchar(20);--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "loan_product_id" integer;--> statement-breakpoint
ALTER TABLE "savings_products" ADD COLUMN "product_name" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_loan_product_id_loan_products_product_id_fk" FOREIGN KEY ("loan_product_id") REFERENCES "public"."loan_products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_accounts" ADD CONSTRAINT "savings_accounts_product_id_savings_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."savings_products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_savings_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."savings_accounts"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_products" DROP COLUMN "productName";