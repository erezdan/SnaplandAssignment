namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents the data required to create a new version of an area.
    /// </summary>
    public class AreaVersionCreateDto
    {
        public string Name { get; set; } = default!;

        /// <summary>
        /// Polygon coordinates as a closed ring [ [lng, lat], ... ].
        /// </summary>
        public double[][] Coordinates { get; set; } = default!;
    }
}
