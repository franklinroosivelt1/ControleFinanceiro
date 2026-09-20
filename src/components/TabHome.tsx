import React, { useState } from 'react';
import {
  Wallet,
  Hammer,
  Clock,
  TrendingDown,
  Receipt,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { BudgetConfig, Category, Transaction } from '../types';
import { formatBRL } from '../utils/formatters';
import { FinanceSummary } from '../utils/financeCalculations';
import { ActiveTab } from './TabNavigation';

interface TabHomeProps {
  summary: FinanceSummary;
  budgetConfig: BudgetConfig;
  onUpdateBudgetConfig: (newConfig: BudgetConfig) => void;
  categories?: Category[];
  recentTransactions?: Transaction[];
  onNavigateToTab?: (tab: ActiveTab) => void;
  onOpenAddExpense?: (source: 'despesas_anteriores' | 'controle_caixa') => void;
  onEditTransaction?: (tx: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  summary,
  budgetConfig,
  onUpdateBudgetConfig,
}) => {
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [valorPossuidoInput, setValorPossuidoInput] = useState(
    summary.valorTotalPossuidoInicial.toString()
  );
  const [saldoObraInput, setSaldoObraInput] = useState(
    summary.saldoObraPretendidoInicial.toString()
  );

  const handleSaveInitialValues = (e: React.FormEvent) => {
    e.preventDefault();
    const possuido = Math.max(0, parseFloat(valorPossuidoInput) || 0);
    const obra = Math.max(0, parseFloat(saldoObraInput) || 0);

    onUpdateBudgetConfig({
      ...budgetConfig,
      valorTotalPossuido: possuido,
      saldoObraPretendido: obra,
      totalReceived: possuido,
      maxSpendingLimit: obra,
      lastUpdated: new Date().toISOString(),
    });

    setIsEditingValues(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão para Ajustar Metas */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
            Indicadores Financeiros Principais
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Visão consolidada dos saldos e despesas da obra
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setValorPossuidoInput(summary.valorTotalPossuidoInicial.toString());
            setSaldoObraInput(summary.saldoObraPretendidoInicial.toString());
            setIsEditingValues(!isEditingValues);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-stone-500" />
          <span>Ajustar Metas</span>
        </button>
      </div>

      {/* Formulário de Edição de Metas (se ativado) */}
      {isEditingValues && (
        <form
          onSubmit={handleSaveInitialValues}
          className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md animate-in fade-in space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Ajustar Valores Base
              </h3>
              <p className="text-xs text-stone-500">
                Atualize o capital disponível em conta e o orçamento pretendido da obra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingValues(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold px-2.5 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Valor Total que Possuo (Capital em Conta)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorPossuidoInput}
                  onChange={(e) => setValorPossuidoInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-emerald-300 bg-white text-stone-900 font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <label className="block text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">
                Saldo Disponível Para a Obra (Teto Pretendido)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-700 font-bold text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={saldoObraInput}
                  onChange={(e) => setSaldoObraInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sky-300 bg-white text-stone-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingValues(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl hover:bg-stone-100 cursor-pointer"
            >
              Descartar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar Metas
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* OS 5 BALÕES SIMPLES E DE FÁCIL LEITURA SOLICITADOS            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Balão 1: Valor Total Disponível em Conta */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              Disponível em Conta
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-stone-600">
              Valor Total Disponível em Conta
            </p>
            <h4
              className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${
                summary.valorTotalDisponivel < 0 ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {formatBRL(summary.valorTotalDisponivel)}
            </h4>
          </div>

          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100">
            Capital inicial: {formatBRL(summary.valorTotalPossuidoInicial)}
          </p>
        </div>

        {/* Balão 2: Saldo Disponível para a Obra */}
        <div className="bg-white rounded-3xl p-5 border border-sky-200/90 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Hammer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/60">
              Para a Obra
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-stone-600">
              Saldo Disponível para a Obra
            </p>
            <h4
              className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${
                summary.saldoDisponivelObra < 0 ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {formatBRL(summary.saldoDisponivelObra)}
            </h4>
          </div>

          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100">
            Teto pretendido: {formatBRL(summary.saldoObraPretendidoInicial)}
          </p>
        </div>

        {/* Balão 3: Total de Gastos: do valor Disponível para obra */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
              Despesas Atuais
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-stone-600">
              Total de Gastos: do valor Disponível para obra
            </p>
            <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 mt-1">
              {formatBRL(summary.totalDespesasAtuais)}
            </h4>
          </div>

          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100">
            {summary.percentualObraConsumido}% do orçamento da obra consumido
          </p>
        </div>

        {/* Balão 4: Despesas Anteriores: somatório */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
              Gastos Passados
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-stone-600">
              Despesas Anteriores: somatório
            </p>
            <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 mt-1">
              {formatBRL(summary.totalDespesasAnteriores)}
            </h4>
          </div>

          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100">
            Gastos realizados antes do início do controle
          </p>
        </div>

        {/* Balão 5: Total Geral de despesas - somatório de todos os gastos */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-stone-950 text-white rounded-3xl p-5 border border-indigo-900 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-800 text-indigo-200 border border-indigo-700">
              Somatório Consolidado
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-indigo-200">
              Total Geral de despesas - somatório de todos os gastos
            </p>
            <h4 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              {formatBRL(summary.totalGeralDespesas)}
            </h4>
          </div>

          <div className="mt-3 pt-2.5 border-t border-indigo-900/80 text-[11px] text-indigo-200/80 flex items-center justify-between">
            <span>
              Despesas Anteriores ({formatBRL(summary.totalDespesasAnteriores)}) + Despesas Atuais ({formatBRL(summary.totalDespesasAtuais)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
