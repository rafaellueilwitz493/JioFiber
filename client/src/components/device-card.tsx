import { Device } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Laptop, Smartphone, Monitor, Clock, ArrowUpDown, Wifi, ShieldAlert, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlockToggle = async () => {
    setIsLoading(true);
    try {
      await apiRequest("PATCH", `/api/devices/${device.id}`, {
        isBlocked: !device.isBlocked,
      });
      toast({
        title: device.isBlocked ? "Device Unblocked" : "Device Blocked",
        description: `${device.name} has been ${device.isBlocked ? "unblocked" : "blocked"} successfully.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update device status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DeviceIcon = device.name.toLowerCase().includes("phone") ? Smartphone :
                    device.name.toLowerCase().includes("mac") ? Laptop : Monitor;

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${device.isBlocked ? 'bg-muted/50' : ''}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${device.isBlocked ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full`}>
              <DeviceIcon className={`h-5 w-5 ${device.isBlocked ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <span className="flex items-center gap-2">
              {device.name}
              {device.isBlocked && (
                <ShieldAlert className="h-4 w-4 text-destructive" />
              )}
            </span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div>
                <Switch 
                  checked={!device.isBlocked} 
                  disabled={isLoading}
                  className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''} data-[state=checked]:bg-primary`}
                />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {device.isBlocked ? "Unblock Device?" : "Block Device?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {device.isBlocked 
                    ? `This will allow "${device.name}" to access the network again.`
                    : `This will prevent "${device.name}" from accessing the network.`
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleBlockToggle}
                  className={device.isBlocked ? "bg-primary" : "bg-destructive"}
                >
                  {device.isBlocked ? "Unblock" : "Block"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>{device.ipAddress}</span>
          </div>
          <div className="pl-6">{device.macAddress}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last seen {formatDistanceToNow(new Date(device.lastSeen))} ago</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <div>
            <div>↓ {Math.round(device.downloadUsage / 1024 / 1024)} MB</div>
            <div>↑ {Math.round(device.uploadUsage / 1024 / 1024)} MB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}