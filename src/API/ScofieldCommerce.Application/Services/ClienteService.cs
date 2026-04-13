using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
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

        public async Task CadastrarAsync(CriarClienteDto dto)
        {
            var cep = new Cep(dto.Cep);
            var endereco = new Endereco(
                dto.Logradouro,
                dto.Numero,
                dto.Complemento,
                dto.Bairro,
                dto.Cidade,
                dto.Estado,
                cep
            );
            
            var cnpj = new Cnpj(dto.Cnpj);

            var cliente = new Cliente(
                dto.RazaoSocial, 
                dto.NomeFantasia, 
                endereco, 
                cnpj, 
                dto.InscricaoEstadual, 
                dto.NomeComprador, 
                dto.TelefoneComprador
            );

            await _clienteRepository.AdicionarAsync(cliente);
            await _uow.CommitAsync();
        }
    }
}
