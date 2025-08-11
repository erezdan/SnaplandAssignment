using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

public partial class AreasSchema_Indexes_AreaKm2 : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // area_km2 as generated stored (km²), using geography for accurate area on Earth
        migrationBuilder.Sql(@"
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='areas' AND column_name='area_km2'
  ) THEN
    ALTER TABLE public.areas
      ADD COLUMN area_km2 double precision 
      GENERATED ALWAYS AS (ST_Area(geometry::geography) / 1000000.0) STORED;
  END IF;
END $$;
");

        // PostGIS indexes
        migrationBuilder.Sql(@"
CREATE INDEX IF NOT EXISTS idx_areas_geom ON public.areas USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_area_versions_geom ON public.area_versions USING GIST (geometry);
CREATE UNIQUE INDEX IF NOT EXISTS uq_area_versions_area_version 
  ON public.area_versions(area_id, version_number);
");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"DROP INDEX IF EXISTS uq_area_versions_area_version;");
        migrationBuilder.Sql(@"DROP INDEX IF EXISTS idx_area_versions_geom;");
        migrationBuilder.Sql(@"DROP INDEX IF EXISTS idx_areas_geom;");
        migrationBuilder.Sql(@"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='areas' AND column_name='area_km2'
  ) THEN
    ALTER TABLE public.areas DROP COLUMN area_km2;
  END IF;
END $$;
");
    }
}
