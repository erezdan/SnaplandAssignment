namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents the result of an area query including metadata and geometry.
    /// </summary>
    public class AreaResultDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;

        /// <summary>
        /// Area size in square kilometers.
        /// </summary>
        public double AreaKm2 { get; set; }

        /// <summary>
        /// Polygon coordinates as [ [lng, lat], ... ].
        /// </summary>
        public IEnumerable<double[]> Coordinates { get; set; } = default!;
    }
}
