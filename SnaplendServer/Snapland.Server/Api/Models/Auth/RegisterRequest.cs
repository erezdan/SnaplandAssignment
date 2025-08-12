using System.Text.Json.Serialization;

namespace Snapland.Server.Api.Models.Auth
{
    public class RegisterRequest
    {
        public string Email { get; set; } = "";

        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
