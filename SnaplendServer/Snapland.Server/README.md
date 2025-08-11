# Snapland API

A modern ASP.NET Core 8 Web API for managing geographic areas and spatial data.

---

## 📁 Project Structure

- `Snapland.Api` – Main API entry point
- `Snapland.Application` – Application logic
- `Snapland.Domain` – Entity models and interfaces
- `Snapland.Infrastructure` – Database access layer (EF Core, Migrations)
- `Snapland.Tests` – Unit and integration tests

---

## ✅ Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- PostgreSQL (recommended: version 14+)
- pgAdmin or any PostgreSQL management tool

---

## 🚀 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/snapland.git
cd snapland
```

### 2. Create the database:

- Create a new PostgreSQL database named `snapland`
- Run the schema SQL file to initialize the structure:

```sql
-- Using pgAdmin or psql:
\i Infrastructure/Migrations/schema.sql
```

> Alternatively, use EF Core Migrations:

```bash
cd Snapland.Api
dotnet ef database update
```

Make sure your connection string is configured correctly in `appsettings.Development.json`.

### 3. Run the API:

```bash
dotnet run --project Snapland.Api
```

Default URL: `https://localhost:5001` or `http://localhost:5000`

---

## 🧪 Running Tests

```bash
dotnet test
```

Tests cover core logic and database operations (via mocks or in-memory db).

---

## 📄 Notes

- `schema.sql` contains only the database structure (no data).
- You can replace it with full migrations if preferred.
- Keep sensitive data (e.g. passwords) out of version control.

---

## 📦 Deployment

The API can be containerized or deployed as a standard .NET application. Add reverse proxy and HTTPS for production.

---

## 📂 Schema File Location

```
Infrastructure/Migrations/schema.sql
```

---

## 📬 Contact

For questions or collaboration: your.email@example.com

---

> This project is intended as a backend API. A frontend application (React, Blazor, etc.) can be connected using HTTP or WebSocket.
