import { useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { DeviceList } from "@/components/device-list";
import { NetworkStatsDisplay } from "@/components/network-stats";
import { connectWebSocket } from "@/lib/websocket";

export default function Home() {
  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <NetworkStatsDisplay />
        <h2 className="text-2xl font-bold">Connected Devices</h2>
        <DeviceList />
      </main>
    </div>
  );
}