import { useQuery } from "@tanstack/react-query";
import { NetworkStats } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Upload, Download, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function NetworkStatsDisplay() {
  const { data: stats, isLoading } = useQuery<NetworkStats>({
    queryKey: ["/api/network/stats"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading || !stats) {
    return <div className="flex justify-center items-center h-48">
      <div className="animate-pulse">Loading network statistics...</div>
    </div>;
  }

  const downloadMbps = Math.round(stats.downloadSpeed / 1_000_000);
  const uploadMbps = Math.round(stats.uploadSpeed / 1_000_000);

  const chartData = stats.history.map((entry) => ({
    name: new Date(entry.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }),
    download: Math.round(entry.downloadSpeed / 1_000_000),
    upload: Math.round(entry.uploadSpeed / 1_000_000),
  })).reverse(); // Show newest data on the right

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200 border-blue-100 dark:border-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Download Speed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{downloadMbps} Mbps</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-green-100 dark:border-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            Upload Speed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{uploadMbps} Mbps</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200 border-purple-100 dark:border-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Wifi className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Connected Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.connectedDevices}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Network Speed History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                />
                <YAxis 
                  stroke="currentColor"
                  className="text-muted-foreground text-xs"
                  label={{ value: 'Speed (Mbps)', angle: -90, position: 'insideLeft' }}
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
                <Line
                  type="monotone"
                  dataKey="download"
                  name="Download"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="upload"
                  name="Upload"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}