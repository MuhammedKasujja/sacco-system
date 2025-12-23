CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(50),
	"record_id" integer NOT NULL,
	"operation" char(1) NOT NULL,
	"old_values" json,
	"new_values" json,
	"changed_by" integer NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"max_amount" numeric,
	"interest_rate" numeric NOT NULL,
	"repayment_period_months" integer,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_repayments" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_id" integer,
	"repayment_date" date NOT NULL,
	"amount_paid" numeric,
	"principal_paid" numeric,
	"interest_paid" numeric,
	"balance_after" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_number" varchar(20),
	"principal_amount" numeric,
	"interest_amount" numeric,
	"total_amount" numeric,
	"disbursement_date" date,
	"status" varchar(20),
	"approved_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "loans_loan_number_unique" UNIQUE("loan_number")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_number" varchar(20),
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"id_number" varchar(20) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(20),
	"address" text,
	"join_date" date,
	"status" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "members_member_number_unique" UNIQUE("member_number"),
	CONSTRAINT "members_id_number_unique" UNIQUE("id_number"),
	CONSTRAINT "members_phone_unique" UNIQUE("phone"),
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "savings_accounts" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"product_id" integer,
	"account_number" varchar(30),
	"balance" numeric,
	"opened_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"productName" varchar(200) NOT NULL,
	"description" text,
	"interest_rate" numeric NOT NULL,
	"minimum_balance" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date,
	"member_id" integer NOT NULL,
	"account_id" integer,
	"loan_id" integer,
	"transaction_type" varchar(20),
	"amount" numeric,
	"recorded_by" integer,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "savings_accounts" ADD CONSTRAINT "savings_accounts_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;