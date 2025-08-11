using System;

namespace Snapland.Server.Api.DTOs
{
    public class AreaCreateDto
    {
        public string Name { get; set; } = default!;
        public double[][] Coordinates { get; set; } = default!; // [ [lng, lat], ... ]
    }
}
