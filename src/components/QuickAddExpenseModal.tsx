import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Category, ExpenseSource, Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryTheme, formatBRL } from '../utils/formatters';

interface QuickAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveExpense: (expense: Omit<Transaction, 'id' | 'createdAt'>, editingId?: string) => void;
  editingTransaction?: Transaction | null;
  defaultSource?: ExpenseSource;
  maxSpendingLimit?: number;
  currentTotalSpent?: number;
}

export const QuickAddExpenseModal: React.FC<QuickAddExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveExpense,
  editingTransaction,
  defaultSource = 'controle_caixa',
  maxSpendingLimit = 0,
  currentTotalSpent = 0,
}) => {
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [source, setSource] = useState<ExpenseSource>(defaultSource);
  const [error, setError] = useState('');

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Populate form if editing or when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setDescription(editingTransaction.description);
        setAmountStr(editingTransaction.amount.toString());
        setDate(editingTransaction.date);
        setSelectedCategoryId(editingTransaction.categoryId);
        setSelectedSubcategoryId(editingTransaction.subcategoryId || '');
        setSource(editingTransaction.source);
      } else {
        setDescription('');
        setAmountStr('');
        setDate(new Date().toISOString().split('T')[0]);
        setSelectedCategoryId(categories[0]?.id || '');
        setSelectedSubcategoryId(categories[0]?.subcategories[0]?.id || '');
        setSource(defaultSource);
      }
      setError('');

      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, editingTransaction, defaultSource, categories]);

  // Update available subcategories when category changes
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const subcategories = activeCategory?.subcategories || [];

  const handleCategorySelect = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategoryId(cat.subcategories[0].id);
    } else {
      setSelectedSubcategoryId('');
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amountStr.replace(',', '.')) || 0;
    const nextVal = current + addValue;
    setAmountStr(nextVal.toFixed(2));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const parsedAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      amountInputRef.current?.focus();
      return;
    }

    if (!description.trim()) {
      setError('Informe a descrição completa do gasto.');
      return;
    }

    if (!selectedCategoryId) {
      setError('Selecione uma categoria.');
      return;
    }

    onSaveExpense(
      {
        description: description.trim(),
        amount: parsedAmount,
        date,
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId || undefined,
        source,
      },
      editingTransaction ? editingTransaction.id : undefined
    );

    onClose();
  };

  if (!isOpen) return null;

  const currentAmountNum = parseFloat(amountStr.replace(',', '.')) || 0;
  const simulatedTotal = editingTransaction
    ? currentTotalSpent - editingTransaction.amount + currentAmountNum
    : currentTotalSpent + currentAmountNum;
  const wouldExceedBudget = maxSpendingLimit > 0 && simulatedTotal > maxSpendingLimit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {editingTransaction ? 'Editar Despesa' : 'Novo Lançamento'}
            </h3>
            <p className="text-xs text-stone-500">
              {editingTransaction
                ? 'Atualize os dados deste lançamento'
                : 'Adicione uma despesa rápida preenchendo os dados abaixo'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Campo Valor */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Valor da Despesa
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-stone-400">
                R$
              </span>
              <input
                ref={amountInputRef}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-xl font-black text-stone-900 bg-stone-50 border border-stone-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Quick add increment buttons */}
            <div className="flex gap-1.5 mt-2">
              {[50, 100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Campo Descrição Completa */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Descrição do Gasto (Completa)
            </label>
            <input
              type="text"
              placeholder="Ex: Cimento CP-II e areia lavada para contrapiso da sala..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          {/* Categorias pré-definidas */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                const theme = getCategoryTheme(cat.color);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${theme.bg}`}>
                      <CategoryIcon iconName={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategorias */}
          {subcategories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Subcategoria (Especifique o detalhe)
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategoryId('')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    !selectedSubcategoryId
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Geral
                </button>
                {subcategories.map((sub) => {
                  const isSelected = sub.id === selectedSubcategoryId;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategoryId(sub.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Destino da Despesa (Despesas Anteriores vs Controle de Caixa) */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              Vincular a qual tela / finalidade?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSource('despesas_anteriores')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  source === 'despesas_anteriores' || source === 'tab1_general'
                    ? 'border-amber-500 bg-amber-50/90 text-amber-950 font-bold shadow-xs ring-1 ring-amber-400'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Despesas Anteriores</span>
                </div>
                <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                  Gastos que já tive anteriormente
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSource('controle_caixa')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  source === 'controle_caixa' || source === 'tab2_budget'
                    ? 'border-sky-500 bg-sky-50/90 text-sky-950 font-bold shadow-xs ring-1 ring-sky-400'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Despesas Atuais</span>
                </div>
                <span className="text-[10px] text-stone-500 font-normal block mt-0.5">
                  Subtrai dos 2 saldos simultaneamente
                </span>
              </button>
            </div>
          </div>

          {/* Data do Gasto */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Data do Gasto
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Alerta prévio de orçamento se for exceder */}
          {wouldExceedBudget && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong>Aviso de Limite:</strong> Este gasto fará o total atingir{' '}
                <span className="font-bold">{formatBRL(simulatedTotal)}</span>, ultrapassando a meta de {formatBRL(maxSpendingLimit)}.
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-submit-expense"
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingTransaction ? 'Salvar Alterações' : 'Salvar Gasto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
