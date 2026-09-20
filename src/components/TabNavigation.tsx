import React from 'react';
import { Home, Clock, Hammer, Wallet, History, ArrowRight } from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export type ActiveTab =
  | 'home'
  | 'despesas_anteriores'
  | 'despesas_atuais'
  | 'controle_caixa'
  | 'history';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  totalDespesasAnteriores: number;
  totalDespesasAtuais: number;
  totalGeralDespesas: number;
  totalCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  totalDespesasAnteriores,
  totalDespesasAtuais,
  totalGeralDespesas,
  totalCount,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Tela Inicial',
      sublabel: 'Visão Geral',
      badge: 'Dashboard',
      icon: Home,
      color: 'emerald',
      activeClasses: 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-600/20',
      inactiveClasses: 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40',
      iconBgActive: 'bg-emerald-700 text-white',
      iconBgInactive: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'despesas_anteriores' as ActiveTab,
      label: 'Despesas Anteriores',
      sublabel: 'Gastos passados',
      badge: formatBRL(totalDespesasAnteriores),
      icon: Clock,
      color: 'amber',
      activeClasses: 'bg-amber-900 text-white border-amber-950 shadow-sm ring-2 ring-amber-600/20',
      inactiveClasses: 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-amber-50/40',
      iconBgActive: 'bg-amber-800 text-white',
      iconBgInactive: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'despesas_atuais' as ActiveTab,
      label: 'Despesas Atuais',
      sublabel: 'Lançamentos da obra',
      badge: formatBRL(totalDespesasAtuais),
      icon: Hammer,
      color: 'sky',
      activeClasses: 'bg-sky-900 text-white border-sky-950 shadow-sm ring-2 ring-sky-600/20',
      inactiveClasses: 'bg-white text-stone-700 border-stone-200 hover:border-sky-300 hover:bg-sky-50/40',
      iconBgActive: 'bg-sky-800 text-white',
      iconBgInactive: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'controle_caixa' as ActiveTab,
      label: 'Controle de Caixa',
      sublabel: 'Resumo geral e saldos',
      badge: `Geral: ${formatBRL(totalGeralDespesas)}`,
      icon: Wallet,
      color: 'indigo',
      activeClasses: 'bg-indigo-900 text-white border-indigo-950 shadow-sm ring-2 ring-indigo-600/20',
      inactiveClasses: 'bg-white text-stone-700 border-stone-200 hover:border-indigo-300 hover:bg-indigo-50/40',
      iconBgActive: 'bg-indigo-800 text-white',
      iconBgInactive: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'history' as ActiveTab,
      label: 'Histórico de Gastos',
      sublabel: 'Registros do usuário',
      badge: `${totalCount} itens`,
      icon: History,
      color: 'stone',
      activeClasses: 'bg-stone-900 text-white border-stone-950 shadow-sm ring-2 ring-stone-900/20',
      inactiveClasses: 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50/60',
      iconBgActive: 'bg-stone-800 text-white',
      iconBgInactive: 'bg-stone-100 text-stone-700',
    },
  ];

  return (
    <div className="w-full">
      {/* Botões Estilo Cards Retangulares em Grid Responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-card-btn-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[82px] sm:min-h-[92px] cursor-pointer ${
                isActive ? item.activeClasses : item.inactiveClasses
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? item.iconBgActive : item.iconBgInactive
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md">
                    Ativo
                  </span>
                )}
              </div>

              <div className="mt-2 min-w-0">
                <p className="text-xs sm:text-sm font-extrabold leading-tight truncate">
                  {item.label}
                </p>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span
                    className={`text-[11px] font-semibold truncate ${
                      isActive ? 'text-white/80' : 'text-stone-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
