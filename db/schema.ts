import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey, check } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('vrf_accounts', {
  accountKey: text('account_key').primaryKey(),
  audience: text('audience').notNull().default('person'),
  plan: text('plan').notNull().default('free'),
  createdAt: text('created_at').notNull(),
  termsVersion: text('terms_version'),
  acceptedAt: text('accepted_at'),
  usePurpose: text('use_purpose'),
}, t => [
  check('account_audience', sql`${t.audience} IN ('person', 'business', 'developer')`),
  check('account_plan', sql`${t.plan} = 'free'`),
]);

export const monthlyUsage = sqliteTable('vrf_monthly_usage', {
  accountKey: text('account_key').notNull(),
  period: text('period').notNull(),
  used: integer('used').notNull().default(0),
}, t => [
  primaryKey({ columns: [t.accountKey, t.period] }),
  check('usage_bound', sql`${t.used} BETWEEN 0 AND 5`),
]);
