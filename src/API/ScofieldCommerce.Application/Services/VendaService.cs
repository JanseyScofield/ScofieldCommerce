using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Domain.Strategies;
using ScofieldCommerce.Domain.Entities.Venda;
using ScofieldCommerce.Domain.Exceptions;

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

        public async Task RegistrarVendaAsync(RegistrarVendaDto dto)
        {
            var cliente = await _clienteRepository.ObterPorIdAsync(dto.ClienteId);
            if (cliente == null)
                throw new Exception("Cliente não encontrado.");

            var venda = new Venda(
                dto.ClienteId,
                dto.PrazoPagamentoDias,
                dto.PossuiNotaFiscal,
                DateTime.Now
            );

            foreach (var item in dto.Produtos)
            {
                var produto = await _produtoRepository.ObterPorIdAsync(item.ProdutoId);
                if (produto == null)
                    throw new Exception($"Produto {item.ProdutoId} não encontrado.");

                var strategy = _commissionFactory.GetStrategy(produto.RegraComissaoId);
                venda.AdicionarProduto(produto, item.Quantidade, item.ValorUnitario, strategy);
            }

            if (venda.ValorTotal <= 0)
                 throw new Exception("Valor total deve ser maior que zero.");

            await _vendaRepository.AdicionarAsync(venda);
            await _uow.CommitAsync();
        }

        public async Task<decimal> ObterAjudaDeCustoGlobalAsync()
        {
            var totalVendido = await _vendaRepository.ObterTotalVendasGlobalAsync();
            var ajudaCusto = Math.Floor(totalVendido / 10000m) * 100m;
            return ajudaCusto;
        }
    }
}
