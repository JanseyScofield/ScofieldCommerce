import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, History, Users, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout = () => {
  const localizacao = useLocation();

  const navegacao = [
    { nome: 'Dashboard', caminho: '/', icone: LayoutDashboard },
    { nome: 'Nova Venda', caminho: '/nova-venda', icone: ShoppingCart },
    { nome: 'Histórico', caminho: '/historico', icone: History },
    { nome: 'Clientes', caminho: '/relatorio-clientes', icone: Users },
    { nome: 'Cadastros', caminho: '/cadastros', icone: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Menu Lateral */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <img src="/logo.svg" alt="Scofield Commerce" className="h-9 w-auto" />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navegacao.map((item) => {
            const estaAtivo = localizacao.pathname === item.caminho;
            const Icone = item.icone;
            
            return (
              <Link
                key={item.nome}
                to={item.caminho}
                className={clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  estaAtivo 
                    ? 'bg-yellow-400 text-slate-900 font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Icone className={clsx('mr-3 h-5 w-5', estaAtivo ? 'text-slate-900' : 'text-slate-500')} />
                {item.nome}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 w-full rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800">
            {navegacao.find(n => n.caminho === localizacao.pathname)?.nome || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold shadow-sm">
              JS
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
