import React from 'react';
import { Wallet, Settings2, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenCategories: () => void;
  onOpenBackup: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCategories,
  onOpenBackup,
  onResetData,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900 leading-tight">
                Controle Financeiro
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                Obras & Orçamento
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Acompanhamento de gastos, metas e fluxo financeiro em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-manage-categories"
            type="button"
            onClick={onOpenCategories}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Editar ou criar categorias e subcategorias"
          >
            <Settings2 className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">Categorias</span>
          </button>

          <button
            id="btn-backup-data"
            type="button"
            onClick={onOpenBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Exportar ou importar dados"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">Exportar / Backup</span>
          </button>

          <button
            id="btn-reset-demo"
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Restaurar dados de exemplo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
