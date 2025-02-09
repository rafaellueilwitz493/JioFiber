import { Device, InsertDevice, NetworkStats, InsertNetworkStats, devices, networkStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  updateDevice(id: number, updates: Partial<Device>): Promise<Device>;
  createDevice(device: InsertDevice): Promise<Device>;
  getLatestNetworkStats(): Promise<NetworkStats>;
  addNetworkStats(stats: InsertNetworkStats): Promise<NetworkStats>;
}

export class DatabaseStorage implements IStorage {
  async getDevices(): Promise<Device[]> {
    return await db.select().from(devices);
  }

  async getDevice(id: number): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async updateDevice(id: number, updates: Partial<Device>): Promise<Device> {
    const [device] = await db
      .update(devices)
      .set({ ...updates })
      .where(eq(devices.id, id))
      .returning();

    if (!device) {
      throw new Error("Device not found");
    }

    return device;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const [newDevice] = await db
      .insert(devices)
      .values({
        ...device,
        lastSeen: new Date(),
        downloadUsage: 0,
        uploadUsage: 0,
      })
      .returning();

    return newDevice;
  }

  async getLatestNetworkStats(): Promise<NetworkStats> {
    const [stats] = await db
      .select()
      .from(networkStats)
      .orderBy(desc(networkStats.timestamp))
      .limit(1);

    if (!stats) {
      // Create initial stats if none exist
      return this.addNetworkStats({
        downloadSpeed: 100_000_000, // 100 Mbps
        uploadSpeed: 50_000_000, // 50 Mbps
        connectedDevices: 0,
        latency: 20,
        packetLoss: 0,
        signalStrength: -55,
        networkLoad: 0,
        peakHourUsage: false,
      });
    }

    return stats;
  }

  async addNetworkStats(stats: InsertNetworkStats): Promise<NetworkStats> {
    const now = new Date();
    const hour = now.getHours();
    const peakHourUsage = hour >= 19 && hour <= 23;

    const [newStats] = await db
      .insert(networkStats)
      .values({
        ...stats,
        timestamp: now,
        peakHourUsage,
      })
      .returning();

    return newStats;
  }
}

export const storage = new DatabaseStorage();