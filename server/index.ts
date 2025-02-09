import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { NetworkStats, NetworkHistory, Device } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mock devices data
let devices: Device[] = [
  { 
    id: 1, 
    name: "Living Room TV",
    ipAddress: "192.168.1.100",
    macAddress: "00:1A:2B:3C:4D:5E",
    isBlocked: false,
    isOnline: true,
    lastSeen: new Date(),
    downloadUsage: 1024 * 1024 * 500, // 500 MB
    uploadUsage: 1024 * 1024 * 200,   // 200 MB
  },
  { 
    id: 2, 
    name: "iPhone 13",
    ipAddress: "192.168.1.101",
    macAddress: "A1:B2:C3:D4:E5:F6",
    isBlocked: false,
    isOnline: true,
    lastSeen: new Date(),
    downloadUsage: 1024 * 1024 * 1200, // 1.2 GB
    uploadUsage: 1024 * 1024 * 300,    // 300 MB
  },
  { 
    id: 3, 
    name: "Gaming PC",
    ipAddress: "192.168.1.102",
    macAddress: "FF:EE:DD:CC:BB:AA",
    isBlocked: false,
    isOnline: true,
    lastSeen: new Date(),
    downloadUsage: 1024 * 1024 * 5000, // 5 GB
    uploadUsage: 1024 * 1024 * 1000,   // 1 GB
  },
  { 
    id: 4, 
    name: "Smart TV Bedroom",
    ipAddress: "192.168.1.103",
    macAddress: "11:22:33:44:55:66",
    isBlocked: false,
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    downloadUsage: 1024 * 1024 * 800,  // 800 MB
    uploadUsage: 1024 * 1024 * 100,    // 100 MB
  }
];

// Get all devices
app.get('/api/devices', (_req: Request, res: Response) => {
  try {
    log(`Fetching all devices. Total count: ${devices.length}`);
    res.json(devices);
  } catch (error) {
    log(`Error fetching devices: ${error}`);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Toggle device block status
app.post('/api/devices/:id/toggle-block', (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    const device = devices.find(d => d.id === deviceId);

    if (!device) {
      log(`Device not found: ${deviceId}`);
      return res.status(404).json({ error: 'Device not found' });
    }

    // Toggle the blocked status
    device.isBlocked = !device.isBlocked;

    // Update the device in our mock database
    devices = devices.map(d => d.id === deviceId ? device : d);

    log(`Device ${deviceId} ${device.isBlocked ? 'blocked' : 'unblocked'}: ${device.name}`);

    // Send the complete updated device object back
    res.json({
      ...device,
      lastSeen: new Date(), // Update last seen timestamp
    });
  } catch (error) {
    log(`Error toggling device block status: ${error}`);
    res.status(500).json({ error: 'Failed to toggle device block status' });
  }
});


// Mock data generation for network statistics
function generateMockNetworkStats(): NetworkStats {
  const now = new Date();
  const history: NetworkHistory[] = Array.from({ length: 10 }).map((_, i) => ({
    timestamp: new Date(now.getTime() - (i * 60 * 1000)), // Last 10 minutes
    downloadSpeed: Math.random() * 500_000_000 + 100_000_000, // 100-600 Mbps
    uploadSpeed: Math.random() * 300_000_000 + 50_000_000, // 50-350 Mbps
  }));

  return {
    downloadSpeed: history[0].downloadSpeed,
    uploadSpeed: history[0].uploadSpeed,
    connectedDevices: Math.floor(Math.random() * 10) + 1,
    latency: Math.floor(Math.random() * 50) + 5,
    packetLoss: Math.random() * 2,
    signalStrength: -(Math.floor(Math.random() * 30) + 50), // -50 to -80 dBm
    networkLoad: Math.random() * 100,
    peakHourUsage: new Date().getHours() >= 19 && new Date().getHours() <= 23,
    history
  };
}

// API endpoint for network statistics
app.get('/api/network/stats', (_req: Request, res: Response) => {
  const stats = generateMockNetworkStats();
  res.json(stats);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = app.listen(0); // temporary port for setup

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.close(() => {
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
    });
  });
})();