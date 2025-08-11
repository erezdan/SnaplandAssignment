using Snapland.Server.Domain.Entities;

namespace Snapland.Server.Api.DTOs
{
    public static class DtoMapper
    {
        public static AreaDto ToDto(this Area a)
        {
            var shell = a.Geometry?.Shell?.Coordinates ?? Array.Empty<NetTopologySuite.Geometries.Coordinate>();
            var coords = shell.Select(c => new[] { c.X, c.Y } as double[]).ToArray();
            return new AreaDto
            {
                Id = a.Id,
                Name = a.Name,
                AreaKm2 = a.AreaKm2,
                Coordinates = coords
            };
        }
    }
}
