import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Device } from "@shared/schema";
import { Shield, ShieldOff, Wifi, WifiOff, Download, Upload } from "lucide-react";
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
} from "./ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const DeviceList: React.FC = () => {
  const queryClient = useQueryClient();
  const [processingDeviceId, setProcessingDeviceId] = useState<number | null>(null);

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const toggleBlockMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      setProcessingDeviceId(deviceId);
      const response = await fetch(`/api/devices/${deviceId}/toggle-block`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle device block status');
      return response.json();
    },
    onSuccess: (updatedDevice) => {
      // Update the device in the cache
      queryClient.setQueryData<Device[]>(['/api/devices'], (oldDevices) => {
        if (!oldDevices) return oldDevices;
        return oldDevices.map(device => 
          device.id === updatedDevice.id ? updatedDevice : device
        );
      });
      setProcessingDeviceId(null);
    },
    onError: () => {
      setProcessingDeviceId(null);
    },
  });

  if (isLoading || !devices) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const handleBlockDevice = (deviceId: number) => {
    toggleBlockMutation.mutate(deviceId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Wifi className="h-6 w-6" />
        Connected Devices
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({devices.length} devices)
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card 
            key={device.id} 
            className={`p-4 transition-all duration-200 hover:shadow-lg ${
              device.isBlocked ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {device.name}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {device.isOnline ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {device.isOnline ? 'Online' : 'Offline'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                <p className="text-sm text-muted-foreground">{device.ipAddress}</p>
                <p className="text-xs text-muted-foreground/70">{device.macAddress}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Last seen:<br />
                {new Date(device.lastSeen).toLocaleString()}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Download className="h-4 w-4" />
                  {Math.round(device.downloadUsage / (1024 * 1024))} MB
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Upload className="h-4 w-4" />
                  {Math.round(device.uploadUsage / (1024 * 1024))} MB
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className={`w-full ${
                      device.isBlocked ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''
                    }`}
                    variant={device.isBlocked ? "destructive" : "secondary"}
                  >
                    {device.isBlocked ? (
                      <><ShieldOff className="w-4 h-4 mr-2" /> Unblock Device</>
                    ) : (
                      <><Shield className="w-4 h-4 mr-2" /> Block Device</>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {device.isBlocked ? 'Unblock Device' : 'Block Device'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to {device.isBlocked ? 'unblock' : 'block'} {device.name}?
                      {!device.isBlocked && " This will prevent the device from accessing the network."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleBlockDevice(device.id)}
                      className={device.isBlocked ? '' : 'bg-destructive hover:bg-destructive/90'}
                    >
                      {processingDeviceId === device.id ? (
                        "Processing..."
                      ) : device.isBlocked ? (
                        "Unblock"
                      ) : (
                        "Block"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};