
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import FixedExpenseForm from './FixedExpenseForm';
import FixedExpenseList from './FixedExpenseList';

const WorkingCapital = ({ 
  transactions = [], 
  receivables = [], 
  payables = [],
  fixedExpenses = [],
  onAddFixedExpense = () => {},
  onDeleteFixedExpense = () => {},
  onEditFixedExpense = () => {},
  onToggleFixedExpense = () => {}
}) => {
  const calculateTotals = React.useMemo(() => {
    // Receitas das transações
    const transactionIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Valores recebidos
    const receivedAmount = receivables
      .filter(r => r.status === 'received')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Total de receitas
    const totalIncome = transactionIncome + receivedAmount;

    // Despesas das transações
    const transactionExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Valores pagos
    const paidAmount = payables
      .filter(p => p.status === 'paid')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Total de despesas
    const totalExpenses = transactionExpenses + paidAmount;

    // Total de valores a receber (pendentes, parciais e programados)
    const totalReceivables = receivables
      .filter(r => ['pending', 'partial', 'scheduled'].includes(r.status))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Total de valores a pagar (pendentes, parciais e programados)
    const totalPayables = payables
      .filter(p => ['pending', 'partial', 'scheduled'].includes(p.status))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Total de despesas fixas ativas
    const totalFixedExpenses = fixedExpenses
      .filter(expense => expense.is_active)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      totalReceivables,
      totalPayables,
      totalFixedExpenses
    };
  }, [transactions, receivables, payables, fixedExpenses]);

  const cards = [
    {
      title: 'Receitas',
      value: calculateTotals.totalIncome,
      icon: ArrowUpCircle,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/50',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Despesas',
      value: calculateTotals.totalExpenses,
      icon: ArrowDownCircle,
      bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/50 dark:to-rose-800/50',
      textColor: 'text-rose-700 dark:text-rose-300',
      iconColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  const pendingCards = [
    {
      title: 'Valores a Receber',
      value: calculateTotals.totalReceivables,
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/50 dark:to-amber-800/50',
      textColor: 'text-amber-700 dark:text-amber-300',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Valores a Pagar',
      value: calculateTotals.totalPayables,
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50',
      textColor: 'text-purple-700 dark:text-purple-300',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${card.textColor}`}>{card.title}</h2>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {formatCurrency(card.value)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 2) * 0.1 }}
            className={`${card.bgColor} p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${card.textColor}`}>{card.title}</h2>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {formatCurrency(card.value)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Nova Despesa Fixa
          </h2>
          <FixedExpenseForm onAddExpense={onAddFixedExpense} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Lista de Despesas Fixas
          </h2>
          <FixedExpenseList 
            expenses={fixedExpenses}
            onDeleteExpense={onDeleteFixedExpense}
            onEditExpense={onEditFixedExpense}
            onToggleActive={onToggleFixedExpense}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Informações sobre Capital de Giro
        </h3>
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p>• As receitas incluem todas as transações de entrada e valores já recebidos.</p>
          <p>• As despesas incluem todas as transações de saída e valores já pagos.</p>
          <p>• Os valores a receber e a pagar consideram os status "pendente", "parcial" e "programado".</p>
          <p>• O total de despesas fixas é calculado apenas com as despesas ativas.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkingCapital;
