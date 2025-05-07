
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CompanyRanking = ({ transactions, companies }) => {
  // Calcular totais por empresa
  const companyTotals = React.useMemo(() => {
    const totals = {};
    
    // Inicializar totais para todas as empresas
    companies.forEach(company => {
      totals[company.id] = {
        id: company.id,
        name: company.name,
        income: 0,
        expenses: 0,
        balance: 0
      };
    });

    // Calcular totais
    transactions.forEach(transaction => {
      if (!transaction.company_id) return;
      
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        totals[transaction.company_id].income += amount;
        totals[transaction.company_id].balance += amount;
      } else {
        totals[transaction.company_id].expenses += amount;
        totals[transaction.company_id].balance -= amount;
      }
    });

    return Object.values(totals).filter(company => 
      company.income > 0 || company.expenses > 0
    );
  }, [transactions, companies]);

  // Ordenar empresas por receita e despesa
  const topIncome = [...companyTotals]
    .sort((a, b) => b.income - a.income)
    .slice(0, 5);

  const topExpenses = [...companyTotals]
    .sort((a, b) => b.expenses - a.expenses)
    .slice(0, 5);

  const CompanyList = ({ companies, type }) => (
    <div className="space-y-3">
      {companies.map((company, index) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border ${
            type === 'income'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">{index + 1}.</span>
              <span className="font-medium">{company.name}</span>
            </div>
            <span className={`font-bold ${
              type === 'income'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatCurrency(type === 'income' ? company.income : company.expenses)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Saldo: {formatCurrency(company.balance)}
          </div>
        </motion.div>
      ))}
      {companies.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Nenhum registro encontrado
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Top 5 - Maiores Receitas
          </h2>
        </div>
        <CompanyList companies={topIncome} type="income" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Top 5 - Maiores Despesas
          </h2>
        </div>
        <CompanyList companies={topExpenses} type="expense" />
      </div>
    </div>
  );
};

export default CompanyRanking;
