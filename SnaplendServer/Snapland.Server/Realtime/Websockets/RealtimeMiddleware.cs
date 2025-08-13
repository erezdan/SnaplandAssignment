using Microsoft.EntityFrameworkCore;
using Snapland.Server.Infrastructure.Authentication;
using Snapland.Server.Infrastructure.Persistence;
using System.Net.WebSockets;
using System.Text;

namespace Snapland.Server.Realtime.Websockets
{
    public class RealtimeMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtTokenHelper _tokenHelper;

        public RealtimeMiddleware(
            RequestDelegate next,
            JwtTokenHelper tokenHelper
        )
        {
            _next = next;
            _tokenHelper = tokenHelper;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only handle WebSocket requests on the /ws path
            if (context.Request.Path == "/ws")
            {
                if (!context.WebSockets.IsWebSocketRequest)
                {
                    context.Response.StatusCode = 400;
                    return;
                }

                var token = context.Request.Query["token"].ToString();
                var userId = ValidateTokenAndExtractUserId(token);

                if (string.IsNullOrWhiteSpace(token) || userId == null)
                {
                    context.Response.StatusCode = 401;
                    return;
                }

                // Resolve scoped services per-request
                var db = context.RequestServices.GetRequiredService<AppDbContext>();
                var messageHandler = context.RequestServices.GetRequiredService<WebSocketMessageHandler>();

                // Accept the WebSocket connection
                var socket = await context.WebSockets.AcceptWebSocketAsync();
                var connection = new WebSocketConnection(userId, socket);
                var manager = context.RequestServices.GetRequiredService<WebSocketManager>();
                manager.AddConnection(connection);

                // Broadcast updated user status to all clients
                await messageHandler.BroadcastAllUsersStatusAsync();

                // Start handling WebSocket messages
                await HandleConnectionAsync(connection, messageHandler);

                // On disconnect, set user inactive and broadcast again
                manager.RemoveConnection(connection.ConnectionId);

                await messageHandler.BroadcastAllUsersStatusAsync();
            }
            else
            {
                await _next(context);
            }
        }

        // Validate the JWT and extract the user ID
        private string? ValidateTokenAndExtractUserId(string token)
        {
            return _tokenHelper.GetUserIdFromToken(token);
        }

        // Handle WebSocket messages for a connection
        private async Task HandleConnectionAsync(WebSocketConnection connection, WebSocketMessageHandler handler)
        {
            var buffer = new byte[4096];

            try
            {
                while (connection.IsAlive)
                {
                    var result = await connection.Socket.ReceiveAsync(
                        new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Close)
                        break;

                    var msg = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    await handler.HandleMessageAsync(connection, msg);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WebSocket] Error: {ex.Message}");
            }
            finally
            {
                await connection.Socket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
            }
        }

        // Set user's IsActive flag in the database
        private async Task SetUserActive(AppDbContext db, string userId, bool isActive)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user != null)
            {
                user.IsActive = isActive;
                await db.SaveChangesAsync();
            }
        }
    }
}
