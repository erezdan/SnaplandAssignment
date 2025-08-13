using Snapland.Server.Api.DTOs;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace Snapland.Server.Realtime.Websockets
{
    public class WebSocketManager
    {
        private readonly ConcurrentDictionary<string, WebSocketConnection> _connections = new();

        public void AddConnection(WebSocketConnection connection)
        {
            _connections[connection.ConnectionId.ToString()] = connection;
        }

        public void RemoveConnection(Guid connectionId)
        {
            _connections.TryRemove(connectionId.ToString(), out _);
        }

        public IEnumerable<WebSocketConnection> GetAllConnections() => _connections.Values;

        public async Task BroadcastAsync(string message, string excludeUserId = "")
        {
            var buffer = Encoding.UTF8.GetBytes(message);

            foreach (var conn in _connections.Values)
            {
                if (conn.UserId != excludeUserId && conn.IsAlive)
                {
                    await conn.Socket.SendAsync(
                        new ArraySegment<byte>(buffer),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
            }
        }

        public async Task BroadcastUsersStatusAsync(List<UserStatusDto> users)
        {
            var msg = new
            {
                type = "users_status",
                users
            };
            var json = JsonSerializer.Serialize(msg);
            await BroadcastAsync(json);
        }
    }
}
