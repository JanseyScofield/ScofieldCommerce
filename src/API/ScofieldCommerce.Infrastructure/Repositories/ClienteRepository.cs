using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Infrastructure.Persistence;

namespace ScofieldCommerce.Infrastructure.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly ScofieldDbContext _context;

        public ClienteRepository(ScofieldDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cliente>> ObterTodosAsync()
        {
            return await _context.Clientes.AsNoTracking().OrderBy(c => c.RazaoSocial).ToListAsync();
        }

        public async Task<IEnumerable<Cliente>> ObterFiltradosAsync(string? nome, string? cnpj)
        {
            var query = _context.Clientes.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(nome))
            {
                var nomeTrim = nome.Trim().ToLower();
                query = query.Where(c => c.RazaoSocial.ToLower().Contains(nomeTrim) || c.NomeFantasia.ToLower().Contains(nomeTrim));
            }

            if (!string.IsNullOrWhiteSpace(cnpj))
            {
                var cnpjDigits = new string(cnpj.Where(char.IsDigit).ToArray());
                var cnpjRaw = cnpj.Trim();
                query = query.Where(c => c.Cnpj.Valor.Contains(cnpjRaw) || (cnpjDigits.Length > 0 && c.Cnpj.Valor.Contains(cnpjDigits)));
            }

            return await query.OrderBy(c => c.RazaoSocial).ToListAsync();
        }

        public async Task AdicionarAsync(Cliente cliente)
        {
            await _context.Clientes.AddAsync(cliente);
        }

        public async Task AtualizarAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await Task.CompletedTask;
        }

        public async Task<Cliente?> ObterPorIdAsync(long id)
        {
            return await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<dynamic>> RelatorioComprasPorMesAsync()
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    c.""RazaoSocial"" as ""RazaoSocial"", 
                    EXTRACT(MONTH FROM v.""DataVenda"") as ""Mes"",
                    EXTRACT(YEAR FROM v.""DataVenda"") as ""Ano"",
                    SUM(v.""ValorTotal"") as ""TotalComprado""
                FROM ""Clientes"" c
                JOIN ""Vendas"" v ON c.""Id"" = v.""ClienteId""
                GROUP BY c.""RazaoSocial"", EXTRACT(MONTH FROM v.""DataVenda""), EXTRACT(YEAR FROM v.""DataVenda"")
                ORDER BY ""Ano"" DESC, ""Mes"" DESC;
            ";
            return await connection.QueryAsync(sql);
        }

        public async Task<IEnumerable<dynamic>> RelatorioInatividadeAsync(int diasInativo)
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    c.""RazaoSocial"" as ""RazaoSocial"", 
                    c.""NomeComprador"" as ""NomeComprador"", 
                    c.""TelefoneComprador"" as ""TelefoneComprador"", 
                    MAX(v.""DataVenda"") as ""UltimaCompra"",
                    EXTRACT(DAY FROM (NOW() - MAX(v.""DataVenda""))) as ""DiasInativo""
                FROM ""Clientes"" c
                LEFT JOIN ""Vendas"" v ON c.""Id"" = v.""ClienteId""
                GROUP BY c.""Id"", c.""RazaoSocial"", c.""NomeComprador"", c.""TelefoneComprador""
                HAVING MAX(v.""DataVenda"") IS NULL OR EXTRACT(DAY FROM (NOW() - MAX(v.""DataVenda""))) >= @DiasInativo
                ORDER BY ""DiasInativo"" DESC;
            ";
            return await connection.QueryAsync(sql, new { DiasInativo = diasInativo });
        }

        public async Task<IEnumerable<dynamic>> RelatorioValorCompradoPorProdutoAsync()
        {
            var connection = _context.Database.GetDbConnection();
            var sql = @"
                SELECT 
                    c.""RazaoSocial"" as ""RazaoSocial"",
                    p.""Nome"" as ""Produto"",
                    SUM(pv.""ValorUnitario"" * pv.""Quantidade"") as ""ValorComprado""
                FROM ""Clientes"" c
                JOIN ""Vendas"" v ON c.""Id"" = v.""ClienteId""
                JOIN ""ProdutosVendidos"" pv ON v.""Id"" = pv.""VendaId""
                JOIN ""Produtos"" p ON pv.""ProdutoId"" = p.""Id""
                GROUP BY c.""RazaoSocial"", p.""Nome""
                ORDER BY c.""RazaoSocial"", p.""Nome"";
            ";
            return await connection.QueryAsync(sql);
        }
    }
}
