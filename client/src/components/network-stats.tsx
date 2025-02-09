import { useQuery } from "@tanstack/react-query";
import { NetworkStats as NetworkStatsType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Upload, Download } from "lucide-react";
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
    <div className="grid gap-4 md:grid-cols-3">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connected Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.connectedDevices}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Network Speed History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="download"
                  stroke="#2563eb"
                  name="Download"
                />
                <Line
                  type="monotone"
                  dataKey="upload"
                  stroke="#16a34a"
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