import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertDeviceSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  app.get("/api/devices", async (req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });

  app.post("/api/devices", async (req, res) => {
    const parsed = insertDeviceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid device data" });
    }
    
    const device = await storage.createDevice(parsed.data);
    broadcastUpdate(wss);
    res.json(device);
  });

  app.patch("/api/devices/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid device ID" });
    }

    try {
      const device = await storage.updateDevice(id, req.body);
      broadcastUpdate(wss);
      res.json(device);
    } catch (error) {
      res.status(404).json({ error: "Device not found" });
    }
  });

  app.get("/api/network/stats", async (req, res) => {
    const stats = await storage.getLatestNetworkStats();
    res.json(stats);
  });

  // Simulate network updates
  setInterval(async () => {
    const stats = await storage.addNetworkStats({
      downloadSpeed: Math.floor(Math.random() * 200_000_000), // 0-200 Mbps
      uploadSpeed: Math.floor(Math.random() * 100_000_000), // 0-100 Mbps
      connectedDevices: (await storage.getDevices()).filter(d => d.isOnline).length,
    });
    broadcastUpdate(wss);
  }, 5000);

  return httpServer;
}

function broadcastUpdate(wss: WebSocketServer) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "update" }));
    }
  });
}
