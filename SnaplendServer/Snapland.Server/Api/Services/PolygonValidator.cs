using NetTopologySuite.Geometries;
using NetTopologySuite.Operation.Valid;

namespace Snapland.Server.Api.Services
{
    public static class PolygonValidator
    {
        public sealed record Result(bool IsValid, string? Error, Polygon? Polygon);

        public static Result FromLngLat(double[][] coords, GeometryFactory gf4326)
        {
            if (coords is null || coords.Length < 4)
                return new(false, "Polygon must contain at least 4 points (including closure).", null);

            // Ensure first==last
            var first = coords[0];
            var last = coords[^1];
            if (first.Length != 2 || last.Length != 2)
                return new(false, "Each coordinate must be [lng, lat].", null);

            if (first[0] != last[0] || first[1] != last[1])
            {
                // close ring
                coords = coords.Concat(new[] { new[] { first[0], first[1] } }).ToArray();
            }

            var ntsCoords = coords.Select(c => new Coordinate(c[0], c[1])).ToArray();
            var ring = gf4326.CreateLinearRing(ntsCoords);
            if (!ring.IsClosed) return new(false, "LinearRing is not closed.", null);

            var polygon = gf4326.CreatePolygon(ring);
            polygon.SRID = 4326;

            var validOp = new IsValidOp(polygon);
            var err = validOp.ValidationError;
            if (err != null)
                return new(false, $"Invalid polygon: {err.Message} (at {err.Coordinate?.X},{err.Coordinate?.Y})", null);

            return new(true, null, polygon);
        }
    }
}
