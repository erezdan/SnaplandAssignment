namespace Snapland.Server.Api.DTOs;

public class AreaVersionResultDto
{
    public Guid Id { get; set; }
    public int VersionNumber { get; set; }
    public string Name { get; set; } = default!;
    public IEnumerable<double[]> Coordinates { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
