using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using System;
using Snapland.Server.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(o =>
{
    o.AddPolicy("DevCors", p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000") // allow only dev front-end origins
        .AllowAnyHeader() // allow all headers
        .AllowAnyMethod() // allow all HTTP methods
                          //.AllowCredentials() // uncomment if using cookies or SignalR with credentials
        .SetPreflightMaxAge(TimeSpan.FromHours(1)) // reduce preflight request frequency
    );
});

builder.Services.AddSingleton(sp =>
{
    var Nts = NtsGeometryServices.Instance;
    return Nts.CreateGeometryFactory(srid: 4326);
});

// DbContext + NTS
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(
        builder.Configuration.GetConnectionString("Default"),
        o =>
        {
            o.UseNetTopologySuite();
        });
});

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}

app.UseRouting();
app.UseCors("DevCors"); // apply the DevCors policy
app.UseAuthentication();
app.UseAuthorization();

app.Run();