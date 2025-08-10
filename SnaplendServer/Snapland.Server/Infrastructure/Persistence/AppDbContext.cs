using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Algorithm;
using Snapland.Server.Domain.Entities;

namespace Snapland.Server.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Domain.Entities.Area> Areas => Set<Domain.Entities.Area>();
        public DbSet<AreaVersion> AreaVersions => Set<AreaVersion>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder m)
        {
            m.HasPostgresExtension("postgis");

            // Mapping for User
            m.Entity<User>(e =>
            {
                e.ToTable("users");
                e.HasKey(x => x.Id);
                e.Property(x => x.Email).IsRequired().HasMaxLength(255);
                e.HasIndex(x => x.Email).IsUnique();
                e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");
            });

            // Mapping for Area
            m.Entity<Domain.Entities.Area>(e =>
            {
                e.ToTable("areas");
                e.HasKey(x => x.Id);

                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.IsDeleted).HasDefaultValue(false);
                e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");

                e.Property(x => x.Geometry)
                    .HasColumnType("geometry(Polygon,4326)")
                    .IsRequired();

                e.Property<double>("AreaKm2")
                    .HasColumnName("area_km2")
                    .HasComputedColumnSql("ST_Area(geometry::geography) / 1000000.0", stored: true);

                e.HasIndex(x => x.Geometry).HasMethod("GIST");
                e.HasIndex(x => x.IsDeleted);
            });

            // Mapping for AreaVersion
            m.Entity<AreaVersion>(e =>
            {
                e.ToTable("area_versions");
                e.HasKey(x => x.Id);

                e.Property(x => x.VersionNumber).IsRequired();
                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");

                e.Property(x => x.Geometry)
                    .HasColumnType("geometry(Polygon,4326)")
                    .IsRequired();

                e.HasOne(x => x.Area)
                    .WithMany(a => a.Versions)
                    .HasForeignKey(x => x.AreaId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasIndex(x => new { x.AreaId, x.VersionNumber }).IsUnique();
                e.HasIndex(x => x.Geometry).HasMethod("GIST");
            });

            base.OnModelCreating(m);
        }
    }
}
