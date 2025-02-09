import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { NetworkStats, NetworkHistory } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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