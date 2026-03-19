import { pgTable, text, timestamp, uuid, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (managed by Supabase Auth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  phone: text("phone").notNull().unique(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  aadhaarLast4: text("aadhaar_last4"),
  landId: text("land_id"),
  landArea: decimal("land_area", { precision: 10, scale: 2 }),
  beneficiaryType: text("beneficiary_type", { enum: ['individual', 'wua'] }),
  waterSource: text("water_source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Water requests table
export const waterRequests = pgTable("water_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  crop: text("crop").notNull(),
  season: text("season", { enum: ['kharif', 'rabi', 'hotWeather'] }).notNull(),
  durationDays: text("duration_days").notNull(), // Matching the SQL schema which had INTEGER, using text if Drizzle preference
  landArea: decimal("land_area", { precision: 10, scale: 2 }).notNull(),
  geoLocation: jsonb("geo_location"),
  photoUrl: text("photo_url"),
  status: text("status", { enum: ['pending', 'approved', 'rejected', 'completed'] }).default('pending'),
  billAmount: decimal("bill_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Billing table
export const billing = pgTable("billing", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  requestId: uuid("request_id").references(() => waterRequests.id, { onDelete: 'set null' }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").default(false),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertWaterRequestSchema = createInsertSchema(waterRequests);
export const selectWaterRequestSchema = createSelectSchema(waterRequests);

export const insertBillingSchema = createInsertSchema(billing);
export const selectBillingSchema = createSelectSchema(billing);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type WaterRequest = typeof waterRequests.$inferSelect;
export type NewWaterRequest = typeof waterRequests.$inferInsert;
export type Billing = typeof billing.$inferSelect;
export type NewBilling = typeof billing.$inferInsert;