import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { formatBRL, formatDateBR, getCategoryTheme } from '../utils/formatters';
import { isDespesaAnterior } from '../utils/financeCalculations';
import { CategoryIcon } from './CategoryIcon';

interface TabDespesasAnterioresProps {
  transactions: Transaction[];
  categories: Category[];
  totalDespesasAnteriores: number;
  onSaveExpense: (expense: Omit<Transaction, 'id' | 'createdAt'>, editingId?: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TabDespesasAnteriores: React.FC<TabDespesasAnterioresProps> = ({
  transactions,
  categories,
  totalDespesasAnteriores,
  onSaveExpense,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  // Filtrar apenas despesas anteriores
  const despesasAnterioresList = transactions.filter((t) => isDespesaAnterior(t.source));

  // Estados do formulário superior (sem forma de pagamento e sem observação)
  const [descInput, setDescInput] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [dataInput, setDataInput] = useState(new Date().toISOString().split('T')[0]);
  const [catInput, setCatInput] = useState(categories[0]?.id || '');
  const [subcatInput, setSubcatInput] = useState(categories[0]?.subcategories[0]?.id || '');
  const [formError, setFormError] = useState('');
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  // Estados de busca e filtro na lista
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Atualizar subcategorias ao trocar categoria no form
  const handleCategoryChange = (categoryId: string) => {
    setCatInput(categoryId);
    const cat = categories.find((c) => c.id === categoryId);
    if (cat && cat.subcategories.length > 0) {
      setSubcatInput(cat.subcategories[0].id);
    } else {
      setSubcatInput('');
    }
  };

  // Submit do formulário superior
  const handleAddNovaDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const parsedAmount = parseFloat(valorInput.replace(',', '.'));
    if (!descInput.trim()) {
      setFormError('Por favor, informe a descrição da despesa.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Informe um valor monetário válido maior que zero.');
      return;
    }

    onSaveExpense({
      description: descInput.trim(),
      amount: parsedAmount,
      date: dataInput,
      categoryId: catInput,
      subcategoryId: subcatInput || undefined,
      source: 'despesas_anteriores',
    });

    // Limpar campos
    setDescInput('');
    setValorInput('');
    setShowSuccessNotice(true);
    setTimeout(() => setShowSuccessNotice(false), 3000);
  };

  // Filtragem da lista
  const filteredList = despesasAnterioresList
    .filter((tx) => {
      const matchSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'all' || tx.categoryId === filterCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

  const selectedCategoryObj = categories.find((c) => c.id === catInput);

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* PARTE SUPERIOR: Somatório Total das Despesas & Campo Adicionar */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
        {/* Somatório Total das Despesas Anteriores */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Despesas Anteriores
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 uppercase font-semibold">
                Somatório Total destas Despesas Anteriores
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-0.5">
                {formatBRL(totalDespesasAnteriores)}
              </h2>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-100">
            <span className="text-xs text-stone-500">Total acumulado:</span>
            <span className="text-sm sm:text-base font-bold text-stone-800">
              {despesasAnterioresList.length} despesa(s)
            </span>
          </div>
        </div>

        {/* Campo para Adicionar Nova Despesa (Na parte superior) */}
        <div className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
                Adicionar Nova Despesa Anterior
              </h3>
            </div>
            {showSuccessNotice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Adicionada com sucesso!
              </span>
            )}
          </div>

          {formError && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          <form onSubmit={handleAddNovaDespesa} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Descrição Completa */}
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Descrição do Gasto (Completa)
                </label>
                <input
                  type="text"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Ex: Cimento CP-II e areia lavada para contrapiso..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Valor */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Valor (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={valorInput}
                    onChange={(e) => setValorInput(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white text-stone-900 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Data */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Data do Gasto
                </label>
                <input
                  type="date"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Linha de Categoria, Subcategoria e Botão Adicionar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Categoria
                </label>
                <select
                  value={catInput}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Subcategoria (opcional)
                </label>
                <select
                  value={subcatInput}
                  onChange={(e) => setSubcatInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  disabled={!selectedCategoryObj || selectedCategoryObj.subcategories.length === 0}
                >
                  <option value="">Sem subcategoria</option>
                  {selectedCategoryObj?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Adicionar Gasto</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LISTA DAS DESPESAS ANTERIORES */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Despesas Anteriores Registradas
            </h3>
            <p className="text-xs text-stone-500">
              Listagem de todas as despesas lançadas nesta tela
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-[150px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar despesa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none"
            >
              <option value="all">Todas Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none"
            >
              <option value="date_desc">Mais recentes</option>
              <option value="date_asc">Mais antigas</option>
              <option value="amount_desc">Maior valor</option>
              <option value="amount_asc">Menor valor</option>
            </select>
          </div>
        </div>

        {/* Renderização da Lista - Design Limpo, Espaçoso e Sem Truncamento */}
        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-stone-400 rounded-2xl border-2 border-dashed border-stone-100">
            <Clock className="w-10 h-10 mx-auto stroke-1 text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-600">
              Nenhuma despesa anterior encontrada.
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Utilize o formulário no topo para registrar suas despesas anteriores.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((tx) => {
              const category = categories.find((c) => c.id === tx.categoryId);
              const subcategory = category?.subcategories.find((s) => s.id === tx.subcategoryId);
              const theme = getCategoryTheme(category?.color || 'amber');

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-300/80 transition-all shadow-2xs"
                >
                  {/* Linha principal: Ícone + Descrição completa + Valor e Ações */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${theme.bg} ${theme.text}`}
                      >
                        <CategoryIcon
                          iconName={category?.icon || 'Clock'}
                          className="w-5 h-5"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Descrição do gasto COMPLETA (sem truncar) */}
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug break-words">
                          {tx.description}
                        </h4>

                        {/* Detalhes: Categoria, Subcategoria e Data formatada */}
                        <div className="flex items-center gap-2 flex-wrap mt-2 text-xs">
                          <span className={`inline-flex items-center font-bold px-2.5 py-0.5 rounded-lg text-[11px] whitespace-nowrap ${theme.bg} ${theme.text}`}>
                            {category?.name || 'Sem categoria'}
                          </span>
                          {subcategory && (
                            <span className="text-stone-600 font-medium text-[11px] whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded-md">
                              {subcategory.name}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-stone-500 font-medium text-[11px] whitespace-nowrap">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {formatDateBR(tx.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lado direito: Valor destacado e Botões de Ação */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5 pl-2">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight whitespace-nowrap">
                        {formatBRL(tx.amount)}
                      </span>

                      <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                        Despesa Anterior
                      </span>

                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Despesa"
                          aria-label="Editar Despesa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Despesa"
                          aria-label="Excluir Despesa"
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
