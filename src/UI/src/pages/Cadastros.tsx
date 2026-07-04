import { useState } from 'react';
import { Save, Loader } from 'lucide-react';
import { produtosCommands } from '../api/commands/produtos.commands';
import { clientesCommands } from '../api/commands/clientes.commands';
import { Popup } from '../components/Popup';
import { cepQueries } from '../api/queries/cep.queries';

export const Cadastros = () => {
  const [abaAtiva, setAbaAtiva] = useState<'produto' | 'cliente'>('produto');
  const [salvando, setSalvando] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
  };

  // Estados Form Produto
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoMaximo, setPrecoMaximo] = useState('');

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
      showPopup('error', 'Preencha os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      await produtosCommands.criarProduto({
        nome: nomeProduto,
        precoMinimo: Number(precoMinimo),
        precoMaximo: Number(precoMaximo)
      });
      showPopup('success', 'Produto cadastrado com sucesso!');
      // Limpa formulário
      setNomeProduto('');
      setPrecoMinimo('');
      setPrecoMaximo('');
    } catch (error: any) {
      console.error('Erro ao cadastrar produto:', error);
      const mensagemErro = error.response?.data?.erro || error.response?.data?.Erro || error.response?.data?.message || error.message;
      showPopup('error', mensagemErro);
    } finally {
      setSalvando(false);
    }
  };

  const buscarCep = async (cepVal: string) => {
    const data = await cepQueries.buscar(cepVal);
    if (data) {
      if (data.logradouro) setLogradouro(data.logradouro);
      if (data.bairro) setBairro(data.bairro);
      if (data.localidade) setCidade(data.localidade);
      if (data.uf) setEstado(data.uf.toUpperCase());
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCep(val);
    if (val.length === 8) {
      buscarCep(val);
    }
  };

  const salvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial || !nomeFantasia || !cnpj || !cep || !logradouro || !numero || !bairro || !cidade || !estado || !nomeComprador || !telefoneComprador) {
      showPopup('error', 'Todos os campos (exceto complemento e inscrição estadual) são obrigatórios para validação da entidade Cliente.');
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
      showPopup('success', 'Cliente cadastrado com sucesso!');
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
      const mensagemErro = error.response?.data?.erro || error.response?.data?.Erro || error.response?.data?.message || error.message;
      showPopup('error', mensagemErro);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Popup 
        show={popup?.show ?? false}
        type={popup?.type ?? 'error'}
        message={popup?.message ?? ''}
        onClose={() => setPopup(null)}
      />

      <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200/50">
        <button
          onClick={() => setAbaAtiva('produto')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${abaAtiva === 'produto' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          Cadastro de Produto
        </button>
        <button
          onClick={() => setAbaAtiva('cliente')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${abaAtiva === 'cliente' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                  placeholder="Ex: Bobina Picotada  25 x 35"
                  maxLength={150}
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                />
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
                  maxLength={200}
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
                  maxLength={200}
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">CNPJ *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: 12345678000199 (somente números)"
                  maxLength={14}
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Inscrição Estadual</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Inscrição Estadual (opcional)"
                  maxLength={50}
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
                  placeholder="Ex: 89000000 (somente números)"
                  maxLength={8}
                  value={cep}
                  onChange={handleCepChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Logradouro *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Rua / Avenida"
                  maxLength={200}
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
                  maxLength={20}
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
                  maxLength={100}
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
                  maxLength={100}
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
                  maxLength={100}
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
                  maxLength={2}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.toUpperCase())}
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
                  maxLength={150}
                  value={nomeComprador}
                  onChange={(e) => setNomeComprador(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Telefone do Comprador *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: 11999999999 (somente números)"
                  maxLength={20}
                  value={telefoneComprador}
                  onChange={(e) => setTelefoneComprador(e.target.value.replace(/\D/g, ''))}
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
    </>
  );
};
