import { useState } from 'react';
import { Save, Loader } from 'lucide-react';
import { produtosCommands } from '../api/commands/produtos.commands';
import { clientesCommands } from '../api/commands/clientes.commands';

export const Cadastros = () => {
  const [abaAtiva, setAbaAtiva] = useState<'produto' | 'cliente'>('produto');
  const [salvando, setSalvando] = useState(false);

  // Estados Form Produto
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoMaximo, setPrecoMaximo] = useState('');
  const [regraComissaoId, setRegraComissaoId] = useState('1'); // Regra padrão 1

  // Estados Form Cliente
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [nomeComprador, setNomeComprador] = useState('');
  const [telefoneComprador, setTelefoneComprador] = useState('');

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProduto || !precoMinimo || !precoMaximo) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      await produtosCommands.criarProduto({
        nome: nomeProduto,
        descricao: descricaoProduto,
        precoMinimo: Number(precoMinimo),
        precoMaximo: Number(precoMaximo),
        regraComissaoId: Number(regraComissaoId)
      });
      alert('Produto cadastrado com sucesso!');
      // Limpa formulário
      setNomeProduto('');
      setDescricaoProduto('');
      setPrecoMinimo('');
      setPrecoMaximo('');
      setRegraComissaoId('1');
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      alert(`Erro ao cadastrar produto: ${error.response?.data?.Erro || error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const salvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial || !nomeFantasia || !cnpj || !inscricaoEstadual || !cep || !logradouro || !numero || !bairro || !cidade || !estado || !nomeComprador || !telefoneComprador) {
      alert('Todos os campos (exceto complemento) são obrigatórios para validação da entidade Cliente.');
      return;
    }

    setSalvando(true);
    try {
      await clientesCommands.criarCliente({
        razaoSocial,
        nomeFantasia,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cnpj,
        inscricaoEstadual,
        nomeComprador,
        telefoneComprador
      });
      alert('Cliente cadastrado com sucesso!');
      // Limpa formulário
      setRazaoSocial('');
      setNomeFantasia('');
      setCnpj('');
      setInscricaoEstadual('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
      setNomeComprador('');
      setTelefoneComprador('');
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente:', error);
      alert(`Erro ao cadastrar cliente: ${error.response?.data?.Erro || error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200/50">
        <button
          onClick={() => setAbaAtiva('produto')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
            abaAtiva === 'produto' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cadastro de Produto
        </button>
        <button
          onClick={() => setAbaAtiva('cliente')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
            abaAtiva === 'cliente' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cadastro de Cliente
        </button>
      </div>

      <div className="card p-8">
        {abaAtiva === 'produto' ? (
          <form className="space-y-6" onSubmit={salvarProduto}>
            <h2 className="text-xl font-semibold border-b border-slate-100 pb-4 mb-6 text-slate-800">Novo Produto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Produto *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Geladeira Frost Free" 
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Descrição</label>
                <textarea 
                  className="input-field h-24" 
                  placeholder="Descrição detalhada..."
                  value={descricaoProduto}
                  onChange={(e) => setDescricaoProduto(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Preço Mínimo (R$) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-field" 
                  placeholder="0.00" 
                  value={precoMinimo}
                  onChange={(e) => setPrecoMinimo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Preço Máximo (R$) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-field" 
                  placeholder="0.00" 
                  value={precoMaximo}
                  onChange={(e) => setPrecoMaximo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Regra de Comissão (ID) *</label>
                <select 
                  className="input-field"
                  value={regraComissaoId}
                  onChange={(e) => setRegraComissaoId(e.target.value)}
                >
                  <option value="1">Regra 1 (Padrão/Geral)</option>
                  <option value="2">Regra 2 (Especial)</option>
                  <option value="3">Regra 3 (Promocional)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {salvando ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={salvarCliente}>
            <h2 className="text-xl font-semibold border-b border-slate-100 pb-4 mb-6 text-slate-800">Novo Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Razão Social *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Razão Social" 
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome Fantasia *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Nome Fantasia" 
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">CNPJ *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Somente números (ex: 12345678000199)" 
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Inscrição Estadual *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Inscrição Estadual" 
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                />
              </div>

              {/* Endereço */}
              <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Endereço</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">CEP *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: 89000000" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Logradouro *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Rua / Avenida" 
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Número *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Nº" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Complemento</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Apto, Sala, Bloco" 
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bairro *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Bairro" 
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Cidade *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Cidade" 
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Estado *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="UF (ex: SP)" 
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>

              {/* Contato do Comprador */}
              <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Contato do Comprador</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Comprador *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Nome do responsável pelas compras" 
                  value={nomeComprador}
                  onChange={(e) => setNomeComprador(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Telefone do Comprador *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Telefone ou celular" 
                  value={telefoneComprador}
                  onChange={(e) => setTelefoneComprador(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button type="submit" disabled={salvando} className="btn-primary flex items-center gap-2">
                {salvando ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {salvando ? 'Salvando...' : 'Salvar Cliente'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
