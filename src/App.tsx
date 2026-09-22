import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Category, Transaction, BudgetConfig, ExpenseSource } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_BUDGET_CONFIG, INITIAL_TRANSACTIONS } from './data/initialData';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { TabNavigation, ActiveTab } from './components/TabNavigation';
import { TabHome } from './components/TabHome';
import { TabDespesasAnteriores } from './components/TabDespesasAnteriores';
import { TabDespesasAtuais } from './components/TabDespesasAtuais';
import { TabControleCaixa } from './components/TabControleCaixa';
import { TabTransactionsHistory } from './components/TabTransactionsHistory';
import { QuickAddExpenseModal } from './components/QuickAddExpenseModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { BackupModal } from './components/BackupModal';
import { calculateFinanceSummary } from './utils/financeCalculations';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions_v2',
  CATEGORIES: 'finance_categories_v2',
  BUDGET: 'finance_budget_config_v2',
};

export default function App() {
  // Persistence state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
      // Checar se há dados legados do v1
      const legacy = localStorage.getItem('finance_transactions_v1');
      return legacy ? JSON.parse(legacy) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('finance_categories_v1');
      return legacy ? JSON.parse(legacy) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('finance_budget_config_v1');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return {
          ...DEFAULT_BUDGET_CONFIG,
          valorTotalPossuido: parsed.totalReceived ?? DEFAULT_BUDGET_CONFIG.valorTotalPossuido,
          saldoObraPretendido: parsed.maxSpendingLimit ?? DEFAULT_BUDGET_CONFIG.saldoObraPretendido,
        };
      }
      return DEFAULT_BUDGET_CONFIG;
    } catch {
      return DEFAULT_BUDGET_CONFIG;
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [quickAddSource, setQuickAddSource] = useState<ExpenseSource>('controle_caixa');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetConfig));
    } catch (e) {
      console.error('Failed to save budgetConfig to localStorage', e);
    }
  }, [budgetConfig]);

  // Derived Calculations
  const summary = calculateFinanceSummary(budgetConfig, transactions);

  // Handlers
  const handleOpenAddExpense = (source?: ExpenseSource) => {
    setEditingTransaction(null);
    if (source) {
      setQuickAddSource(source);
    } else if (activeTab === 'despesas_anteriores') {
      setQuickAddSource('despesas_anteriores');
    } else {
      setQuickAddSource('controle_caixa');
    }
    setIsAddExpenseOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setQuickAddSource(tx.source);
    setIsAddExpenseOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      setTransactionToDelete(tx);
    }
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      setTransactions((prev) => prev.filter((t) => t.id !== transactionToDelete.id));
      setTransactionToDelete(null);
    }
  };

  const handleSaveExpense = (
    expenseData: Omit<Transaction, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, ...expenseData }
            : t
        )
      );
    } else {
      const newTransaction: Transaction = {
        ...expenseData,
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  const handleResetToDemo = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setBudgetConfig(DEFAULT_BUDGET_CONFIG);
  };

  const handleClearAll = () => {
    setTransactions([]);
    setBudgetConfig({
      valorTotalPossuido: 0,
      saldoObraPretendido: 0,
      totalReceived: 0,
      maxSpendingLimit: 0,
      description: '',
    });
  };

  const handleRestoreData = (data: {
    transactions: Transaction[];
    categories: Category[];
    budgetConfig: BudgetConfig;
  }) => {
    setTransactions(data.transactions);
    setCategories(data.categories);
    setBudgetConfig(data.budgetConfig);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 pb-24">
      {/* Global Header */}
      <Header
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sistema de Alerta quando os Gastos Programados atingem ou excedem a meta da obra */}
        <AlertBanner
          totalSpent={summary.totalGastosProgramados}
          maxSpendingLimit={summary.saldoObraPretendidoInicial}
          totalReceived={summary.valorTotalPossuidoInicial}
        />

        {/* Navegação estilo Cards Retangulares */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-stone-200/80 shadow-xs">
          <TabNavigation
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            totalDespesasAnteriores={summary.totalDespesasAnteriores}
            totalDespesasAtuais={summary.totalDespesasAtuais}
            totalGeralDespesas={summary.totalGeralDespesas}
            totalCount={transactions.length}
          />

          {/* Telas Correspondentes */}
          <div className="mt-6">
            {/* Tela Inicial: Balão orçamento sob controle, 5 balões simples e botões cards */}
            {activeTab === 'home' && (
              <TabHome
                summary={summary}
                budgetConfig={budgetConfig}
                onUpdateBudgetConfig={setBudgetConfig}
                categories={categories}
                recentTransactions={transactions}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onOpenAddExpense={(src) => handleOpenAddExpense(src)}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {/* Tela: Despesas Anteriores */}
            {activeTab === 'despesas_anteriores' && (
              <TabDespesasAnteriores
                transactions={transactions}
                categories={categories}
                totalDespesasAnteriores={summary.totalDespesasAnteriores}
                onSaveExpense={handleSaveExpense}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {/* Tela: Despesas Atuais */}
            {activeTab === 'despesas_atuais' && (
              <TabDespesasAtuais
                summary={summary}
                transactions={transactions}
                categories={categories}
                onSaveExpense={handleSaveExpense}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {/* Tela: Controle de Caixa (mostra o resumo geral de saldos disponíveis, total gasto das Despesas Anteriores, Despesas Atuais e Geral) */}
            {activeTab === 'controle_caixa' && (
              <TabControleCaixa
                summary={summary}
                transactions={transactions}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onOpenAddExpense={(src) => handleOpenAddExpense(src)}
              />
            )}

            {/* Tela: Histórico de Gastos inseridos pelo usuário */}
            {activeTab === 'history' && (
              <TabTransactionsHistory
                transactions={transactions}
                categories={categories}
                onOpenAddExpense={() => handleOpenAddExpense()}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for ultra-fast mobile entry */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          id="btn-fab-add-expense"
          type="button"
          onClick={() => handleOpenAddExpense()}
          className="w-14 h-14 rounded-full bg-emerald-500 text-stone-950 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title="Adicionar Despesa Rapidamente"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* Quick Add Expense Modal */}
      <QuickAddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setEditingTransaction(null);
        }}
        categories={categories}
        onSaveExpense={handleSaveExpense}
        editingTransaction={editingTransaction}
        defaultSource={quickAddSource}
        maxSpendingLimit={summary.saldoObraPretendidoInicial}
        currentTotalSpent={summary.totalGastosProgramados}
      />

      {/* Delete Confirmation Modal (solução in-app que nunca falha em iframes/mobile) */}
      <DeleteConfirmModal
        isOpen={!!transactionToDelete}
        transaction={transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        onUpdateCategories={setCategories}
      />

      {/* Backup & Data Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        transactions={transactions}
        categories={categories}
        budgetConfig={budgetConfig}
        onRestoreData={handleRestoreData}
        onResetToDemo={handleResetToDemo}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
