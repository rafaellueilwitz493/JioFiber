import { queryClient } from "./queryClient";

let socket: WebSocket | null = null;

export function connectWebSocket() {
  if (socket) return;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  socket = new WebSocket(wsUrl);
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/network/stats"] });
    }
  };

  socket.onclose = () => {
    socket = null;
    setTimeout(connectWebSocket, 1000);
  };
}
