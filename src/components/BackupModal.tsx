import React, { useRef } from 'react';
import { X, Download, Upload, RotateCcw, AlertTriangle, FileCheck } from 'lucide-react';
import { Category, BudgetConfig, Transaction } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  budgetConfig: BudgetConfig;
  onRestoreData: (data: { transactions: Transaction[]; categories: Category[]; budgetConfig: BudgetConfig }) => void;
  onResetToDemo: () => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
  budgetConfig,
  onRestoreData,
  onResetToDemo,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      budgetConfig,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_financeiro_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.transactions && parsed.categories && parsed.budgetConfig) {
          onRestoreData({
            transactions: parsed.transactions,
            categories: parsed.categories,
            budgetConfig: parsed.budgetConfig,
          });
          alert('Backup restaurado com sucesso!');
          onClose();
        } else {
          alert('Arquivo de backup inválido. Não contém as chaves esperadas.');
        }
      } catch (err) {
        alert('Erro ao processar o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Backup & Exportação
              </h3>
              <p className="text-xs text-stone-500">
                Mantenha seus dados seguros e exporte relatórios
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Exportar Arquivo de Backup
            </h4>
            <p className="text-xs text-stone-600">
              Faça o download de todos os seus gastos, categorias customizadas e configurações para guardar ou transferir.
            </p>
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Baixar Backup Completo (.JSON)</span>
            </button>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Restaurar de Backup
            </h4>
            <p className="text-xs text-stone-600">
              Envie um arquivo .JSON exportado anteriormente para recuperar seus lançamentos.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 text-stone-600" />
              <span>Carregar Arquivo de Backup</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                if (confirm('Restaurar dados de demonstração iniciais? Seus dados atuais serão substituídos.')) {
                  onResetToDemo();
                  onClose();
                }
              }}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Exemplo Inicial</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Atenção: deseja realmente limpar todos os gastos e começar do zero?')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
