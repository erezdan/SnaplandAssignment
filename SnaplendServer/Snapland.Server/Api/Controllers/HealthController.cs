using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snapland.Server.Infrastructure.Persistence;
using Npgsql;

namespace Snapland.Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;

        public HealthController(AppDbContext dbContext, IConfiguration config)
        {
            _dbContext = dbContext;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            var checks = new Dictionary<string, object>();
            var status = "Healthy";

            // DB connectivity check
            try
            {
                var canConnect = await _dbContext.Database.CanConnectAsync();
                checks["Database"] = canConnect ? "OK" : "Failed";
                if (!canConnect) status = "Unhealthy";
            }
            catch (Exception ex)
            {
                checks["Database"] = $"Error: {ex.Message}";
                status = "Unhealthy";
            }

            // PostGIS check
            try
            {
                await using var conn = new NpgsqlConnection(_config.GetConnectionString("Default"));
                await conn.OpenAsync();

                await using var cmd = new NpgsqlCommand("SELECT PostGIS_Version();", conn);
                var version = await cmd.ExecuteScalarAsync();
                checks["PostGIS"] = version?.ToString() ?? "Not installed";
                if (version == null) status = "Degraded";
            }
            catch (Exception ex)
            {
                checks["PostGIS"] = $"Error: {ex.Message}";
                status = "Unhealthy";
            }

            return Ok(new
            {
                Status = status,
                Timestamp = DateTime.UtcNow,
                Checks = checks
            });
        }
    }
}
