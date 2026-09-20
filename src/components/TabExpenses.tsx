import React from 'react';
import { Plus, Layers, Calendar, CreditCard, Trash2, Edit2, ArrowDownRight, Tag } from 'lucide-react';
import { Category, Transaction } from '../types';
import { formatBRL, formatDateLongBR, getCategoryTheme } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TabExpensesProps {
  transactions: Transaction[];
  categories: Category[];
  totalSpentTab1: number;
  onOpenAddExpense: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TabExpenses: React.FC<TabExpensesProps> = ({
  transactions,
  categories,
  totalSpentTab1,
  onOpenAddExpense,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  // Filter only transactions belonging to Tab 1
  const tab1Transactions = transactions.filter((t) => t.source === 'tab1_general');

  // Breakdown by category
  const categoryBreakdown = categories
    .map((cat) => {
      const spent = tab1Transactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalSpentTab1 > 0 ? (spent / totalSpentTab1) * 100 : 0;
      return { cat, spent, percentage };
    })
    .filter((item) => item.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="space-y-6">
      {/* Top Banner da Tela 1 */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Aba 1 • Gastos Realizados
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Registro de Gastos da Obra
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Gastos executados até o momento. Insira novos itens e acompanhe os custos por etapa.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 font-medium">Somatório Desta Aba</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">
              {formatBRL(totalSpentTab1)}
            </div>
            <span className="text-xs text-stone-400">
              {tab1Transactions.length} {tab1Transactions.length === 1 ? 'gasto registrado' : 'gastos registrados'}
            </span>
          </div>

          <button
            id="btn-add-expense-tab1"
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Inserir Mais Gastos</span>
          </button>
        </div>
      </div>

      {/* Grid: Distribuição por Categoria & Lista de Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Resumo das Categorias mais expressivas */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs h-fit space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Custos por Categoria</span>
            </h3>
            <span className="text-xs font-semibold text-stone-400">
              {categoryBreakdown.length} ativas
            </span>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400 italic bg-stone-50 rounded-2xl">
              Nenhum gasto registrado nesta aba ainda. Clique no botão de adicionar para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map(({ cat, spent, percentage }) => {
                const theme = getCategoryTheme(cat.color);
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        {cat.name}
                      </span>
                      <span className="font-bold text-stone-900">{formatBRL(spent)}</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${theme.bar}`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-stone-400 text-right">
                      {percentage.toFixed(1)}% do total desta aba
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coluna 2 e 3: Lista de Gastos desta Aba */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Gastos Realizados Recentes
              </h3>
              <p className="text-xs text-stone-500">
                Lançamentos cadastrados para acompanhamento dos custos da obra
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAddExpense}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          {tab1Transactions.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-stone-200 rounded-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-800">
                Nenhum gasto lançado nesta aba
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                Registre os gastos que você já teve até o momento na obra para manter o somatório sempre atualizado.
              </p>
              <button
                type="button"
                onClick={onOpenAddExpense}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                Inserir Primeiro Gasto
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {tab1Transactions.map((tx) => {
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
    </div>
  );
};
