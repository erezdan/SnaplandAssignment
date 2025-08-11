namespace Snapland.Server.Api.DTOs
{
    /// <summary>
    /// Represents the data required to create a new area.
    /// </summary>
    public class AreaCreateDto
    {
        public string Name { get; set; } = default!;

        /// <summary>
        /// Polygon coordinates as [ [lng, lat], ... ].
        /// </summary>
        public double[][] Coordinates { get; set; } = default!;
    }
}
