using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Infrastructure.Persistence;

namespace Snapland.Server.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db) => _db = db;

        /// <summary>
        /// Get all users' display names and IsActive status.
        /// </summary>
        /// <remarks>
        /// Returns a list of all users in the system with their display name and active status.
        /// Requires JWT authentication.
        /// </remarks>
        /// <returns>
        /// Returns 200 OK with a list of UserStatusDto.
        /// </returns>
        [HttpGet("status")]
        public async Task<IActionResult> GetAllUsersStatus()
        {
            var users = await _db.Users
                .OrderBy(u => u.DisplayName)
                .Select(u => new UserStatusDto
                {
                    DisplayName = u.DisplayName,
                    IsActive = u.IsActive
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
