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
            // Enable PostGIS
            m.HasPostgresExtension("postgis");

            // --- Users ---
            m.Entity<User>(e =>
            {
                e.ToTable("users");
                e.HasKey(x => x.Id);

                e.Property(x => x.Email).IsRequired().HasMaxLength(255);
                e.HasIndex(x => x.Email).IsUnique();

                e.Property(x => x.DisplayName).HasMaxLength(255);
                e.Property(x => x.IsActive).HasDefaultValue(false);
                e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");
            });

            // --- Areas ---
            m.Entity<Domain.Entities.Area>(e =>
            {
                e.ToTable("areas");
                e.HasKey(x => x.Id);

                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.IsDeleted).HasDefaultValue(false);
                e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");

                // Geometry (Polygon, SRID 4326)
                e.Property(x => x.Geometry)
                    .HasColumnType("geometry(Polygon,4326)")
                    .IsRequired();

                // Computed area in km² (stored in DB)
                e.Property(x => x.AreaKm2)
                    .HasColumnName("area_km2")
                    .HasColumnType("double precision");

                // FK -> users (creator)
                e.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.CreatedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Soft-delete global filter
                e.HasQueryFilter(x => !x.IsDeleted);

                // Indexes
                e.HasIndex(x => x.Geometry).HasMethod("GIST");
                e.HasIndex(x => x.IsDeleted);
            });

            // --- AreaVersions ---
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

                // FK -> areas (cascade on delete of area)
                e.HasOne(x => x.Area)
                    .WithMany(a => a.Versions)
                    .HasForeignKey(x => x.AreaId)
                    .OnDelete(DeleteBehavior.Cascade);

                // FK -> users (editor)
                e.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.EditedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Unique version per area + spatial index
                e.HasIndex(x => new { x.AreaId, x.VersionNumber }).IsUnique();
                e.HasIndex(x => x.Geometry).HasMethod("GIST");
            });

            base.OnModelCreating(m);
        }
    }
}
