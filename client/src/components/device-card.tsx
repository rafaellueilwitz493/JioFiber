import { Device } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Laptop, Smartphone, Monitor, Clock, ArrowUpDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { toast } = useToast();

  const handleBlockToggle = async () => {
    try {
      await apiRequest("PATCH", `/api/devices/${device.id}`, {
        isBlocked: !device.isBlocked,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update device status",
        variant: "destructive",
      });
    }
  };

  const DeviceIcon = device.name.toLowerCase().includes("phone") ? Smartphone :
                    device.name.toLowerCase().includes("mac") ? Laptop : Monitor;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DeviceIcon className="h-5 w-5" />
            <span>{device.name}</span>
          </div>
          <Switch checked={!device.isBlocked} onCheckedChange={handleBlockToggle} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-sm text-muted-foreground">
          <div>{device.ipAddress}</div>
          <div>{device.macAddress}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last seen {formatDistanceToNow(new Date(device.lastSeen))} ago</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <span>
            ↓ {Math.round(device.downloadUsage / 1024 / 1024)} MB 
            ↑ {Math.round(device.uploadUsage / 1024 / 1024)} MB
          </span>
        </div>
      </CardContent>
    </Card>
  );
}