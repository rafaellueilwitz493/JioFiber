import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
}

export const DeviceList: React.FC = () => {
  const [devices, setDevices] = React.useState<Device[]>([
    { id: '1', name: 'Living Room TV', type: 'TV', status: 'online' },
    { id: '2', name: 'Bedroom Router', type: 'Router', status: 'online' },
    { id: '3', name: 'Kitchen Smart Device', type: 'IOT', status: 'offline' },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Connected Devices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{device.name}</h3>
                <p className="text-sm text-gray-500">{device.type}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${
                device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <Button className="w-full mt-4">
              Control Device
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
