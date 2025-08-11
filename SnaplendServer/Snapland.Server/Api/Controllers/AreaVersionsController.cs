using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Api.Extensions.Snapland.Server.Api.Extensions;
using Snapland.Server.Domain.Entities;
using Snapland.Server.Infrastructure.Persistence;

namespace Snapland.Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/areas")]
public class AreaVersionsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AreaVersionsController(AppDbContext db) => _db = db;

    /// <summary>
    /// Create a new version for the specified area.
    /// </summary>
    /// <remarks>
    /// Adds a new version with updated geometry or name for an existing area.
    /// Requires JWT authentication.
    /// </remarks>
    /// <param name="areaId">The unique identifier of the area.</param>
    /// <param name="dto">The data required to create a new area version.</param>
    /// <returns>
    /// Returns 201 Created with version details, or 404 Not Found if the area does not exist.
    /// </returns>
    [HttpPost("{areaId:guid}/versions")]
    public async Task<IActionResult> CreateVersion([FromRoute] Guid areaId, [FromBody] AreaVersionCreateDto dto)
    {
        var userId = User.GetUserId();

        var area = await _db.Areas
            .FirstOrDefaultAsync(a => a.Id == areaId && !a.IsDeleted);

        if (area == null)
            return NotFound("Area not found");

        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Version name is required.");

        var gf = NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);

        // Use PolygonValidator
        var validationResult = PolygonValidator.FromLngLat(dto.Coordinates, gf);
        if (!validationResult.IsValid)
            return BadRequest(new { error = validationResult.Error });

        var polygon = validationResult.Polygon!;

        var nextVersion = await _db.AreaVersions
            .Where(v => v.AreaId == areaId)
            .OrderByDescending(v => v.VersionNumber)
            .Select(v => v.VersionNumber)
            .FirstOrDefaultAsync() + 1;

        var version = new AreaVersion
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

    /// <summary>
    /// Get all versions for a specific area.
    /// </summary>
    /// <remarks>
    /// Returns a list of all saved versions (including geometry and metadata) for the specified area.
    /// Requires JWT authentication.
    /// </remarks>
    /// <param name="areaId">The unique identifier of the area.</param>
    /// <returns>
    /// Returns 200 OK with a list of versions, or 404 Not Found if the area does not exist.
    /// </returns>
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
