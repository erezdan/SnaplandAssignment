using NetTopologySuite.Geometries;
using ProjNet.CoordinateSystems;
using ProjNet.CoordinateSystems.Transformations;

namespace Snapland.Server.Api.Services;

public static class AreaCalculator
{
    private static readonly CoordinateTransformationFactory _transformFactory = new();
    private static readonly MathTransform _mathTransform;

    static AreaCalculator()
    {
        var wgs84 = GeographicCoordinateSystem.WGS84;
        var webMercator = ProjectedCoordinateSystem.WebMercator;

        _mathTransform = _transformFactory
            .CreateFromCoordinateSystems(wgs84, webMercator)
            .MathTransform;
    }

    public static double CalculateKm2(Geometry geometry)
    {
        var transformed = TransformGeometry(geometry, _mathTransform);
        return transformed.Area / 1_000_000.0;
    }

    private static Geometry TransformGeometry(Geometry geometry, MathTransform transform)
    {
        var factory = GeometryFactory.Default;

        if (geometry is Polygon polygon)
        {
            var shell = TransformLinearRing(polygon.Shell, transform, factory);
            var holes = polygon.Holes.Select(h => TransformLinearRing(h, transform, factory)).ToArray();
            return factory.CreatePolygon(shell, holes);
        }

        throw new NotSupportedException("Only Polygon geometry is supported.");
    }

    private static LinearRing TransformLinearRing(LinearRing ring, MathTransform transform, GeometryFactory factory)
    {
        var input = ring.CoordinateSequence;
        var output = factory.CoordinateSequenceFactory.Create(input.Count, input.Dimension, input.Measures);

        for (int i = 0; i < input.Count; i++)
        {
            var coord = input.GetCoordinate(i);
            var result = transform.Transform(new[] { coord.X, coord.Y });

            output.SetOrdinate(i, Ordinate.X, result[0]);
            output.SetOrdinate(i, Ordinate.Y, result[1]);
        }

        return factory.CreateLinearRing(output);
    }
}
