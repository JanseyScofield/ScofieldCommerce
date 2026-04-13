using Microsoft.EntityFrameworkCore;
using ScofieldCommerce.API.Endpoints;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Application.Services;
using ScofieldCommerce.Domain.Strategies;
using ScofieldCommerce.Infrastructure.Persistence;
using ScofieldCommerce.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=scofield_commerce;Username=admin;Password=admin";

builder.Services.AddDbContext<ScofieldDbContext>(options =>
    options.UseNpgsql(connectionString));

// Repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IVendaRepository, VendaRepository>();

// Services
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<IVendaService, VendaService>();
builder.Services.AddSingleton<ICommissionStrategyFactory, CommissionStrategyFactory>();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Configuration["ENABLE_SWAGGER"] == "true")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapClientesEndpoints();
app.MapProdutosEndpoints();
app.MapVendasEndpoints();
app.MapRelatoriosEndpoints();

// Migrate on startup if desired, or let the user do it via dotnet ef. Let's just create scope and migrate to make it simpler.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ScofieldDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
