using Xunit;
using NetTopologySuite.Geometries;
using Snapland.Server.Api.Services;

namespace Snapland.Server.Tests;

public class PolygonValidatorTests
{
    private readonly GeometryFactory _gf = NetTopologySuite.NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);

    [Fact]
    public void FromLngLat_ValidSquare_ReturnsValidResult()
    {
        // Arrange
        double[][] coords = new double[][]
        {
            new[] { 0.0, 0.0 },
            new[] { 0.0, 1.0 },
            new[] { 1.0, 1.0 },
            new[] { 0.0, 0.0 }  // Closed ring
        };

        // Act
        var result = PolygonValidator.FromLngLat(coords, _gf);

        // Assert
        Assert.True(result.IsValid);
        Assert.NotNull(result.Polygon);
        Assert.Null(result.Error);
    }

    [Fact]
    public void FromLngLat_InvalidNotEnoughPoints_ReturnsInvalid()
    {
        // Arrange
        double[][] coords = new double[][]
        {
            new[] { 0.0, 0.0 },
            new[] { 0.0, 1.0 },
            new[] { 0.0, 0.0 }
        };

        // Act
        var result = PolygonValidator.FromLngLat(coords, _gf);

        // Assert
        Assert.False(result.IsValid);
        Assert.NotNull(result.Error);
    }

    [Fact]
    public void FromLngLat_UnclosedRing_ClosesAutomatically()
    {
        // Arrange – square but not closed
        double[][] coords = new double[][]
        {
            new[] { 0.0, 0.0 },
            new[] { 0.0, 1.0 },
            new[] { 1.0, 1.0 },
            new[] { 1.0, 0.0 }
        };

        // Act
        var result = PolygonValidator.FromLngLat(coords, _gf);

        // Assert
        Assert.True(result.IsValid);
        Assert.Equal(5, result.Polygon.NumPoints); // original 4 + 1 closing point
    }
}
