CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"balance" numeric(19, 2) DEFAULT '0.00' NOT NULL,
	"ssn_hash" char(64) NOT NULL,
	"status" "account_status" DEFAULT 'active' NOT NULL,
	"password_hash" char(64) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_ssn_hash_unique" UNIQUE("ssn_hash")
);
