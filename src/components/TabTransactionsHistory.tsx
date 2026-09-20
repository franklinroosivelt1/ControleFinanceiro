import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Tag,
  Layers,
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatBRL, formatDateBR, getCategoryTheme } from '../utils/formatters';

interface TabTransactionsHistoryProps {
  transactions: Transaction[];
  categories: Category[];
  onOpenAddExpense?: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TabTransactionsHistory: React.FC<TabTransactionsHistoryProps> = ({
  transactions,
  categories,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: 'all',
    subcategoryId: 'all',
    source: 'all' as 'all' | 'despesas_anteriores' | 'controle_caixa',
    sortBy: 'date_desc' as 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc',
  });

  const selectedCategory = categories.find((c) => c.id === filters.categoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchDesc = t.description.toLowerCase().includes(q);
          if (!matchDesc) return false;
        }

        // Category
        if (filters.categoryId !== 'all' && t.categoryId !== filters.categoryId) {
          return false;
        }

        // Subcategory
        if (filters.subcategoryId !== 'all' && t.subcategoryId !== filters.subcategoryId) {
          return false;
        }

        // Source / Tab origin
        if (filters.source !== 'all') {
          if (filters.source === 'despesas_anteriores') {
            if (t.source !== 'despesas_anteriores' && t.source !== 'tab1_general') return false;
          } else if (filters.source === 'controle_caixa') {
            if (t.source !== 'controle_caixa' && t.source !== 'tab2_budget') return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'date_desc') {
          return b.date.localeCompare(a.date);
        }
        if (filters.sortBy === 'date_asc') {
          return a.date.localeCompare(b.date);
        }
        if (filters.sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (filters.sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, filters]);

  const filteredTotal = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Data', 'Descricao', 'Valor', 'Categoria', 'Subcategoria', 'Origem'];
    const rows = filteredTransactions.map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId);
      const sub = cat?.subcategories.find((s) => s.id === t.subcategoryId);
      const origin = (t.source === 'despesas_anteriores' || t.source === 'tab1_general')
        ? 'Despesas Anteriores'
        : 'Controle de Caixa';
      return [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount.toFixed(2),
        `"${cat?.name || ''}"`,
        `"${sub?.name || ''}"`,
        `"${origin}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_gastos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Histórico Detalhado de Transações</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pesquise, filtre por categoria ou tela e exporte todos os registros
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            title="Exportar planilha CSV"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar pela descrição..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  categoryId: e.target.value,
                  subcategoryId: 'all',
                })
              }
              className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source / Tab Filter */}
          <div>
            <select
              value={filters.source}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  source: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todas as Telas (Despesas Anteriores & Caixa)</option>
              <option value="despesas_anteriores">Tela: Despesas Anteriores</option>
              <option value="controle_caixa">Tela: Controle de Caixa</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_desc">Mais Recentes Primeiro</option>
              <option value="date_asc">Mais Antigos Primeiro</option>
              <option value="amount_desc">Maior Valor</option>
              <option value="amount_asc">Menor Valor</option>
            </select>
          </div>
        </div>

        {/* Subcategory Filter (if category selected) */}
        {availableSubcategories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-stone-500 font-medium">Subcategoria:</span>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, subcategoryId: 'all' })}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                filters.subcategoryId === 'all'
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Todas
            </button>
            {availableSubcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setFilters({ ...filters, subcategoryId: sub.id })}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                  filters.subcategoryId === sub.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary of Filtered Results */}
      <div className="flex items-center justify-between px-2 text-xs text-stone-600">
        <div>
          Mostrando <strong>{filteredTransactions.length}</strong> de {transactions.length} transações
        </div>
        <div>
          Total dos registros filtrados: <strong className="text-stone-900 text-sm font-extrabold">{formatBRL(filteredTotal)}</strong>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">
              Nenhuma transação encontrada
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Tente ajustar os filtros de pesquisa ou adicione um novo gasto.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const theme = getCategoryTheme(cat?.color || 'stone');
              const sub = cat?.subcategories.find((s) => s.id === tx.subcategoryId);
              const isAnterior = tx.source === 'despesas_anteriores' || tx.source === 'tab1_general';

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${theme.bg}`}>
                        <CategoryIcon iconName={cat?.icon || 'Tag'} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Descrição Completa (sem truncar) */}
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug break-words">
                          {tx.description}
                        </h4>

                        {/* Metadados: Categoria, Subcategoria e Data formatada */}
                        <div className="flex items-center gap-2 flex-wrap mt-2 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] whitespace-nowrap ${theme.badge}`}>
                            {cat?.name || 'Sem Categoria'}
                          </span>
                          {sub && (
                            <span className="text-stone-600 font-medium text-[11px] whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded-md">
                              {sub.name}
                            </span>
                          )}
                          <span className="text-stone-500 font-medium text-[11px] whitespace-nowrap">
                            • {formatDateBR(tx.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Valor e Ações */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5 pl-2">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight whitespace-nowrap">
                        {isAnterior ? formatBRL(tx.amount) : `- ${formatBRL(tx.amount)}`}
                      </span>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${
                        isAnterior
                          ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          : 'bg-sky-50 text-sky-800 border border-sky-200/60'
                      }`}>
                        {isAnterior ? 'Despesa Anterior' : 'Controle de Caixa'}
                      </span>

                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                          title="Editar gasto"
                          aria-label="Editar gasto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Excluir gasto"
                          aria-label="Excluir gasto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
