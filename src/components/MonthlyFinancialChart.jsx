
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const MonthlyFinancialChart = ({ transactions, receivables, payables }) => {
  const monthlyData = React.useMemo(() => {
    const data = {};
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    // Inicializar os últimos 6 meses
    for (let d = new Date(sixMonthsAgo); d <= currentDate; d.setMonth(d.getMonth() + 1)) {
      const monthKey = d.toISOString().substring(0, 7); // YYYY-MM format
      data[monthKey] = {
        month: new Date(d).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        receitas: 0,
        despesas: 0,
        receber: 0,
        pagar: 0
      };
    }

    // Processar transações
    transactions.forEach(transaction => {
      const monthKey = transaction.date.substring(0, 7);
      if (data[monthKey]) {
        if (transaction.type === 'income') {
          data[monthKey].receitas += Number(transaction.amount);
        } else {
          data[monthKey].despesas += Number(transaction.amount);
        }
      }
    });

    // Processar valores a receber
    receivables.forEach(receivable => {
      const monthKey = receivable.due_date.substring(0, 7);
      if (data[monthKey] && receivable.status !== 'received') {
        data[monthKey].receber += Number(receivable.amount);
      }
    });

    // Processar valores a pagar
    payables.forEach(payable => {
      const monthKey = payable.due_date.substring(0, 7);
      if (data[monthKey] && payable.status !== 'paid') {
        data[monthKey].pagar += Number(payable.amount);
      }
    });

    return Object.values(data);
  }, [transactions, receivables, payables]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Resumo Financeiro Mensal
      </h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="receitas" name="Receitas" fill="#10b981" />
            <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
            <Bar dataKey="receber" name="A Receber" fill="#f59e0b" />
            <Bar dataKey="pagar" name="A Pagar" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyFinancialChart;
