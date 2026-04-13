using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using ScofieldCommerce.Application.Interfaces.Repositories;

namespace ScofieldCommerce.API.Endpoints
{
    public static class RelatoriosEndpoints
    {
        public static void MapRelatoriosEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/relatorios").WithTags("Relatórios");

            group.MapGet("/vendas/dia", async (IVendaRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioVendasDiaAsync());
            });

            group.MapGet("/vendas/mes", async (IVendaRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioVendasMesAsync());
            });

            group.MapGet("/vendas/cliente", async (IVendaRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioVendasClienteAsync());
            });

            group.MapGet("/clientes/mes", async (IClienteRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioComprasPorMesAsync());
            });

            group.MapGet("/clientes/inatividade", async ([FromQuery] int dias, IClienteRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioInatividadeAsync(dias));
            });

            group.MapGet("/clientes/valor-comprado-produto", async (IClienteRepository repo) =>
            {
                return Results.Ok(await repo.RelatorioValorCompradoPorProdutoAsync());
            });
        }
    }
}
