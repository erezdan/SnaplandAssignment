export class Area {
  constructor({ name, geometry, area_km2, bounds, version = 1 }) {
    this.name = name;
    this.geometry = geometry; // GeoJSON
    this.area_km2 = area_km2;
    this.bounds = bounds;
    this.version = version;
  }

  // Create new area via API
  static async create(areaData) {
    const response = await fetch("/api/areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(areaData),
    });

    if (!response.ok) {
      throw new Error("Failed to create area");
    }

    return await response.json();
  }

  // Get list of all areas
  static async list(order = "-updated_date") {
    const response = await fetch(`/api/areas?order=${order}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load areas");
    }

    return await response.json();
  }

  // Get a single area by ID
  static async getById(id) {
    const response = await fetch(`/api/areas/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Area not found");
    }

    return await response.json();
  }

  // Optional: Update area
  static async update(id, updates) {
    const response = await fetch(`/api/areas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update area");
    }

    return await response.json();
  }
}
