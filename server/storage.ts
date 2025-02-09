import { Device, InsertDevice, NetworkStats, InsertNetworkStats } from "@shared/schema";

export interface IStorage {
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  updateDevice(id: number, updates: Partial<Device>): Promise<Device>;
  createDevice(device: InsertDevice): Promise<Device>;
  getLatestNetworkStats(): Promise<NetworkStats>;
  addNetworkStats(stats: InsertNetworkStats): Promise<NetworkStats>;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private networkStats: Map<number, NetworkStats>;
  private deviceId: number = 1;
  private statsId: number = 1;

  constructor() {
    this.devices = new Map();
    this.networkStats = new Map();

    // Add some sample devices
    this.createDevice({
      name: "iPhone 13",
      ipAddress: "192.168.1.100",
      macAddress: "00:11:22:33:44:55",
      isBlocked: false,
      isOnline: true,
    });
    this.createDevice({
      name: "MacBook Pro",
      ipAddress: "192.168.1.101",
      macAddress: "AA:BB:CC:DD:EE:FF",
      isBlocked: false,
      isOnline: true,
    });
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async updateDevice(id: number, updates: Partial<Device>): Promise<Device> {
    const device = this.devices.get(id);
    if (!device) throw new Error("Device not found");

    const updatedDevice = { ...device, ...updates };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const id = this.deviceId++;
    const newDevice: Device = {
      id,
      ...device,
      isBlocked: device.isBlocked ?? false,
      isOnline: device.isOnline ?? true,
      lastSeen: new Date(),
      downloadUsage: 0,
      uploadUsage: 0,
    };
    this.devices.set(id, newDevice);
    return newDevice;
  }

  async getLatestNetworkStats(): Promise<NetworkStats> {
    const stats = Array.from(this.networkStats.values());
    if (stats.length === 0) {
      return this.addNetworkStats({
        downloadSpeed: 100_000_000, // 100 Mbps
        uploadSpeed: 50_000_000, // 50 Mbps
        connectedDevices: this.devices.size,
      });
    }
    return stats[stats.length - 1];
  }

  async addNetworkStats(stats: InsertNetworkStats): Promise<NetworkStats> {
    const id = this.statsId++;
    const newStats: NetworkStats = {
      id,
      timestamp: new Date(),
      ...stats,
    };
    this.networkStats.set(id, newStats);
    return newStats;
  }
}

export const storage = new MemStorage();