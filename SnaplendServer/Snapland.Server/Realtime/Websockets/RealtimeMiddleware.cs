using Snapland.Server.Infrastructure.Authentication;
using System.Net.WebSockets;
using System.Text;

namespace Snapland.Server.Realtime.Websockets
{
    public class RealtimeMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly WebSocketManager _manager;
        private readonly WebSocketMessageHandler _messageHandler;
        private readonly JwtTokenHelper _tokenHelper;

        public RealtimeMiddleware(RequestDelegate next, WebSocketManager manager, JwtTokenHelper tokenHelper)
        {
            _next = next;
            _manager = manager;
            _messageHandler = new WebSocketMessageHandler(manager);
            _tokenHelper = tokenHelper;
        }

        public async Task InvokeAsync(HttpContext context)
        {
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

                var socket = await context.WebSockets.AcceptWebSocketAsync();
                var connection = new WebSocketConnection(userId, socket);
                _manager.AddConnection(connection);

                await HandleConnectionAsync(connection);

                _manager.RemoveConnection(connection.ConnectionId);
            }
            else
            {
                await _next(context);
            }
        }

        private string? ValidateTokenAndExtractUserId(string token)
        {            
            return _tokenHelper.GetUserIdFromToken(token);
        }

        private async Task HandleConnectionAsync(WebSocketConnection connection)
        {
            var buffer = new byte[4096];

            try
            {
                while (connection.IsAlive)
                {
                    var result = await connection.Socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Close)
                        break;

                    var msg = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    await _messageHandler.HandleMessageAsync(connection, msg);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WebSocket] Error: {ex.Message}");
            }
            finally
            {
                await connection.Socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
            }
        }
    }
}
