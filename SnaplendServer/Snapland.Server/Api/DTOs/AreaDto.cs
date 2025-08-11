namespace Snapland.Server.Api.DTOs
{
    public sealed class AreaDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = "";
        public double AreaKm2 { get; init; }
        public double[][] Coordinates { get; init; } = Array.Empty<double[]>();
    }
}
