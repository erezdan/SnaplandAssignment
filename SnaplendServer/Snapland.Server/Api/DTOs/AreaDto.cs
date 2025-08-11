namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents a geographic area with metadata and geometry.
    /// </summary>
    public sealed class AreaDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = "";

        /// <summary>
        /// Area size in square kilometers.
        /// </summary>
        public double AreaKm2 { get; init; }

        /// <summary>
        /// Polygon coordinates as [ [lng, lat], ... ].
        /// </summary>
        public double[][] Coordinates { get; init; } = Array.Empty<double[]>();
    }
}
