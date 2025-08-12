using System.Text.Json;

namespace Snapland.Server.Realtime.Websockets
{
    public class WebSocketMessageHandler
    {
        private readonly WebSocketManager _manager;

        public WebSocketMessageHandler(WebSocketManager manager)
        {
            _manager = manager;
        }

        public async Task HandleMessageAsync(WebSocketConnection connection, string message)
        {
            try
            {
                var doc = JsonDocument.Parse(message);
                if (!doc.RootElement.TryGetProperty("type", out var typeProp))
                    return;

                var type = typeProp.GetString();
                switch (type)
                {
                    case "draw:start":
                    case "draw:move":
                    case "draw:end":
                        await HandleDrawingMessage(connection, doc);
                        break;

                    case "user:active":
                        await HandleUserActive(connection);
                        break;

                    default:
                        Console.WriteLine($"Unknown message type: {type}");
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling message: {ex.Message}");
            }
        }

        private async Task HandleDrawingMessage(WebSocketConnection sender, JsonDocument doc)
        {
            var raw = JsonSerializer.Serialize(doc.RootElement);
            await _manager.BroadcastAsync(raw, excludeUserId: sender.UserId);
        }

        private async Task HandleUserActive(WebSocketConnection sender)
        {
            var message = JsonSerializer.Serialize(new
            {
                type = "user:active",
                userId = sender.UserId
            });

            await _manager.BroadcastAsync(message, excludeUserId: sender.UserId);
        }
    }
}
