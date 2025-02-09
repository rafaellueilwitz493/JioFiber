import { useQuery } from "@tanstack/react-query";
import { Device } from "@shared/schema";
import { DeviceCard } from "./device-card";
import { Skeleton } from "@/components/ui/skeleton";

export function DeviceList() {
  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ["/api/devices"],
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {devices?.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
