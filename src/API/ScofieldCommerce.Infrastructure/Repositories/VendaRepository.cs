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

        public async Task<Venda?> ObterPorIdAsync(long id)
        {
            return await _context.Vendas.FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<dynamic> ObterResumoComissoesAsync(DateTime? data = null)
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    COALESCE(SUM(CASE WHEN ""ComissaoRecebida"" = true THEN ""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoRecebida"",
                    COALESCE(SUM(CASE WHEN ""ComissaoRecebida"" = false THEN ""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoPendente"",
                    COALESCE(SUM(""ComissaoTotal""), 0) as ""TotalComissao""
                FROM ""Vendas""
                WHERE " + (data.HasValue ? @" DATE(""DataVenda"") = DATE(@Data) " : @" DATE(""DataVenda"") = CURRENT_DATE ") + @";";
            return await connection.QueryFirstOrDefaultAsync(sql, new { Data = data });
        }

        public async Task<decimal> ObterTotalVendasGlobalAsync()
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"SELECT COALESCE(SUM(""ValorTotal""), 0) FROM ""Vendas"";";
            return await connection.ExecuteScalarAsync<decimal>(sql);
        }

        public async Task<IEnumerable<dynamic>> ObterVendasFiltrosAsync(long? produtoId, DateTime? data, long? clienteId, bool? comissaoRecebida = null)
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    v.""Id"",
                    v.""DataVenda"",
                    v.""ValorTotal"",
                    v.""ComissaoTotal"",
                    v.""ComissaoRecebida"",
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
                " + (comissaoRecebida.HasValue ? @" AND v.""ComissaoRecebida"" = @ComissaoRecebida " : "") + @"
                ORDER BY v.""DataVenda"" DESC;";
            
            return await connection.QueryAsync(sql, new { ProdutoId = produtoId, Data = data, ClienteId = clienteId, ComissaoRecebida = comissaoRecebida });
        }

        public async Task<IEnumerable<dynamic>> RelatorioVendasDiaAsync(int? mes = null, int? ano = null)
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    DATE(v.""DataVenda"") as ""Dia"",
                    SUM(v.""ValorTotal"") as ""ValorVendido"",
                    COALESCE(SUM(pv.TotalQtd), 0) as ""QuantidadeProdutos"",
                    SUM(v.""ComissaoTotal"") as ""Comissao"",
                    COALESCE(SUM(CASE WHEN v.""ComissaoRecebida"" = true THEN v.""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoRecebida"",
                    COALESCE(SUM(CASE WHEN v.""ComissaoRecebida"" = false THEN v.""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoPendente""
                FROM ""Vendas"" v
                LEFT JOIN (
                    SELECT ""VendaId"", SUM(""Quantidade"") as TotalQtd
                    FROM ""ProdutosVendidos""
                    GROUP BY ""VendaId""
                ) pv ON v.""Id"" = pv.""VendaId""
                WHERE 1 = 1
                " + (mes.HasValue ? @" AND EXTRACT(MONTH FROM v.""DataVenda"") = @Mes " : @" AND EXTRACT(MONTH FROM v.""DataVenda"") = EXTRACT(MONTH FROM CURRENT_DATE) ") + @"
                " + (ano.HasValue ? @" AND EXTRACT(YEAR FROM v.""DataVenda"") = @Ano " : @" AND EXTRACT(YEAR FROM v.""DataVenda"") = EXTRACT(YEAR FROM CURRENT_DATE) ") + @"
                GROUP BY DATE(v.""DataVenda"")
                ORDER BY ""Dia"" DESC;
            ";
            return await connection.QueryAsync(sql, new { Mes = mes, Ano = ano });
        }

        public async Task<IEnumerable<dynamic>> RelatorioVendasMesAsync(int? ano = null)
        {
            var connection = _context.Database.GetDbConnection();
             var sql = @"
                SELECT 
                    EXTRACT(MONTH FROM v.""DataVenda"") as ""Mes"",
                    EXTRACT(YEAR FROM v.""DataVenda"") as ""Ano"",
                    SUM(v.""ValorTotal"") as ""ValorVendido"",
                    SUM(v.""ComissaoTotal"") as ""Comissao"",
                    COALESCE(SUM(CASE WHEN v.""ComissaoRecebida"" = true THEN v.""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoRecebida"",
                    COALESCE(SUM(CASE WHEN v.""ComissaoRecebida"" = false THEN v.""ComissaoTotal"" ELSE 0 END), 0) as ""ComissaoPendente""
                FROM ""Vendas"" v
                WHERE 1 = 1
                " + (ano.HasValue ? @" AND EXTRACT(YEAR FROM v.""DataVenda"") = @Ano " : @" AND EXTRACT(YEAR FROM v.""DataVenda"") = EXTRACT(YEAR FROM CURRENT_DATE) ") + @"
                GROUP BY EXTRACT(MONTH FROM v.""DataVenda""), EXTRACT(YEAR FROM v.""DataVenda"")
                ORDER BY ""Ano"" DESC, ""Mes"" DESC;
            ";
            return await connection.QueryAsync(sql, new { Ano = ano });
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
