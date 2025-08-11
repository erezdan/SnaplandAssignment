namespace Snapland.Server.Api.Models.Auth
{
    public class RegisterRequest
    {
        public string Email { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
