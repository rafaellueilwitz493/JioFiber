import { pgTable, text, serial, integer, boolean, timestamp, real, array } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Network history entry schema
export const networkHistorySchema = z.object({
  timestamp: z.date(),
  downloadSpeed: z.number(),
  uploadSpeed: z.number(),
});

// Network stats schema without database
export const networkStatsSchema = z.object({
  downloadSpeed: z.number(),
  uploadSpeed: z.number(),
  connectedDevices: z.number(),
  latency: z.number(),
  packetLoss: z.number(),
  signalStrength: z.number(),
  networkLoad: z.number(),
  peakHourUsage: z.boolean(),
  history: z.array(networkHistorySchema)
});

export type NetworkHistory = z.infer<typeof networkHistorySchema>;
export type NetworkStats = z.infer<typeof networkStatsSchema>;


export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull(),
  macAddress: text("mac_address").notNull(),
  isBlocked: boolean("is_blocked").notNull().default(false),
  isOnline: boolean("is_online").notNull().default(true),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  downloadUsage: integer("download_usage").notNull().default(0), // in bytes
  uploadUsage: integer("upload_usage").notNull().default(0), // in bytes
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  lastSeen: true,
  downloadUsage: true,
  uploadUsage: true,
});

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export const networkHistory = pgTable("network_history", {
  id: serial("id").primaryKey(),
  network_stats_id: integer("network_stats_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  downloadSpeed: integer("download_speed").notNull(),
  uploadSpeed: integer("upload_speed").notNull(),
});

export const networkStats = pgTable("network_stats", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  downloadSpeed: integer("download_speed").notNull(), // in bits/s
  uploadSpeed: integer("upload_speed").notNull(), // in bits/s
  connectedDevices: integer("connected_devices").notNull(),
  latency: integer("latency").notNull().default(0), // in milliseconds
  packetLoss: real("packet_loss").notNull().default(0), // percentage
  signalStrength: integer("signal_strength").notNull().default(0), // in dBm
  networkLoad: real("network_load").notNull().default(0), // percentage
  peakHourUsage: boolean("peak_hour_usage").notNull().default(false),
  // Added history field.  Type needs adjustment based on actual database structure.
});


export const insertNetworkStatsSchema = createInsertSchema(networkStats).omit({
  id: true,
  timestamp: true,
});

export type InsertNetworkStats = z.infer<typeof insertNetworkStatsSchema>;
//export type NetworkStats = typeof networkStats.$inferSelect;