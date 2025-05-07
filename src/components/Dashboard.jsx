
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Dashboard = ({ transactions, receivables, payables }) => {
  // Recalcular os totais sempre que as transações, valores recebidos ou pagos mudarem
  const { income, expenses, balance } = React.useMemo(() => {
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

    // Saldo total
    const totalBalance = totalIncome - totalExpenses;

    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalBalance
    };
  }, [transactions, receivables, payables]);

  const cards = [
    {
      title: 'Saldo',
      value: balance,
      icon: Wallet,
      bgColor: balance >= 0 
        ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50' 
        : 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50',
      textColor: balance >= 0 
        ? 'text-blue-700 dark:text-blue-300' 
        : 'text-orange-700 dark:text-orange-300',
      iconColor: balance >= 0 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Receitas',
      value: income,
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/50',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Despesas',
      value: expenses,
      icon: TrendingDown,
      bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/50 dark:to-rose-800/50',
      textColor: 'text-rose-700 dark:text-rose-300',
      iconColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} p-4 sm:p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className={`text-base sm:text-lg font-semibold ${card.textColor}`}>{card.title}</h2>
            <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`} />
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${card.textColor}`}>
            {formatCurrency(card.value)}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Dashboard;
