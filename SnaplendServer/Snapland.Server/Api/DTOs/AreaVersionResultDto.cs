namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents a specific version of an area.
    /// </summary>
    public class AreaVersionResultDto
    {
        public Guid Id { get; set; }
        public int VersionNumber { get; set; }
        public string Name { get; set; } = default!;

        /// <summary>
        /// Polygon coordinates as an array of [longitude, latitude] pairs.
        /// </summary>
        public IEnumerable<double[]> Coordinates { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
    }
}
