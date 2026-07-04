using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Domain.Entities.Venda;
using ScofieldCommerce.Infrastructure.Persistence;

namespace ScofieldCommerce.Infrastructure.Repositories
{
    public class VendaRepository : IVendaRepository
    {
        private readonly ScofieldDbContext _context;

        public VendaRepository(ScofieldDbContext context)
        {
            _context = context;
        }

        public async Task AdicionarAsync(Venda venda)
        {
            await _context.Vendas.AddAsync(venda);
        }

        public async Task<decimal> ObterTotalVendasGlobalAsync()
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"SELECT COALESCE(SUM(""ValorTotal""), 0) FROM ""Vendas"";";
            return await connection.ExecuteScalarAsync<decimal>(sql);
        }

        public async Task<IEnumerable<dynamic>> ObterVendasFiltrosAsync(long? produtoId, DateTime? data, long? clienteId)
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    v.""Id"",
                    v.""DataVenda"",
                    v.""ValorTotal"",
                    v.""ComissaoTotal"",
                    v.""PrazoPagamentoDias"",
                    v.""PossuiNotaFiscal"",
                    c.""RazaoSocial"",
                    pv.""Quantidade"" as ""ProdutoQuantidade"",
                    p.""Nome"" as ""ProdutoNome""
                FROM ""Vendas"" v
                JOIN ""Clientes"" c ON v.""ClienteId"" = c.""Id""
                LEFT JOIN ""ProdutosVendidos"" pv ON v.""Id"" = pv.""VendaId""
                LEFT JOIN ""Produtos"" p ON pv.""ProdutoId"" = p.""Id""
                WHERE 1 = 1
                " + (produtoId.HasValue ? @" AND v.""Id"" IN (SELECT ""VendaId"" FROM ""ProdutosVendidos"" WHERE ""ProdutoId"" = @ProdutoId) " : "") + @"
                " + (data.HasValue ? @" AND DATE(v.""DataVenda"") = DATE(@Data) " : "") + @"
                " + (clienteId.HasValue ? @" AND v.""ClienteId"" = @ClienteId " : "") + @"
                ORDER BY v.""DataVenda"" DESC;";
            
            return await connection.QueryAsync(sql, new { ProdutoId = produtoId, Data = data, ClienteId = clienteId });
        }

        public async Task<IEnumerable<dynamic>> RelatorioVendasDiaAsync()
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    DATE(v.""DataVenda"") as ""Dia"",
                    SUM(v.""ValorTotal"") as ""ValorVendido"",
                    COALESCE(SUM(pv.TotalQtd), 0) as ""QuantidadeProdutos"",
                    SUM(v.""ComissaoTotal"") as ""Comissao""
                FROM ""Vendas"" v
                LEFT JOIN (
                    SELECT ""VendaId"", SUM(""Quantidade"") as TotalQtd
                    FROM ""ProdutosVendidos""
                    GROUP BY ""VendaId""
                ) pv ON v.""Id"" = pv.""VendaId""
                GROUP BY DATE(v.""DataVenda"")
                ORDER BY ""Dia"" DESC;
            ";
            return await connection.QueryAsync(sql);
        }

        public async Task<IEnumerable<dynamic>> RelatorioVendasMesAsync()
        {
            var connection = _context.Database.GetDbConnection();
             var sql = @"
                SELECT 
                    EXTRACT(MONTH FROM v.""DataVenda"") as ""Mes"",
                    EXTRACT(YEAR FROM v.""DataVenda"") as ""Ano"",
                    SUM(v.""ValorTotal"") as ""ValorVendido"",
                    SUM(v.""ComissaoTotal"") as ""Comissao""
                FROM ""Vendas"" v
                GROUP BY EXTRACT(MONTH FROM v.""DataVenda""), EXTRACT(YEAR FROM v.""DataVenda"")
                ORDER BY ""Ano"" DESC, ""Mes"" DESC;
            ";
            return await connection.QueryAsync(sql);
        }

        public async Task<IEnumerable<dynamic>> RelatorioVendasClienteAsync()
        {
            var connection = _context.Database.GetDbConnection();
             var sql = @"
                SELECT 
                    c.""RazaoSocial"" as ""RazaoSocial"",
                    COUNT(v.""Id"") as ""QuantidadeVendas"",
                    SUM(v.""ValorTotal"") as ""ValorTotal"",
                    SUM(v.""ComissaoTotal"") as ""ComissaoGerada""
                FROM ""Clientes"" c
                JOIN ""Vendas"" v ON c.""Id"" = v.""ClienteId""
                GROUP BY c.""RazaoSocial""
                ORDER BY ""ValorTotal"" DESC;
            ";
            return await connection.QueryAsync(sql);
        }
    }
}
