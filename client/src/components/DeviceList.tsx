import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Device } from "@shared/schema";
import { Shield, ShieldOff } from "lucide-react";

export const DeviceList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const toggleBlockMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      const response = await fetch(`/api/devices/${deviceId}/toggle-block`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle device block status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    },
  });

  if (isLoading || !devices) {
    return <div className="flex justify-center items-center h-48">
      <div className="animate-pulse">Loading devices...</div>
    </div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Connected Devices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className={`p-4 ${device.isBlocked ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{device.name}</h3>
                <p className="text-sm text-gray-500">{device.ipAddress}</p>
                <p className="text-xs text-gray-400">{device.macAddress}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  device.isOnline ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="text-xs text-gray-500">
                  {new Date(device.lastSeen).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span>↓ {Math.round(device.downloadUsage / (1024 * 1024))} MB</span>
                <span className="mx-2">|</span>
                <span>↑ {Math.round(device.uploadUsage / (1024 * 1024))} MB</span>
              </div>
              <Button 
                className="w-full"
                variant={device.isBlocked ? "destructive" : "secondary"}
                onClick={() => toggleBlockMutation.mutate(device.id)}
                disabled={toggleBlockMutation.isPending}
              >
                {device.isBlocked ? (
                  <><ShieldOff className="w-4 h-4 mr-2" /> Unblock Device</>
                ) : (
                  <><Shield className="w-4 h-4 mr-2" /> Block Device</>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};