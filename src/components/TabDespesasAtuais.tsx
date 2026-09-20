import React, { useState } from 'react';
import {
  Hammer,
  Wallet,
  TrendingDown,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { Category, Transaction } from '../types';
import { formatBRL, formatDateBR, getCategoryTheme } from '../utils/formatters';
import { FinanceSummary, isControleCaixa } from '../utils/financeCalculations';
import { CategoryIcon } from './CategoryIcon';

interface TabDespesasAtuaisProps {
  summary: FinanceSummary;
  transactions: Transaction[];
  categories: Category[];
  onSaveExpense: (expense: Omit<Transaction, 'id' | 'createdAt'>, editingId?: string) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TabDespesasAtuais: React.FC<TabDespesasAtuaisProps> = ({
  summary,
  transactions,
  categories,
  onSaveExpense,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  // Filtrar apenas despesas atuais da obra
  const despesasAtuaisList = transactions.filter((t) => isControleCaixa(t.source));

  // Estados do formulário superior (sem forma de pagamento e sem observação)
  const [descInput, setDescInput] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [dataInput, setDataInput] = useState(new Date().toISOString().split('T')[0]);
  const [catInput, setCatInput] = useState(categories[0]?.id || '');
  const [subcatInput, setSubcatInput] = useState(categories[0]?.subcategories[0]?.id || '');
  const [formError, setFormError] = useState('');
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  // Estados de busca e filtros da lista
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  const handleCategoryChange = (categoryId: string) => {
    setCatInput(categoryId);
    const cat = categories.find((c) => c.id === categoryId);
    if (cat && cat.subcategories.length > 0) {
      setSubcatInput(cat.subcategories[0].id);
    } else {
      setSubcatInput('');
    }
  };

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(valorInput.replace(',', '.')) || 0;
    setValorInput((current + val).toFixed(2));
  };

  const handleAddDespesaAtual = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const parsedAmount = parseFloat(valorInput.replace(',', '.'));
    if (!descInput.trim()) {
      setFormError('Por favor, informe a descrição completa da despesa.');
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
      source: 'controle_caixa',
    });

    setDescInput('');
    setValorInput('');
    setShowSuccessNotice(true);
    setTimeout(() => setShowSuccessNotice(false), 3000);
  };

  const filteredList = despesasAtuaisList
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
      {/* PARTE SUPERIOR: Saldos e Total das Despesas Atuais            */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                Tela: Despesas Atuais
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                ✓ Subtração simultânea ativa
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Despesas Atuais da Obra
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Cada gasto cadastrado aqui é subtraído automaticamente do <strong>Valor Total Disponível em Conta</strong> e do <strong>Saldo Disponível para a Obra</strong>.
            </p>
          </div>
        </div>

        {/* 3 Valores exibidos na parte superior desta tela */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Valor Total Disponível em Conta */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Valor Total Disponível em Conta
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-200/80 text-emerald-900 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-2xl font-extrabold mt-2 ${
              summary.valorTotalDisponivel < 0 ? 'text-rose-600' : 'text-stone-900'
            }`}>
              {formatBRL(summary.valorTotalDisponivel)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              Capital total inicial: {formatBRL(summary.valorTotalPossuidoInicial)}
            </p>
          </div>

          {/* 2. Saldo Disponível para a Obra */}
          <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900">
                Saldo Disponível para a Obra
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-200/80 text-sky-900 flex items-center justify-center">
                <Hammer className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-2xl font-extrabold mt-2 ${
              summary.saldoDisponivelObra < 0 ? 'text-rose-600' : 'text-stone-900'
            }`}>
              {formatBRL(summary.saldoDisponivelObra)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              Teto pretendido da obra: {formatBRL(summary.saldoObraPretendidoInicial)}
            </p>
          </div>

          {/* 3. Total de Despesas Atuais da Obra */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Total de Despesas Atuais
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mt-2">
              {formatBRL(summary.totalGastosProgramados)}
            </h3>
            <p className="text-[11px] text-stone-400 mt-1">
              {summary.percentualObraConsumido}% do teto da obra consumido
            </p>
          </div>
        </div>

        {summary.isObraEstourada && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              Atenção: O total de despesas atuais ultrapassou o teto pretendido para a obra em {formatBRL(Math.abs(summary.saldoDisponivelObra))}.
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* FORMULÁRIO: Adicionar Nova Despesa Atual                      */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Adicionar Nova Despesa Atual
              </h3>
              <p className="text-xs text-stone-500">
                Subtrai simultaneamente do Valor Total Disponível em Conta e do Saldo da Obra
              </p>
            </div>
          </div>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {showSuccessNotice && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Despesa atual adicionada com sucesso e subtraída dos dois saldos!</span>
          </div>
        )}

        <form onSubmit={handleAddDespesaAtual} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Descrição Completa */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Descrição Completa do Gasto *
              </label>
              <input
                type="text"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="Ex: Cimento CP II 50kg, Pagamento Pedreiro Etapa 1..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            {/* Valor */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Valor do Gasto (R$) *
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Data */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Data do Gasto *
              </label>
              <input
                type="date"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Atalhos de valor rápido */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 font-medium">Somar rápido:</span>
            {[50, 100, 200, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleAddQuickAmount(v)}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold cursor-pointer transition-colors"
              >
                +{v}
              </button>
            ))}
          </div>

          {/* Categoria e Subcategoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={catInput}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Subcategoria (Opcional)
              </label>
              <select
                value={subcatInput}
                onChange={(e) => setSubcatInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={!selectedCategoryObj || selectedCategoryObj.subcategories.length === 0}
              >
                <option value="">Nenhuma subcategoria</option>
                {selectedCategoryObj?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Salvar Despesa Atual
            </button>
          </div>
        </form>
      </div>

      {/* ============================================================ */}
      {/* LISTAGEM: Despesas Atuais da Obra Cadastradas                 */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Lista de Despesas Atuais da Obra
            </h3>
            <p className="text-xs text-stone-500">
              Total de <strong>{despesasAtuaisList.length}</strong> despesas cadastradas • Total gasto: <strong>{formatBRL(summary.totalGastosProgramados)}</strong>
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por descrição..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none"
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
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none"
            >
              <option value="date_desc">Mais Recentes</option>
              <option value="date_asc">Mais Antigos</option>
              <option value="amount_desc">Maior Valor</option>
              <option value="amount_asc">Menor Valor</option>
            </select>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 mx-auto flex items-center justify-center mb-2">
              <Hammer className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-stone-800">
              Nenhuma despesa atual encontrada
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Use o formulário acima para registrar um novo gasto da obra.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const theme = getCategoryTheme(cat?.color || 'sky');
              const sub = cat?.subcategories.find((s) => s.id === tx.subcategoryId);

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${theme.bg}`}>
                        <CategoryIcon iconName={cat?.icon || 'Hammer'} className="w-5 h-5 text-sky-800" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Descrição Completa */}
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug break-words">
                          {tx.description}
                        </h4>

                        {/* Metadados: Categoria, Subcategoria e Data formatada */}
                        <div className="flex items-center gap-2 flex-wrap mt-2 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] whitespace-nowrap ${theme.badge}`}>
                            {cat?.name || 'Geral'}
                          </span>
                          {sub && (
                            <span className="text-stone-600 font-medium text-[11px] whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded-md">
                              {sub.name}
                            </span>
                          )}
                          <span className="text-stone-500 font-medium text-[11px] whitespace-nowrap flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateBR(tx.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Valor e Ações */}
                    <div className="text-right shrink-0 flex flex-col items-end gap-1 pl-2">
                      <span className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight whitespace-nowrap">
                        - {formatBRL(tx.amount)}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/60 whitespace-nowrap">
                        Despesa Atual
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold whitespace-nowrap">
                        - Subtraído dos 2 saldos
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
