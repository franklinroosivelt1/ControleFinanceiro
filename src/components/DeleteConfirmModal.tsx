import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Transaction } from '../types';
import { formatBRL } from '../utils/formatters';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Excluir este gasto?
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Esta ação removerá permanentemente o lançamento e atualizará todos os saldos e relatórios.
            </p>
          </div>
        </div>

        {/* Card do item a ser excluído */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Item a ser excluído
          </span>
          <p className="text-sm font-bold text-stone-900 break-words">
            {transaction.description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-500">
              Data: {transaction.date}
            </span>
            <span className="text-sm font-extrabold text-rose-600">
              {formatBRL(transaction.amount)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl border border-stone-300 text-stone-700 bg-white hover:bg-stone-100 active:scale-98 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            id="btn-confirm-delete-expense"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 active:scale-98 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
