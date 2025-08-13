using Snapland.Server.Api.DTOs;
using Snapland.Server.Api.Services;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Snapland.Server.Realtime.Websockets
{
    public class WebSocketManager
    {
        private readonly ConcurrentDictionary<string, WebSocketConnection> _connections = new();
        private UserCacheService _userCache;

        public WebSocketManager(UserCacheService userCache)
        {
            _userCache = userCache;
        }

        public void AddConnection(WebSocketConnection connection)
        {
            _connections[connection.ConnectionId.ToString()] = connection;
        }

        public void RemoveConnection(Guid connectionId)
        {
            _connections.TryRemove(connectionId.ToString(), out _);
        }

        public IEnumerable<WebSocketConnection> GetAllConnections() => _connections.Values;

        public async Task BroadcastUsersAsync(string msgType, object msgValue, string? excludeUserId = null)
        {
            var users = _userCache.GetActiveUsers(excludeUserId != null ? Guid.Parse(excludeUserId) : null);
            if (users.Count == 0)
                return;

            if (msgType == "users_status") msgValue = users;

            var msg = new
            {
                type = msgType,
                value = msgValue
            };

            var json = JsonSerializer.Serialize(msg);
            var buffer = Encoding.UTF8.GetBytes(json);

            await Parallel.ForEachAsync(users, async (user, _) =>
            {
                var conn = _connections.Values.FirstOrDefault(c => c.UserId == user.Id.ToString() && c.IsAlive);
                if (conn != null)
                {
                    await conn.Socket.SendAsync(
                        new ArraySegment<byte>(buffer),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
            });
        }
    }
}
