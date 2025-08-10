// File: Infrastructure/Persistence/AppDbContext.cs

using Microsoft.EntityFrameworkCore;

namespace Snapland.Server.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Enable PostGIS extension (required for spatial types & functions)
            modelBuilder.HasPostgresExtension("postgis");

            // Entity mappings will be added in the next steps.
            // e.g. modelBuilder.Entity<Area>(...);
            base.OnModelCreating(modelBuilder);
        }
    }
}
