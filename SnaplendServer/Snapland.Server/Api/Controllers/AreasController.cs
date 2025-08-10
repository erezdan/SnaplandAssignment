using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Algorithm;
using NetTopologySuite.Geometries;
using Snapland.Server.Api.DTOs;
using Snapland.Server.Domain.Entities;
using Snapland.Server.Infrastructure.Persistence;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace Snapland.Server.Api.Controllers
{
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
        /// Create a new area with initial version.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateArea([FromBody] AreaCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Coordinates is null || dto.Coordinates.Length < 4)
                return BadRequest("Invalid polygon");

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
                CreatedByUserId = dto.UserId
            };

            _db.Areas.Add(area);

            var version = new AreaVersion
            {
                Area = area,
                VersionNumber = 1,
                Name = area.Name,
                Geometry = polygon,
                EditedByUserId = dto.UserId
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
        /// Get all areas within the given bounding box.
        /// </summary>
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

            var results = await _db.Areas
                .Where(a => !a.IsDeleted && a.Geometry.Intersects(envelope))
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
    }
}
