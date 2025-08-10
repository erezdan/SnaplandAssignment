using System;
using System.Collections.Generic;

namespace Snapland.Server.Api.DTOs
{
    public class AreaResultDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public double AreaKm2 { get; set; }
        public IEnumerable<double[]> Coordinates { get; set; } = default!;
    }
}
