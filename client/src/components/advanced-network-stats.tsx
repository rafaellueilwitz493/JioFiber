import { useQuery } from "@tanstack/react-query";
import { NetworkStats } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Upload, Download, Activity, Signal, Percent, AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

  // Network load colors and status
  const getLoadStatus = (load: number) => {
    if (load < 30) return { color: "emerald", text: "Low" };
    if (load < 70) return { color: "blue", text: "Moderate" };
    return { color: "red", text: "High" };
  };

  const loadStatus = getLoadStatus(stats.networkLoad);
  const loadData = [{ name: "Current", load: stats.networkLoad }];

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

      {/* Enhanced Network Load Card */}
      <Card className={cn(
        "col-span-full hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-background to-background/80",
        "border-2",
        stats.networkLoad > 70 ? "border-red-500/20 shadow-red-500/10" :
        stats.networkLoad > 30 ? "border-blue-500/20 shadow-blue-500/10" :
        "border-emerald-500/20 shadow-emerald-500/10"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full bg-gradient-to-br",
                stats.networkLoad > 70 ? "from-red-100 to-red-200 dark:from-red-950 dark:to-red-900" :
                stats.networkLoad > 30 ? "from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900" :
                "from-emerald-100 to-emerald-200 dark:from-emerald-950 dark:to-emerald-900"
              )}>
                <Percent className={cn(
                  "h-5 w-5",
                  stats.networkLoad > 70 ? "text-red-600 dark:text-red-400" :
                  stats.networkLoad > 30 ? "text-blue-600 dark:text-blue-400" :
                  "text-emerald-600 dark:text-emerald-400"
                )} />
              </div>
              <span>Network Load</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
              stats.networkLoad > 70 ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
              stats.networkLoad > 30 ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
            )}>
              {loadStatus.text} Load
              {stats.networkLoad > 70 && (
                <AlertTriangle className="h-4 w-4 animate-pulse" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadData}>
                  <defs>
                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="0%" 
                        stopColor={
                          stats.networkLoad > 70 ? "rgb(239, 68, 68)" :
                          stats.networkLoad > 30 ? "rgb(59, 130, 246)" :
                          "rgb(16, 185, 129)"
                        }
                        stopOpacity={0.3}
                      />
                      <stop 
                        offset="100%" 
                        stopColor={
                          stats.networkLoad > 70 ? "rgb(239, 68, 68)" :
                          stats.networkLoad > 30 ? "rgb(59, 130, 246)" :
                          "rgb(16, 185, 129)"
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="opacity-30"
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke="currentColor"
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="currentColor"
                    className="text-muted-foreground text-xs"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const value = payload[0].value as number;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Load:</span>
                            <span className="font-medium">{value}%</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="load"
                    name="Network Load"
                    stroke={
                      stats.networkLoad > 70 ? "rgb(239, 68, 68)" :
                      stats.networkLoad > 30 ? "rgb(59, 130, 246)" :
                      "rgb(16, 185, 129)"
                    }
                    fill="url(#loadGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {stats.peakHourUsage && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full font-medium">
                  <Activity className="h-4 w-4" />
                  Peak Hour Usage
                </span>
              )}
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium",
                stats.networkLoad > 70 ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                stats.networkLoad > 30 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              )}>
                <Signal className="h-4 w-4" />
                {stats.networkLoad}% Utilization
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}