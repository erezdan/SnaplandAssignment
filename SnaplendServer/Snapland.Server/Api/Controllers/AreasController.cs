using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Algorithm;
using NetTopologySuite.Geometries;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Domain.Entities;
using Snapland.Server.Infrastructure.Persistence;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.AspNetCore.Authorization;
using Snapland.Server.Api.Extensions.Snapland.Server.Api.Extensions;

namespace Snapland.Server.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AreasController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AreasController(AppDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Creates a new area with its initial version.
        /// </summary>
        /// <remarks>
        /// Requires JWT authentication.
        /// The request body must contain a name and a valid polygon defined by coordinates.
        /// The polygon must have at least 3 points and be closed (first and last point identical).
        /// </remarks>
        /// <param name="dto">The data required to create the area, including name and coordinates.</param>
        /// <returns>
        /// Returns 201 Created with the new area's details if successful, or 400 Bad Request if validation fails.
        /// </returns>
        [HttpPost]
        public async Task<IActionResult> CreateArea([FromBody] AreaCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Coordinates is null || dto.Coordinates.Length < 4)
                return BadRequest("Invalid polygon");

            var userId = User.GetUserId();
            var gf = NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
            var shell = dto.Coordinates.Select(c => new Coordinate(c[0], c[1])).ToArray();

            // Ensure the polygon is closed
            if (shell[0].X != shell[^1].X || shell[0].Y != shell[^1].Y)
                shell = shell.Concat(new[] { shell[0] }).ToArray();

            var polygon = gf.CreatePolygon(shell);

            var area = new Domain.Entities.Area
            {
                Name = dto.Name,
                Geometry = polygon,
                CreatedByUserId = userId
            };

            _db.Areas.Add(area);

            var version = new AreaVersion
            {
                Area = area,
                VersionNumber = 1,
                Name = area.Name,
                Geometry = polygon,
                EditedByUserId = userId
            };

            _db.AreaVersions.Add(version);
            await _db.SaveChangesAsync();

            var areaKm2 = await _db.Areas
                .Where(x => x.Id == area.Id)
                .Select(x => EF.Property<double>(x, "AreaKm2"))
                .FirstAsync();

            return Ok(new AreaResultDto
            {
                Id = area.Id,
                Name = area.Name,
                AreaKm2 = areaKm2,
                Coordinates = area.Geometry.Coordinates.Select(c => new[] { c.X, c.Y })
            });
        }

        /// <summary>
        /// Retrieves all areas within the specified bounding box.
        /// </summary>
        /// <remarks>
        /// Requires JWT authentication.
        /// The bounding box is defined by the southwest (minLng, minLat) and northeast (maxLng, maxLat) coordinates.
        /// </remarks>
        /// <param name="minLng">Minimum longitude (southwest corner).</param>
        /// <param name="minLat">Minimum latitude (southwest corner).</param>
        /// <param name="maxLng">Maximum longitude (northeast corner).</param>
        /// <param name="maxLat">Maximum latitude (northeast corner).</param>
        /// <returns>
        /// Returns 200 OK with a list of areas within the bounding box.
        /// </returns>
        [HttpGet]
        public async Task<IActionResult> GetAreas([FromQuery] double minLng, [FromQuery] double minLat,
                                                  [FromQuery] double maxLng, [FromQuery] double maxLat)
        {
            var envelopeWkt = $"POLYGON(({minLng} {minLat}, {minLng} {maxLat}, {maxLng} {maxLat}, {maxLng} {minLat}, {minLng} {minLat}))";

            var gf = NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
            var envelope = gf.CreatePolygon(new[]
            {
                new Coordinate(minLng, minLat),
                new Coordinate(minLng, maxLat),
                new Coordinate(maxLng, maxLat),
                new Coordinate(maxLng, minLat),
                new Coordinate(minLng, minLat) // close polygon
            });

            var userId = User.GetUserId();
            var results = await _db.Areas
                .Where(a => a.CreatedByUserId == userId && !a.IsDeleted && a.Geometry.Intersects(envelope))
                .Select(a => new AreaResultDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    AreaKm2 = EF.Property<double>(a, "AreaKm2"),
                    Coordinates = a.Geometry.Coordinates.Select(c => new[] { c.X, c.Y })
                })
                .ToListAsync();

            return Ok(results);
        }

        /// <summary>
        /// Retrieves a specific area by its unique identifier.
        /// </summary>
        /// <remarks>
        /// Requires JWT authentication.
        /// </remarks>
        /// <param name="id">The unique identifier of the area.</param>
        /// <returns>
        /// Returns 200 OK with the area data if found, or 404 Not Found if the area does not exist.
        /// </returns>
        [HttpGet("{id:long}")]
        public async Task<ActionResult<AreaDto>> GetById(Guid id)

        {
            var userId = User.GetUserId();
            var area = await _db.Areas.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && x.CreatedByUserId == userId);
            if (area is null) return NotFound();
            return Ok(area.ToDto());
        }

        /// <summary>
        /// Soft deletes an area by its unique identifier.
        /// </summary>
        /// <remarks>
        /// Marks the area as deleted without permanently removing it from the database.
        /// Requires JWT authentication.
        /// </remarks>
        /// <param name="id">The unique identifier of the area to be soft deleted.</param>
        /// <returns>
        /// Returns 204 No Content if deletion was successful, or 404 Not Found if the area does not exist.
        /// </returns>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> SoftDelete(Guid id)

        {
            var userId = User.GetUserId();
            var area = await _db.Areas.FirstOrDefaultAsync(x => x.Id == id);
            if (area is null) return NotFound();

            if (area.CreatedByUserId != userId)
                return Forbid("You can only delete areas you created.");

            area.IsDeleted = true;
            await _db.SaveChangesAsync();
            return NoContent();
        }   
    }
}
