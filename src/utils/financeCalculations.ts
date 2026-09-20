import { BudgetConfig, ExpenseSource, Transaction } from '../types';

export function isDespesaAnterior(source: ExpenseSource): boolean {
  return source === 'despesas_anteriores' || source === 'tab1_general';
}

export function isControleCaixa(source: ExpenseSource): boolean {
  return source === 'controle_caixa' || source === 'tab2_budget';
}

export interface FinanceSummary {
  // Valores inseridos pelo usuário
  valorTotalPossuidoInicial: number;
  saldoObraPretendidoInicial: number;

  // Totais acumulados
  totalGastosProgramados: number;     // despesas do controle de caixa / atuais
  totalDespesasAtuais: number;        // alias para totalGastosProgramados
  totalDespesasAnteriores: number;    // despesas anteriores
  totalGeralDespesas: number;         // somatório de todos os gastos (anteriores + atuais)

  // Valores subtraídos simultaneamente
  valorTotalDisponivel: number;       // valorTotalPossuidoInicial - totalGastosProgramados
  valorTotalDisponivelEmConta: number;// alias para valorTotalDisponivel
  saldoDisponivelObra: number;        // saldoObraPretendidoInicial - totalGastosProgramados

  // Métricas auxiliares
  percentualObraConsumido: number;
  isObraEstourada: boolean;
  isCapitalNegativo: boolean;
}

export function calculateFinanceSummary(
  budgetConfig: BudgetConfig,
  transactions: Transaction[]
): FinanceSummary {
  const valorTotalPossuidoInicial =
    typeof budgetConfig.valorTotalPossuido === 'number'
      ? budgetConfig.valorTotalPossuido
      : budgetConfig.totalReceived ?? 0;

  const saldoObraPretendidoInicial =
    typeof budgetConfig.saldoObraPretendido === 'number'
      ? budgetConfig.saldoObraPretendido
      : budgetConfig.maxSpendingLimit ?? 0;

  const totalGastosProgramados = transactions
    .filter((t) => isControleCaixa(t.source))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesasAnteriores = transactions
    .filter((t) => isDespesaAnterior(t.source))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGeralDespesas = totalDespesasAnteriores + totalGastosProgramados;

  // Subtraídos simultaneamente do Valor Total Disponível e do Saldo Disponível para a Obra
  const valorTotalDisponivel = valorTotalPossuidoInicial - totalGastosProgramados;
  const saldoDisponivelObra = saldoObraPretendidoInicial - totalGastosProgramados;

  const percentualObraConsumido =
    saldoObraPretendidoInicial > 0
      ? Math.round((totalGastosProgramados / saldoObraPretendidoInicial) * 100)
      : 0;

  return {
    valorTotalPossuidoInicial,
    saldoObraPretendidoInicial,
    totalGastosProgramados,
    totalDespesasAtuais: totalGastosProgramados,
    totalDespesasAnteriores,
    totalGeralDespesas,
    valorTotalDisponivel,
    valorTotalDisponivelEmConta: valorTotalDisponivel,
    saldoDisponivelObra,
    percentualObraConsumido,
    isObraEstourada: saldoDisponivelObra < 0,
    isCapitalNegativo: valorTotalDisponivel < 0,
  };
}
