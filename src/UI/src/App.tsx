import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { NovaVenda } from './pages/NovaVenda';
import { HistoricoVendas } from './pages/HistoricoVendas';
import { Cadastros } from './pages/Cadastros';
import { RelatorioClientes } from './pages/RelatorioClientes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="nova-venda" element={<NovaVenda />} />
          <Route path="historico" element={<HistoricoVendas />} />
          <Route path="cadastros" element={<Cadastros />} />
          <Route path="relatorio-clientes" element={<RelatorioClientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
