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
        private readonly UserCacheService _userCacheService;

        public AuthController(AppDbContext db, ITokenService tokenService, UserCacheService userCacheService)
        {
            _db = db;
            _tokenService = tokenService;
            _userCacheService = userCacheService;
        }

        /// <summary>
        /// Register a new user account.
        /// </summary>
        /// <remarks>
        /// Creates a new user with the given credentials.  
        /// On success, returns an authentication token.
        /// </remarks>
        /// <param name="req">The registration details (email, password, etc.).</param>
        /// <returns>
        /// 201 Created with a JWT token on success,  
        /// or 400 Bad Request if registration fails (e.g., user already exists).
        /// </returns>
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
            
            await _userCacheService.LoadInitialUsersAsync();

            return Ok(new AuthResponse { Token = token, Email = user.Email, DisplayName = user.DisplayName });
        }

        /// <summary>
        /// Authenticate a user and return a JWT token.
        /// </summary>
        /// <remarks>
        /// Validates the provided credentials and issues a JWT on success.
        /// </remarks>
        /// <param name="req">The login details (email and password).</param>
        /// <returns>
        /// 200 OK with an authentication token on success,  
        /// or 401 Unauthorized if credentials are invalid.
        /// </returns>
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
