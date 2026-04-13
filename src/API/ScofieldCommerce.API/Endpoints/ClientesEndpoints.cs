using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Application.Interfaces.Repositories;

namespace ScofieldCommerce.API.Endpoints
{
    public static class ClientesEndpoints
    {
        public static void MapClientesEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/clientes").WithTags("Clientes");
            
            group.MapPost("/", async ([FromBody] CriarClienteDto dto, IClienteService service) =>
            {
                var result = await service.CadastrarAsync(dto);
                if (!result.IsSuccess)
                    return Results.BadRequest(new { Erro = result.ErrorMessage });

                return Results.Ok(new { Mensagem = "Cliente cadastrado com sucesso." });
            });

            group.MapGet("/{id:long}", async (long id, IClienteRepository repo) =>
            {
                var cliente = await repo.ObterPorIdAsync(id);
                return cliente is not null ? Results.Ok(cliente) : Results.NotFound();
            });
        }
    }
}
