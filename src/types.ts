export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  subcategories: SubCategory[];
  isCustom?: boolean;
}

export type ExpenseSource =
  | 'despesas_anteriores'
  | 'controle_caixa'
  | 'tab1_general' // Legado retrocompatível
  | 'tab2_budget'; // Legado retrocompatível

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO YYYY-MM-DD
  categoryId: string;
  subcategoryId?: string;
  source: ExpenseSource;
  notes?: string;
  paymentMethod?: string;
  createdAt: number;
}

export interface IncomeRecord {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO YYYY-MM-DD
  createdAt: number;
  addToObraBudget?: boolean;
}

export interface BudgetConfig {
  valorTotalPossuido: number;      // Valor total que possuo (capital total disponível)
  saldoObraPretendido: number;     // Valor que pretendo gastar na obra (orçamento da obra)
  incomes?: IncomeRecord[];        // Histórico de valores recebidos/aportados
  // Campos legados para retrocompatibilidade
  totalReceived?: number;
  maxSpendingLimit?: number;
  description?: string;
  lastUpdated?: string;
}

export interface ExpenseFilters {
  searchQuery: string;
  categoryId: string;
  subcategoryId: string;
  source: 'all' | ExpenseSource;
  startDate: string;
  endDate: string;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}
