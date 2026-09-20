import React, { useState } from 'react';
import { Target, Wallet, AlertTriangle, CheckCircle2, Plus, Edit2, Trash2, Calendar, TrendingDown, ShieldCheck, Tag } from 'lucide-react';
import { BudgetConfig, Category, Transaction } from '../types';
import { formatBRL, formatDateLongBR, getCategoryTheme } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TabBudgetControlProps {
  budgetConfig: BudgetConfig;
  onUpdateBudgetConfig: (newConfig: BudgetConfig) => void;
  transactions: Transaction[];
  categories: Category[];
  totalSpentTab2: number;
  totalSpentAll: number;
  onOpenAddExpense: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TabBudgetControl: React.FC<TabBudgetControlProps> = ({
  budgetConfig,
  onUpdateBudgetConfig,
  transactions,
  categories,
  totalSpentTab2,
  totalSpentAll,
  onOpenAddExpense,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const receivedVal = budgetConfig.valorTotalPossuido ?? budgetConfig.totalReceived ?? 0;
  const limitVal = budgetConfig.saldoObraPretendido ?? budgetConfig.maxSpendingLimit ?? 0;

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [totalReceivedInput, setTotalReceivedInput] = useState(receivedVal.toString());
  const [maxSpendingLimitInput, setMaxSpendingLimitInput] = useState(limitVal.toString());
  const [descriptionInput, setDescriptionInput] = useState(budgetConfig.description || '');

  // Transactions belonging to Tab 2
  const tab2Transactions = transactions.filter((t) => t.source === 'tab2_budget');

  const handleSaveBudgetSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const received = parseFloat(totalReceivedInput) || 0;
    const limit = parseFloat(maxSpendingLimitInput) || 0;

    onUpdateBudgetConfig({
      ...budgetConfig,
      valorTotalPossuido: received,
      saldoObraPretendido: limit,
      totalReceived: received,
      maxSpendingLimit: limit,
      description: descriptionInput.trim(),
      lastUpdated: new Date().toISOString(),
    });
    setIsEditingConfig(false);
  };

  const isExceeded = limitVal > 0 && totalSpentAll > limitVal;
  const marginRemaining = limitVal - totalSpentAll;
  const cashRemaining = receivedVal - totalSpentAll;
  const percentUsed = limitVal > 0
    ? Math.round((totalSpentAll / limitVal) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner da Tela 2 */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                Aba 2 • Valor Recebido & Meta Máxima
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Controle de Valor Recebido e Meta
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Estipule o capital total disponível, defina o teto de gastos e lance despesas controladas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 font-medium">Somatório Desta Aba</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-900">
              {formatBRL(totalSpentTab2)}
            </div>
            <span className="text-xs text-stone-400">
              {tab2Transactions.length} {tab2Transactions.length === 1 ? 'gasto registrado' : 'gastos registrados'}
            </span>
          </div>

          <button
            id="btn-add-expense-tab2"
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Lançar Gasto da Meta</span>
          </button>
        </div>
      </div>

      {/* Card de Configuração de Valor Possuído e Meta Máxima */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-stone-800">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Parâmetros do Orçamento
              </h3>
              <p className="text-xs text-stone-400">
                Configure o valor total em conta e o teto máximo que você pode gastar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingConfig(!isEditingConfig)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingConfig ? 'Fechar Edição' : 'Ajustar Metas'}</span>
          </button>
        </div>

        {isEditingConfig ? (
          <form onSubmit={handleSaveBudgetSettings} className="space-y-4 max-w-2xl bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Valor Total que Possuo (R$) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={totalReceivedInput}
                    onChange={(e) => setTotalReceivedInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-base font-bold text-white bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ex: 100000"
                    required
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Capital total disponível ou valor total recebido</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Meta Máxima de Gastos (R$) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={maxSpendingLimitInput}
                    onChange={(e) => setMaxSpendingLimitInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-base font-bold text-white bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ex: 80000"
                    required
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Limite que os gastos não podem ultrapassar</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Descrição do Projeto / Finalidade
              </label>
              <input
                type="text"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                className="w-full px-3 py-2 text-sm text-white bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ex: Reforma Geral Apartamento 402"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingConfig(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl cursor-pointer"
              >
                Salvar Parâmetros
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Valor que Possui */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                Valor Total que Possuo
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {formatBRL(receivedVal)}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Disponível real restante:{' '}
                <strong className={cashRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatBRL(cashRemaining)}
                </strong>
              </p>
            </div>

            {/* Meta Máxima de Gastos */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                Meta Máxima de Gastos
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                {formatBRL(limitVal)}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {isExceeded ? (
                  <span className="text-rose-400 font-bold">Excedido em {formatBRL(Math.abs(marginRemaining))}</span>
                ) : (
                  <span className="text-stone-300">Margem até o limite: <strong className="text-emerald-400">{formatBRL(marginRemaining)}</strong></span>
                )}
              </p>
            </div>

            {/* Consumo Percentual */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-stone-800/80">
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                Utilização do Orçamento
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                <span>{percentUsed}%</span>
                <span className="text-xs text-stone-400 font-normal">consumido</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isExceeded ? 'bg-rose-500' : percentUsed > 85 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Gastos Vinculados à Meta (Aba 2) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Gastos Vinculados ao Controle do Valor Recebido
            </h3>
            <p className="text-xs text-stone-500">
              Transações associadas especificamente ao teto de gastos estipulado
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddExpense}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Descrever Novo Gasto</span>
          </button>
        </div>

        {tab2Transactions.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">
              Nenhum gasto vinculado a esta meta ainda
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Informe o valor gasto e descreva em que foi gasto para acompanhar o consumo da sua meta máxima.
            </p>
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Descrever Primeiro Gasto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {tab2Transactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const theme = getCategoryTheme(cat?.color || 'stone');
              const sub = cat?.subcategories.find((s) => s.id === tx.subcategoryId);

              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 p-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${theme.bg}`}>
                      <CategoryIcon iconName={cat?.icon || 'Tag'} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${theme.badge}`}>
                          {cat?.name || 'Sem Categoria'}
                        </span>
                        {sub && (
                          <span className="text-stone-500 font-medium">
                            • {sub.name}
                          </span>
                        )}
                        <span className="text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateLongBR(tx.date)}
                        </span>
                        {tx.paymentMethod && (
                          <span className="text-stone-400">
                            • {tx.paymentMethod}
                          </span>
                        )}
                      </div>
                      {tx.notes && (
                        <p className="text-[11px] text-stone-500 italic mt-0.5">
                          Obs: {tx.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-stone-950 block">
                        {formatBRL(tx.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg cursor-pointer transition-colors"
                        title="Editar gasto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Excluir gasto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
