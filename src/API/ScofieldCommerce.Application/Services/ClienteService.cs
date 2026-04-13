using System;
using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Domain.Common;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Domain.Entities.Localizacao;

namespace ScofieldCommerce.Application.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IUnitOfWork _uow;

        public ClienteService(IClienteRepository clienteRepository, IUnitOfWork uow)
        {
            _clienteRepository = clienteRepository;
            _uow = uow;
        }

        public async Task<Result<Cliente>> CadastrarAsync(CriarClienteDto dto)
        {
            try
            {
                var cepResult = Cep.Criar(dto.Cep);
                if (!cepResult.IsSuccess) return Result<Cliente>.Error(cepResult.ErrorMessage!);

                var enderecoResult = Endereco.Criar(
                    dto.Logradouro,
                    dto.Numero,
                    dto.Complemento,
                    dto.Bairro,
                    dto.Cidade,
                    dto.Estado,
                    cepResult.Data!
                );
                if (!enderecoResult.IsSuccess) return Result<Cliente>.Error(enderecoResult.ErrorMessage!);
                
                var cnpjResult = Cnpj.Criar(dto.Cnpj);
                if (!cnpjResult.IsSuccess) return Result<Cliente>.Error(cnpjResult.ErrorMessage!);

                var clienteResult = Cliente.Criar(
                    dto.RazaoSocial, 
                    dto.NomeFantasia, 
                    enderecoResult.Data!, 
                    cnpjResult.Data!, 
                    dto.InscricaoEstadual, 
                    dto.NomeComprador, 
                    dto.TelefoneComprador
                );

                if (!clienteResult.IsSuccess) return Result<Cliente>.Error(clienteResult.ErrorMessage!);

                await _clienteRepository.AdicionarAsync(clienteResult.Data!);
                await _uow.CommitAsync();

                return Result<Cliente>.Ok(clienteResult.Data!);
            }
            catch(Exception ex)
            {
                return Result<Cliente>.Error($"Erro interno ao cadastrar cliente: {ex.Message}");
            }
        }
    }
}
