ALTER TABLE "loan_repayments" DROP CONSTRAINT "loan_repayments_loan_id_loans_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" DROP CONSTRAINT "loans_loan_product_id_loan_products_product_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" DROP CONSTRAINT "loans_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" DROP CONSTRAINT "loans_approved_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_loan_product_id_loan_products_product_id_fk" FOREIGN KEY ("loan_product_id") REFERENCES "public"."loan_products"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;