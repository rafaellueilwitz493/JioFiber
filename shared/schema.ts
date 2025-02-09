import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
});

export const insertNetworkStatsSchema = createInsertSchema(networkStats).omit({
  id: true,
  timestamp: true,
});

export type InsertNetworkStats = z.infer<typeof insertNetworkStatsSchema>;
export type NetworkStats = typeof networkStats.$inferSelect;