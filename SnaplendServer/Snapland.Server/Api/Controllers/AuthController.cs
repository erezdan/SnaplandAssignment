using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snapland.Server.Api.Models.Auth;
using Snapland.Server.Api.Services;
using Snapland.Server.Domain.Entities;
using Snapland.Server.Infrastructure.Persistence;
using System.Security.Cryptography;
using System.Text;

namespace Snapland.Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
        {
            if (await _db.Users.AnyAsync(x => x.Email == req.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = req.Email,
                DisplayName = req.DisplayName,
                PasswordHash = Hash(req.Password),
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _tokenService.CreateToken(user.Id, user.Email);
            return Ok(new AuthResponse { Token = token, Email = user.Email, DisplayName = user.DisplayName });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == req.Email);
            if (user is null || user.PasswordHash != Hash(req.Password))
                return Unauthorized("Invalid email or password");

            var token = _tokenService.CreateToken(user.Id, user.Email);
            return Ok(new AuthResponse { Token = token, Email = user.Email, DisplayName = user.DisplayName });
        }

        private static string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(bytes);
        }
    }
}
