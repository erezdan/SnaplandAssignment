using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace Snapland.Server.Domain.Entities
{
    public class Area
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column("name")]
        public string Name { get; set; } = default!;

        [Column("geometry")]
        public Polygon Geometry { get; set; } = default!; // SRID 4326

        [Column("created_by_user_id")]
        public Guid CreatedByUserId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }

        [Column("area_km2")]
        public double AreaKm2 { get; set; }

        public ICollection<AreaVersion> Versions { get; set; } = new List<AreaVersion>();
    }
}
