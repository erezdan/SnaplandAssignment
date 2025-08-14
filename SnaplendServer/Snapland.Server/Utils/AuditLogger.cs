using Serilog;
using Snapland.Server.Api.Extensions.Snapland.Server.Api.Extensions;
using System.Runtime.CompilerServices;

namespace Snapland.Server.Utils
{
    public static class AuditLogger
    {
        public static void LogUserAction(Guid userId, string action, string? metadata = null)
        {
            Log.Information("User {UserId} performed action: {Action}. Metadata: {Metadata}",
                userId, action, metadata ?? "None");
        }

        public static void LogHttpAction(
                HttpContext context,
                object? payload = null,
                [CallerMemberName] string actionName = ""
            )
        {
            try
            {                
                var path = context.Request.Path;
                var method = context.Request.Method;

                var serializedPayload = payload != null
                    ? System.Text.Json.JsonSerializer.Serialize(payload)
                    : "None";

                Log.Information("User {UserId} triggered HTTP {Method} {Path} for action {ActionName}. Payload: {Payload}",
                    method, path, actionName, serializedPayload);
            }
            catch (Exception ex) 
            {
                Log.Error(ex, "Failed to log HTTP action for {ActionName}. Error: {ErrorMessage}",
                    actionName, ex.Message);
            }
        }
    }
}
