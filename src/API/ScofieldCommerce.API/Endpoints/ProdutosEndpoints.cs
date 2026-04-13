using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Application.Interfaces.Repositories;

namespace ScofieldCommerce.API.Endpoints
{
    public static class ProdutosEndpoints
    {
        public static void MapProdutosEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/produtos").WithTags("Produtos");

            group.MapPost("/", async ([FromBody] CriarProdutoDto dto, IProdutoService service) =>
            {
                await service.CadastrarAsync(dto);
                return Results.Ok(new { Mensagem = "Produto cadastrado com sucesso." });
            });

            group.MapGet("/", async (IProdutoRepository repo) =>
            {
                return Results.Ok(await repo.ObterTodosAsync());
            });
        }
    }
}
