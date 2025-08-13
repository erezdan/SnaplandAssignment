using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NetTopologySuite;
using System.Text;
using Snapland.Server.Api.Services;
using Snapland.Server.Infrastructure.Authentication;
using Snapland.Server.Infrastructure.Persistence;
using Snapland.Server.Realtime.Websockets;
using WebSocketManager = Snapland.Server.Realtime.Websockets.WebSocketManager;

// Load .env variables
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// --------------------------
// Controllers & Swagger
// --------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new() { Title = "Snapland API", Version = "v1" });

    // JWT support in Swagger
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    opt.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

// --------------------------
// JWT Authentication Setup
// --------------------------
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

builder.Services.AddSingleton<JwtTokenHelper>();
builder.Services.AddScoped<ITokenService, TokenService>();

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

// --------------------------
// Realtime WebSocket
// --------------------------
builder.Services.AddSingleton<UserCacheService>();
builder.Services.AddSingleton<WebSocketManager>();
builder.Services.AddTransient<WebSocketMessageHandler>();

// --------------------------
// GIS: GeometryFactory with SRID 4326
// --------------------------
builder.Services.AddSingleton(sp =>
{
    var nts = NtsGeometryServices.Instance;
    return nts.CreateGeometryFactory(srid: 4326);
});

// --------------------------
// Database (PostgreSQL + PostGIS)
// --------------------------
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"),
        o => o.UseNetTopologySuite()
    );
});
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// --------------------------
// CORS Policy
// --------------------------
builder.Services.AddCors(o =>
{
    o.AddPolicy("DevCors", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetPreflightMaxAge(TimeSpan.FromHours(1))
    );
});

// --------------------------
// App Build & Middleware
// --------------------------
var app = builder.Build();

app.Lifetime.ApplicationStarted.Register(async () =>
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var userCache = app.Services.GetRequiredService<UserCacheService>();
    await userCache.LoadInitialUsersAsync(db);
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("DevCors");

app.UseAuthentication();
app.UseAuthorization();

app.UseWebSockets();
app.UseMiddleware<RealtimeMiddleware>();

app.MapControllers();

app.Run();
