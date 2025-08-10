using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace Snapland.Server.Domain.Entities
{
    public class AreaVersion
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey(nameof(Area))]
        [Column("area_id")]
        public Guid AreaId { get; set; }

        [Column("version_number")]
        public int VersionNumber { get; set; } = 1;

        [Column("name")]
        public string Name { get; set; } = default!;

        [Column("geometry")]
        public Polygon Geometry { get; set; } = default!;

        [Column("edited_by_user_id")]
        public Guid EditedByUserId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Area Area { get; set; } = default!;
    }
}
