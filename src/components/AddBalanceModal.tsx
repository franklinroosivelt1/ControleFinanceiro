import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  PlusCircle,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { BudgetConfig, IncomeRecord } from '../types';
import { formatBRL } from '../utils/formatters';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetConfig: BudgetConfig;
  currentAvailableAccount: number;
  currentAvailableObra: number;
  onAddIncome: (income: Omit<IncomeRecord, 'id' | 'createdAt'>) => void;
  onDeleteIncome?: (incomeId: string) => void;
}

export const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
  budgetConfig,
  currentAvailableAccount,
  currentAvailableObra,
  onAddIncome,
  onDeleteIncome,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [addToObraBudget, setAddToObraBudget] = useState(false);
  const [error, setError] = useState('');

  const inputAmountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmountStr('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setAddToObraBudget(false);
      setError('');
      setActiveTab('add');
      setTimeout(() => {
        inputAmountRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const parsedAmount = Math.max(0, parseFloat(amountStr.replace(',', '.')) || 0);
  const projectedAvailableAccount = currentAvailableAccount + parsedAmount;
  const projectedAvailableObra = addToObraBudget
    ? currentAvailableObra + parsedAmount
    : currentAvailableObra;

  const handleQuickAdd = (valueToAdd: number) => {
    const current = parseFloat(amountStr.replace(',', '.')) || 0;
    const nextVal = current + valueToAdd;
    setAmountStr(nextVal.toFixed(2));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) {
      setError('Por favor, informe um valor maior que zero.');
      return;
    }

    onAddIncome({
      amount: parsedAmount,
      description: description.trim() || 'Recebimento de Saldo em Conta',
      date: date || new Date().toISOString().split('T')[0],
      addToObraBudget,
    });

    onClose();
  };

  const incomesList = budgetConfig.incomes || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 leading-tight">
                Adicionar Saldo em Conta
              </h3>
              <p className="text-xs text-stone-500">
                Lançar recebimentos, aportes e entradas financeiras
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-abas: Novo Recebimento vs Histórico */}
        <div className="flex border-b border-stone-200 px-5 bg-stone-50/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'add'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Novo Recebimento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              Histórico de Recebimentos
              {incomesList.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                  {incomesList.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'add' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Valor */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-1.5">
                  Valor do Recebimento (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-emerald-700 text-lg">
                    R$
                  </span>
                  <input
                    ref={inputAmountRef}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={amountStr}
                    onChange={(e) => {
                      setAmountStr(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 outline-none text-2xl font-black text-stone-900 bg-white shadow-2xs"
                    required
                  />
                </div>

                {/* Botões rápidos de acréscimo */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-stone-400 self-center mr-1">
                    Atalhos:
                  </span>
                  {[500, 1000, 2000, 5000, 10000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAdd(val)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-colors cursor-pointer"
                    >
                      + {formatBRL(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data e Descrição */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Data do Recebimento</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>Origem / Descrição</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Aporte, Venda, Salário..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Opção para também adicionar ao orçamento da obra */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToObraBudget}
                    onChange={(e) => setAddToObraBudget(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-800">
                      Adicionar também ao Saldo Disponível para a Obra
                    </span>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                      Se selecionado, este valor também ampliará o teto orçamentário pretendido da obra além da conta geral.
                    </p>
                  </div>
                </label>
              </div>

              {/* Demonstração do Impacto no Saldo */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                  Simulação do Saldo Após Adição
                </span>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Disponível em Conta Atual:</span>
                  <span className="font-bold text-stone-800">
                    {formatBRL(currentAvailableAccount)}
                  </span>
                </div>

                {parsedAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                    <span>+ Valor a Adicionar:</span>
                    <span>+ {formatBRL(parsedAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-stone-900">
                    Novo Disponível em Conta:
                  </span>
                  <span className="font-black text-base text-emerald-700">
                    {formatBRL(projectedAvailableAccount)}
                  </span>
                </div>

                {addToObraBudget && parsedAmount > 0 && (
                  <div className="pt-1.5 border-t border-emerald-200/50 flex items-center justify-between text-xs text-sky-800">
                    <span className="font-semibold">Novo Saldo p/ Obra:</span>
                    <span className="font-bold">{formatBRL(projectedAvailableObra)}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar e Adicionar Saldo</span>
                </button>
              </div>
            </form>
          ) : (
            /* Histórico de Recebimentos */
            <div className="space-y-3">
              {incomesList.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-700">
                    Nenhum recebimento adicional registrado ainda
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Os valores adicionados através do botão "Adicionar Saldo" ficarão listados aqui para conferência.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add')}
                    className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Adicionar meu primeiro recebimento agora
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                    <span>Recebimentos cadastrados</span>
                    <span>
                      Total adicionado:{' '}
                      <strong className="text-emerald-700">
                        {formatBRL(incomesList.reduce((acc, curr) => acc + curr.amount, 0))}
                      </strong>
                    </span>
                  </div>

                  {incomesList.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-2xs hover:border-emerald-200 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">
                            {inc.description}
                          </span>
                          {inc.addToObraBudget && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                              + Obra
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {inc.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-emerald-700">
                          + {formatBRL(inc.amount)}
                        </span>
                        {onDeleteIncome && (
                          <button
                            type="button"
                            onClick={() => onDeleteIncome(inc.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remover este recebimento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
