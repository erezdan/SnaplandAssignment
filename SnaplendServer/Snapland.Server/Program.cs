using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NetTopologySuite;
using Snapland.Server.Api.Services;
using Snapland.Server.Infrastructure.Persistence;
using System.Text;

// Load .env variables (manual step)
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add controllers and OpenAPI support
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS configuration for development frontend
builder.Services.AddCors(o =>
{
    o.AddPolicy("DevCors", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetPreflightMaxAge(TimeSpan.FromHours(1))
    // .AllowCredentials() // uncomment if using cookies or SignalR with credentials
    );
});

// Register GeometryFactory with SRID 4326
builder.Services.AddSingleton(sp =>
{
    var nts = NtsGeometryServices.Instance;
    return nts.CreateGeometryFactory(srid: 4326);
});

// JWT token service
builder.Services.AddScoped<ITokenService, TokenService>();

// JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        var jwt = builder.Configuration.GetSection("Jwt");

        var key = jwt["Key"];
        if (string.IsNullOrWhiteSpace(key))
            throw new Exception("JWT Key is missing. Make sure it's defined in appsettings or .env");

        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],

            ValidateAudience = true,
            ValidAudience = jwt["Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(10)
        };
    });

// PostgreSQL with NetTopologySuite
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"),
        o => o.UseNetTopologySuite()
    );
});

// Compatibility setting for legacy timestamp behavior
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var app = builder.Build();

// Swagger and CORS in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global middleware pipeline
app.UseRouting();
app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
