import { useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { DeviceList } from "@/components/device-list";
import { NetworkStatsDisplay } from "@/components/network-stats";
import { AdvancedNetworkStats } from "@/components/advanced-network-stats";
import { connectWebSocket } from "@/lib/websocket";

export default function Home() {
  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your network devices and performance
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <NetworkStatsDisplay />
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Advanced Network Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Detailed insights into your network performance and usage patterns
              </p>
            </div>
            <AdvancedNetworkStats />
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Connected Devices</h2>
              <p className="text-sm text-muted-foreground">
                View and manage all devices connected to your network
              </p>
            </div>
            <DeviceList />
          </section>
        </div>
      </main>
    </div>
  );
}