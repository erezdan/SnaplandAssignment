using System.Net.WebSockets;

namespace Snapland.Server.Realtime.Websockets
{
    public class WebSocketConnection
    {
        public Guid ConnectionId { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public WebSocket Socket { get; set; }

        public bool IsAlive => Socket.State == WebSocketState.Open;

        public WebSocketConnection(string userId, WebSocket socket)
        {
            UserId = userId;
            Socket = socket;
        }
    }
}
