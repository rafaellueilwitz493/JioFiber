import { useQuery } from "@tanstack/react-query";
import { NetworkStats } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Upload, Download, Activity, Signal, Percent } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export function AdvancedNetworkStats() {
  const { data: stats, isLoading } = useQuery<NetworkStats>({
    queryKey: ["/api/network/stats"],
    refetchInterval: 5000,
  });

  if (isLoading || !stats) {
    return null;
  }

  const downloadMbps = Math.round(stats.downloadSpeed / 1_000_000);
  const uploadMbps = Math.round(stats.uploadSpeed / 1_000_000);
  const networkQuality = stats.latency < 30 && stats.packetLoss < 1 ? "Excellent" :
                        stats.latency < 50 && stats.packetLoss < 2 ? "Good" : "Fair";

  return (
    <div className="grid gap-4">
      {/* Network Quality Score */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{networkQuality}</div>
            <div className="text-sm text-muted-foreground">
              Latency: {stats.latency}ms | Packet Loss: {stats.packetLoss.toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Download Speed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadMbps} Mbps</div>
          </CardContent>
        </Card>

        {/* Upload Speed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadMbps} Mbps</div>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signal className="h-5 w-5" />
              Signal Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signalStrength} dBm</div>
            <div className="text-sm text-muted-foreground">
              {stats.signalStrength > -60 ? "Strong" : 
               stats.signalStrength > -70 ? "Good" : "Fair"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Load */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Network Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ name: "Current", load: stats.networkLoad }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  name="Network Load %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-muted-foreground text-center">
            {stats.peakHourUsage && "Peak Hour Usage"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
