using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Domain.Common;
using ScofieldCommerce.Domain.Entities.Venda;
using ScofieldCommerce.Domain.Strategies;

namespace ScofieldCommerce.Application.Services
{
    public class VendaService : IVendaService
    {
        private readonly IVendaRepository _vendaRepository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly IUnitOfWork _uow;
        private readonly ICommissionStrategyFactory _commissionFactory;

        public VendaService(
            IVendaRepository vendaRepository,
            IProdutoRepository produtoRepository,
            IClienteRepository clienteRepository,
            IUnitOfWork uow,
            ICommissionStrategyFactory commissionFactory)
        {
            _vendaRepository = vendaRepository;
            _produtoRepository = produtoRepository;
            _clienteRepository = clienteRepository;
            _uow = uow;
            _commissionFactory = commissionFactory;
        }

        public async Task<Result<Venda>> RegistrarVendaAsync(RegistrarVendaDto dto)
        {
            try
            {
                var cliente = await _clienteRepository.ObterPorIdAsync(dto.ClienteId);
                if (cliente == null) return Result<Venda>.Error("Cliente não encontrado.");

                var vendaResult = Venda.Criar(
                    dto.ClienteId,
                    dto.PrazoPagamentoDias,
                    dto.PossuiNotaFiscal,
                    DateTime.UtcNow
                );

                if (!vendaResult.IsSuccess) return Result<Venda>.Error(vendaResult.ErrorMessage!);
                
                var venda = vendaResult.Data!;

                foreach (var item in dto.Produtos)
                {
                    var produto = await _produtoRepository.ObterPorIdAsync(item.ProdutoId);
                    if (produto == null) return Result<Venda>.Error($"Produto {item.ProdutoId} não encontrado.");

                    var strategy = _commissionFactory.GetStrategy(produto.Nome);
                    
                    var adicionarResult = venda.AdicionarProduto(produto, item.Quantidade, item.ValorUnitario, strategy);
                    if (!adicionarResult.IsSuccess) return Result<Venda>.Error(adicionarResult.ErrorMessage!);
                }

                if (venda.ValorTotal <= 0) return Result<Venda>.Error("Valor total deve ser maior que zero.");

                await _vendaRepository.AdicionarAsync(venda);
                await _uow.CommitAsync();

                return Result<Venda>.Ok(venda);
            }
            catch(Exception ex)
            {
                return Result<Venda>.Error($"Erro interno ao registrar venda: {ex.Message}");
            }
        }

        public async Task<Result<decimal>> ObterAjudaDeCustoGlobalAsync()
        {
            try
            {
                var totalVendido = await _vendaRepository.ObterTotalVendasGlobalAsync();
                var premiacao = Math.Floor(totalVendido / 10000m) * 100m;
                var ajudaCustoFixa = 500m;
                return Result<decimal>.Ok(premiacao + ajudaCustoFixa);
            }
            catch(Exception ex)
            {
                return Result<decimal>.Error($"Erro interno ao obter ajuda de custo: {ex.Message}");
            }
        }

        public async Task<Result<CalculoVendaResultadoDto>> CalcularVendaAsync(CalcularVendaDto dto)
        {
            try
            {
                decimal valorTotal = 0;
                decimal comissaoTotal = 0;

                if (dto.Produtos != null)
                {
                    foreach (var item in dto.Produtos)
                    {
                        var produto = await _produtoRepository.ObterPorIdAsync(item.ProdutoId);
                        if (produto == null) 
                            return Result<CalculoVendaResultadoDto>.Error($"Produto {item.ProdutoId} não encontrado.");

                        var strategy = _commissionFactory.GetStrategy(produto.Nome);
                        
                        valorTotal += item.ValorUnitario * item.Quantidade;
                        comissaoTotal += strategy.CalcularComissao(item.ValorUnitario, item.Quantidade);
                    }
                }

                return Result<CalculoVendaResultadoDto>.Ok(new CalculoVendaResultadoDto
                {
                    ValorTotal = valorTotal,
                    ComissaoTotal = comissaoTotal
                });
            }
            catch(Exception ex)
            {
                return Result<CalculoVendaResultadoDto>.Error($"Erro interno ao calcular venda: {ex.Message}");
            }
        }

        public async Task<Result<IEnumerable<dynamic>>> ObterVendasFiltrosAsync(long? produtoId, DateTime? data, long? clienteId)
        {
            try
            {
                var rows = await _vendaRepository.ObterVendasFiltrosAsync(produtoId, data, clienteId);

                var vendas = rows.GroupBy(r => (long)r.Id)
                    .Select(g => {
                        var first = g.First();
                        
                        var itens = g.Where(r => r.ProdutoNome != null)
                            .Select(r => new {
                                nome = (string)r.ProdutoNome,
                                quantidade = (int)r.ProdutoQuantidade
                            })
                            .OrderByDescending(i => i.quantidade)
                            .ToList();

                        return new {
                            Id = (long)first.Id,
                            DataVenda = (DateTime)first.DataVenda,
                            ValorTotal = (decimal)first.ValorTotal,
                            ComissaoTotal = (decimal)first.ComissaoTotal,
                            PrazoPagamentoDias = (sbyte)first.PrazoPagamentoDias,
                            PossuiNotaFiscal = (bool)first.PossuiNotaFiscal,
                            RazaoSocial = (string)first.RazaoSocial,
                            QuantidadeTotal = itens.Sum(i => i.quantidade),
                            Itens = itens
                        };
                    })
                    .ToList();

                return Result<IEnumerable<dynamic>>.Ok((IEnumerable<dynamic>)vendas);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<dynamic>>.Error($"Erro ao obter histórico de vendas: {ex.Message}");
            }
        }
    }
}
