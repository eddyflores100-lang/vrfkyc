CREATE TABLE `vrf_accounts` (
	`account_key` text PRIMARY KEY NOT NULL,
	`audience` text DEFAULT 'person' NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT "account_audience" CHECK("vrf_accounts"."audience" IN ('person', 'business', 'developer')),
	CONSTRAINT "account_plan" CHECK("vrf_accounts"."plan" = 'free')
);
--> statement-breakpoint
CREATE TABLE `vrf_monthly_usage` (
	`account_key` text NOT NULL,
	`period` text NOT NULL,
	`used` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`account_key`, `period`),
	CONSTRAINT "usage_bound" CHECK("vrf_monthly_usage"."used" BETWEEN 0 AND 5)
);
