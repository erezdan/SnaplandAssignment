﻿namespace Snapland.Server.Api.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = "";
        public string Email { get; set; } = "";
        public string DisplayName { get; set; } = "";
    }
}
