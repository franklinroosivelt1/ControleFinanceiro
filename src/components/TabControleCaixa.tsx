import React from 'react';
import {
  Wallet,
  Hammer,
  Clock,
  TrendingDown,
  ArrowRight,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Coins,
  Receipt,
  Scale,
} from 'lucide-react';
import { FinanceSummary } from '../utils/financeCalculations';
import { formatBRL } from '../utils/formatters';
import { Transaction } from '../types';

interface TabControleCaixaProps {
  summary: FinanceSummary;
  transactions: Transaction[];
  onNavigateToTab: (tab: 'despesas_anteriores' | 'despesas_atuais' | 'history') => void;
  onOpenAddExpense: (source: 'despesas_anteriores' | 'controle_caixa') => void;
}

export const TabControleCaixa: React.FC<TabControleCaixaProps> = ({
  summary,
  transactions,
  onNavigateToTab,
  onOpenAddExpense,
}) => {
  const countAnteriores = transactions.filter(
    (t) => t.source === 'despesas_anteriores' || t.source === 'tab1_general'
  ).length;

  const countAtuais = transactions.filter(
    (t) => t.source === 'controle_caixa' || t.source === 'tab2_budget'
  ).length;

  const totalGeral = summary.totalGeralDespesas;

  // Percentuais para barra de distribuição
  const percentAnteriores =
    totalGeral > 0 ? Math.round((summary.totalDespesasAnteriores / totalGeral) * 100) : 0;
  const percentAtuais =
    totalGeral > 0 ? Math.round((summary.totalDespesasAtuais / totalGeral) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Tela */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Tela: Controle de Caixa
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                Controle de Caixa & Resumo Geral
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Visão consolidada dos saldos disponíveis em conta, teto da obra, somatório de despesas anteriores, despesas atuais e total geral de gastos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => onOpenAddExpense('controle_caixa')}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Lançar no Caixa
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. RESUMO GERAL DE SALDOS DISPONÍVEIS                        */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-500 px-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-700" />
          <span>Resumo Geral de Saldos Disponíveis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card: Valor Total Disponível em Conta */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                Valor Total Disponível em Conta
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-stone-500">Saldo real disponível agora:</span>
              <h4 className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${
                summary.valorTotalDisponivel < 0 ? 'text-rose-600' : 'text-stone-900'
              }`}>
                {formatBRL(summary.valorTotalDisponivel)}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
              <span>Capital total inicial:</span>
              <span className="font-bold text-stone-700">
                {formatBRL(summary.valorTotalPossuidoInicial)}
              </span>
            </div>
          </div>

          {/* Card: Saldo Disponível para a Obra */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900">
                Saldo Disponível para a Obra
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Hammer className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-stone-500">Orçamento que ainda pode ser gasto na obra:</span>
              <h4 className={`text-2xl sm:text-3xl font-black tracking-tight mt-1 ${
                summary.saldoDisponivelObra < 0 ? 'text-rose-600' : 'text-stone-900'
              }`}>
                {formatBRL(summary.saldoDisponivelObra)}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
              <span>Teto planejado da obra:</span>
              <span className="font-bold text-stone-700">
                {formatBRL(summary.saldoObraPretendidoInicial)}
              </span>
            </div>
          </div>

          {/* Card: Consumo da Obra & Segurança */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Status do Teto da Obra
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-stone-400">Percentual utilizado da obra:</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {summary.percentualObraConsumido}%
                </h4>
                <span className="text-xs text-stone-400">do teto consumido</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-xs flex items-center justify-between">
              <span className="text-stone-400">Condição atual:</span>
              <span className={`font-bold ${summary.isObraEstourada ? 'text-rose-400' : 'text-emerald-400'}`}>
                {summary.isObraEstourada ? 'Orçamento Estourado' : 'Sob Controle'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TOTAL GASTO DESPESAS ANTERIORES, ATUAIS E TOTAL GERAL      */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-500 px-1 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-indigo-700" />
          <span>Demonstrativo Geral de Despesas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card: Total Gasto das Despesas Anteriores */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Despesas Anteriores
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-stone-500 mt-3">
                Total gasto antes do início deste controle:
              </p>
              <h4 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {formatBRL(summary.totalDespesasAnteriores)}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1">
                {countAnteriores} despesa{countAnteriores === 1 ? '' : 's'} registrada{countAnteriores === 1 ? '' : 's'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigateToTab('despesas_anteriores')}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ver Despesas Anteriores</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card: Total das Despesas Atuais */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                  Despesas Atuais
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Hammer className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-stone-500 mt-3">
                Total gasto nos lançamentos atuais da obra:
              </p>
              <h4 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {formatBRL(summary.totalDespesasAtuais)}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1">
                {countAtuais} despesa{countAtuais === 1 ? '' : 's'} registrada{countAtuais === 1 ? '' : 's'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigateToTab('despesas_atuais')}
                className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ver Despesas Atuais</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card: TOTAL GERAL DE GASTOS */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-stone-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-900 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-800/80 text-indigo-200 border border-indigo-700">
                  Total Consolidado
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-indigo-200/80 mt-3">
                Total Geral de Despesas (Somatório de todos os gastos):
              </p>
              <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {formatBRL(totalGeral)}
              </h4>
              <p className="text-[11px] text-indigo-300/80 mt-1">
                {transactions.length} registros no total
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-indigo-900/80 flex items-center justify-between">
              <span className="text-[11px] text-indigo-200/70">Anteriores + Atuais</span>
              <button
                type="button"
                onClick={() => onNavigateToTab('history')}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
              >
                Ver Histórico
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BARRA VISUAL DE DISTRIBUIÇÃO DOS GASTOS                   */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-700" />
          <span>Distribuição Proporcional dos Gastos</span>
        </h4>

        {totalGeral === 0 ? (
          <p className="text-xs text-stone-500 py-3">
            Nenhum gasto registrado ainda para exibir a proporção.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Barra empilhada */}
            <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${percentAnteriores}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Despesas Anteriores: ${percentAnteriores}%`}
              />
              <div
                style={{ width: `${percentAtuais}%` }}
                className="bg-sky-600 h-full transition-all"
                title={`Despesas Atuais: ${percentAtuais}%`}
              />
            </div>

            {/* Legenda */}
            <div className="flex items-center justify-between flex-wrap gap-4 text-xs pt-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="font-bold text-stone-800">
                  Despesas Anteriores: {percentAnteriores}% ({formatBRL(summary.totalDespesasAnteriores)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-600 shrink-0" />
                <span className="font-bold text-stone-800">
                  Despesas Atuais: {percentAtuais}% ({formatBRL(summary.totalDespesasAtuais)})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
