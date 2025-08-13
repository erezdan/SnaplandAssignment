using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Infrastructure.Persistence;

namespace Snapland.Server.Realtime.Websockets
{
    public class WebSocketMessageHandler
    {
        private readonly WebSocketManager _manager;
        private readonly AppDbContext _db;

        public WebSocketMessageHandler(WebSocketManager manager, AppDbContext db)
        {
            _manager = manager;
            _db = db;
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
                        await HandleUserActive(connection, true);
                        break;

                    case "user:inactive":
                        await HandleUserActive(connection, false);
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
            var messageType = doc.RootElement.GetProperty("type").GetString();
            var messageValue = doc.RootElement;

            await _manager.BroadcastUsersAsync(messageType!, messageValue);
        }

        private async Task HandleUserActive(WebSocketConnection sender, bool isActive)
        {
            // Set the user as active in DB
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id.ToString() == sender.UserId);
            if (user != null)
            {
                user.IsActive = isActive;
                await _db.SaveChangesAsync();
            }

            // After setting active: broadcast all users' status
            await BroadcastAllUsersStatusAsync();
        }

        public async Task BroadcastAllUsersStatusAsync()
        {
            await _manager.BroadcastUsersAsync("users_status", new object());
        }
    }
}
