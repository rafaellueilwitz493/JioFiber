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

  const qualityColor = networkQuality === "Excellent" ? "text-green-500 dark:text-green-400" :
                      networkQuality === "Good" ? "text-blue-500 dark:text-blue-400" :
                      "text-yellow-500 dark:text-yellow-400";

  return (
    <div className="grid gap-4">
      {/* Network Quality Score */}
      <Card className="col-span-full border-primary/20 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Network Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${qualityColor}`}>{networkQuality}</div>
            <div className="text-sm space-x-4">
              <span className="text-blue-500 dark:text-blue-400">Latency: {stats.latency}ms</span>
              <span className="text-purple-500 dark:text-purple-400">Packet Loss: {stats.packetLoss.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Download Speed */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-blue-100 dark:border-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Download Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{downloadMbps} Mbps</div>
          </CardContent>
        </Card>

        {/* Upload Speed */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-green-100 dark:border-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Upload Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{uploadMbps} Mbps</div>
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-indigo-100 dark:border-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <Signal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              Signal Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.signalStrength} dBm</div>
            <div className="text-sm text-muted-foreground">
              {stats.signalStrength > -60 ? "Strong" : 
               stats.signalStrength > -70 ? "Good" : "Fair"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Load */}
      <Card className="col-span-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            Network Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ name: "Current", load: stats.networkLoad }]}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="load"
                  name="Network Load %"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-center">
            {stats.peakHourUsage && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full">
                <Activity className="h-4 w-4" />
                Peak Hour Usage
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}