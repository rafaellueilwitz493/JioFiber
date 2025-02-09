import { useQuery } from "@tanstack/react-query";
import { NetworkStats as NetworkStatsType } from "@shared/schema";
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
  const { data: stats, isLoading } = useQuery<NetworkStatsType>({
    queryKey: ["/api/network/stats"],
    refetchInterval: 5000,
  });

  if (isLoading || !stats) {
    return null;
  }

  const downloadMbps = Math.round(stats.downloadSpeed / 1_000_000);
  const uploadMbps = Math.round(stats.uploadSpeed / 1_000_000);

  const chartData = [
    { name: "Current", download: downloadMbps, upload: uploadMbps },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-200">
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

      <Card className="hover:shadow-lg transition-shadow duration-200">
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

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Wifi className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Connected Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.connectedDevices}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            Network Speed History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="download"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Download"
                />
                <Line
                  type="monotone"
                  dataKey="upload"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Upload"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}