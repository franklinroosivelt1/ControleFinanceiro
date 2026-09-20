import React from 'react';
import { Plus, TrendingUp, Wallet, CheckCircle, PieChart, ArrowDownRight, Layers, Target } from 'lucide-react';
import { formatBRL } from '../utils/formatters';

interface SummaryCardsProps {
  totalSpentAll: number;
  totalSpentTab1: number;
  totalSpentTab2: number;
  totalReceived: number;
  maxSpendingLimit: number;
  countTab1: number;
  countTab2: number;
  onOpenAddExpense: () => void;
  onNavigateToTab?: (tab: 'tab1' | 'tab2') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSpentAll,
  totalSpentTab1,
  totalSpentTab2,
  totalReceived,
  maxSpendingLimit,
  countTab1,
  countTab2,
  onOpenAddExpense,
  onNavigateToTab,
}) => {
  const totalAvailable = totalReceived - totalSpentAll;
  const isAvailablePositive = totalAvailable >= 0;
  
  const budgetUsagePercent = maxSpendingLimit > 0
    ? Math.min(100, Math.round((totalSpentAll / maxSpendingLimit) * 100))
    : 0;
  
  const isOverBudget = maxSpendingLimit > 0 && totalSpentAll > maxSpendingLimit;

  return (
    <div className="space-y-4">
      {/* Top Hero Card - Total Investido & Botão Grande "+" */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden border border-stone-800">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
                <TrendingUp className="w-3.5 h-3.5" />
                Progresso Financeiro da Obra
              </span>
              <span className="text-xs text-stone-400">
                Total consolidado ({countTab1 + countTab2} registros)
              </span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm font-medium tracking-wide uppercase">
              Valor Total Investido até o Momento
            </p>
            <div className="mt-1 flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {formatBRL(totalSpentAll)}
              </h2>
              {maxSpendingLimit > 0 && (
                <span className={`text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-lg ${
                  isOverBudget 
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800' 
                    : 'bg-stone-800 text-emerald-400 border border-stone-700'
                }`}>
                  {isOverBudget ? `Excedeu a meta em ${formatBRL(totalSpentAll - maxSpendingLimit)}` : `${budgetUsagePercent}% da meta utilizada`}
                </span>
              )}
            </div>

            {/* Barra de Progresso visual da Meta Máxima */}
            {maxSpendingLimit > 0 && (
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-xs text-stone-400 mb-1.5">
                  <span>Consumo da Meta Máxima ({formatBRL(maxSpendingLimit)})</span>
                  <span className={isOverBudget ? 'text-rose-400 font-bold' : 'text-stone-300'}>
                    {Math.round((totalSpentAll / maxSpendingLimit) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-rose-500' : budgetUsagePercent > 85 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalSpentAll / maxSpendingLimit) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botão Grande "+" Adicionar Gasto solicitado em destaque */}
          <div className="shrink-0 flex sm:flex-col items-stretch gap-2">
            <button
              id="btn-add-expense-hero"
              type="button"
              onClick={onOpenAddExpense}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-950/15 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <span>Adicionar Gasto</span>
            </button>
            <p className="text-center text-[11px] text-stone-400 hidden sm:block">
              Rápido • Em poucos segundos
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Principais: Disponível, Tela 1, Tela 2, Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Valor Total Disponível */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Valor Disponível
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isAvailablePositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold tracking-tight ${
              isAvailablePositive ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {formatBRL(totalAvailable)}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>Capital Total:</span>
              <span className="font-medium text-stone-800">{formatBRL(totalReceived)}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Somatório Tela 1 (Gastos Realizados / Obra) */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('tab1')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                1. Gastos Realizados
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900">
              {formatBRL(totalSpentTab1)}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>Registros:</span>
              <span className="font-semibold text-stone-700">{countTab1} itens</span>
            </p>
          </div>
        </div>

        {/* Card 3: Somatório Tela 2 (Controle de Valor Recebido / Meta) */}
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('tab2')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                2. Controle do Recebido
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900">
              {formatBRL(totalSpentTab2)}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>Registros:</span>
              <span className="font-semibold text-stone-700">{countTab2} itens</span>
            </p>
          </div>
        </div>

        {/* Card 4: Meta Máxima Permitida */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Teto / Meta Máxima
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-stone-900">
              {formatBRL(maxSpendingLimit)}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>Status:</span>
              <span className={`font-semibold ${isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                {isOverBudget ? 'Excedido' : 'Dentro do Teto'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
