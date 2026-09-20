import React from 'react';
import { AlertTriangle, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { formatBRL } from '../utils/formatters';

interface AlertBannerProps {
  totalSpent: number;
  maxSpendingLimit: number;
  totalReceived: number;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  totalSpent,
  maxSpendingLimit,
  totalReceived,
}) => {
  if (maxSpendingLimit <= 0) return null;

  const isExceeded = totalSpent > maxSpendingLimit;
  const difference = Math.abs(totalSpent - maxSpendingLimit);
  const percentage = Math.round((totalSpent / maxSpendingLimit) * 100);
  const isNearLimit = !isExceeded && percentage >= 85;

  if (!isExceeded && !isNearLimit) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-semibold">Orçamento sob controle</p>
            <p className="text-xs text-emerald-700">
              Você utilizou {percentage}% da sua meta máxima ({formatBRL(totalSpent)} de {formatBRL(maxSpendingLimit)}).
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-white rounded-full border border-emerald-200 text-emerald-800">
          Margem: {formatBRL(maxSpendingLimit - totalSpent)}
        </span>
      </div>
    );
  }

  if (isExceeded) {
    return (
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Alerta Crítico
              </span>
              <h3 className="text-base font-bold text-rose-950">
                Meta Máxima de Gastos Excedida!
              </h3>
            </div>
            <p className="text-sm text-rose-800 mt-1">
              Os gastos atingiram <strong>{percentage}%</strong> do limite planejado. O valor ultrapassou a meta em{' '}
              <span className="font-bold underline text-rose-950">{formatBRL(difference)}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <div className="text-right">
            <div className="text-xs text-rose-700">Excedente</div>
            <div className="text-lg font-extrabold text-rose-700">+{formatBRL(difference)}</div>
          </div>
        </div>
      </div>
    );
  }

  // isNearLimit (>=85% and <=100%)
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-amber-950">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              Atenção
            </span>
            <h3 className="text-sm font-bold text-amber-950">
              Próximo do Limite Orçado ({percentage}%)
            </h3>
          </div>
          <p className="text-xs text-amber-800 mt-0.5">
            Restam apenas <strong>{formatBRL(difference)}</strong> antes de atingir a meta estipulada de {formatBRL(maxSpendingLimit)}.
          </p>
        </div>
      </div>
    </div>
  );
};
