using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Api.Extensions.Snapland.Server.Api.Extensions;
using Snapland.Server.Infrastructure.Persistence;

namespace Snapland.Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/areas")]
public class AreaVersionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AreaVersionsController(AppDbContext db) => _db = db;

    [HttpPost("{areaId:guid}/versions")]
    public async Task<IActionResult> CreateVersion([FromRoute] Guid areaId, [FromBody] AreaVersionCreateDto dto)
    {
        var userId = User.GetUserId();
        var area = await _db.Areas.FirstOrDefaultAsync(a => a.Id == areaId && !a.IsDeleted);
        if (area == null) return NotFound("Area not found");

        if (dto.Coordinates is null || dto.Coordinates.Length < 4) return BadRequest("Invalid polygon");

        var gf = NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
        var shell = dto.Coordinates.Select(c => new Coordinate(c[0], c[1])).ToArray();
        if (shell[0].X != shell[^1].X || shell[0].Y != shell[^1].Y) shell = shell.Concat(new[] { shell[0] }).ToArray();

        var polygon = gf.CreatePolygon(shell);

        var nextVersion = await _db.AreaVersions
            .Where(v => v.AreaId == areaId)
            .OrderByDescending(v => v.VersionNumber)
            .Select(v => v.VersionNumber)
            .FirstOrDefaultAsync() + 1;

        var version = new Domain.Entities.AreaVersion
        {
            AreaId = areaId,
            VersionNumber = nextVersion,
            Name = dto.Name,
            Geometry = polygon,
            EditedByUserId = userId
        };

        _db.AreaVersions.Add(version);
        await _db.SaveChangesAsync();

        return Ok(new AreaVersionResultDto
        {
            Id = version.Id,
            VersionNumber = version.VersionNumber,
            Name = version.Name,
            CreatedAt = version.CreatedAt,
            Coordinates = version.Geometry.Coordinates.Select(c => new[] { c.X, c.Y })
        });
    }

    [HttpGet("{areaId}/versions")]
    public async Task<IActionResult> GetVersions([FromRoute] Guid areaId)
    {
        var userId = User.GetUserId();

        // Ensure the area exists and belongs to the authenticated user
        var area = await _db.Areas
            .FirstOrDefaultAsync(a => a.Id == areaId && a.CreatedByUserId == userId);

        if (area == null)
            return NotFound("Area not found or access denied.");

        // Retrieve all versions for the area
        var versions = await _db.AreaVersions
            .Where(v => v.AreaId == areaId)
            .OrderBy(v => v.VersionNumber)
            .Select(v => new AreaVersionResultDto
            {
                Id = v.Id,
                VersionNumber = v.VersionNumber,
                Name = v.Name,
                CreatedAt = v.CreatedAt,
                Coordinates = v.Geometry.Coordinates.Select(c => new[] { c.X, c.Y })
            })
            .ToListAsync();

        return Ok(versions);
    }
}
