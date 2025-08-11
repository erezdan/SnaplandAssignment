namespace Snapland.Server.Api.DTOs;

public class AreaVersionCreateDto
{
    public string Name { get; set; } = default!;
    public double[][] Coordinates { get; set; } = default!; // [ [lng, lat], ... ] closed ring
}
