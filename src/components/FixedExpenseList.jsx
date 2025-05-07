
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar, FileText, PencilLine as PencilIcon, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { formatCurrency } from '@/lib/utils';

const FixedExpenseList = ({ expenses, onDeleteExpense, onEditExpense, onToggleActive }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredExpenses = React.useMemo(() => {
    if (!searchTerm.trim()) return expenses;

    const searchLower = searchTerm.toLowerCase();
    return expenses.filter(expense => 
      expense.description.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      formatCurrency(expense.amount).includes(searchTerm) ||
      String(expense.due_day).includes(searchTerm)
    );
  }, [expenses, searchTerm]);

  const totalMonthlyExpenses = React.useMemo(() => {
    return expenses
      .filter(expense => expense.is_active)
      .reduce((total, expense) => total + Number(expense.amount), 0);
  }, [expenses]);

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Pesquisar despesas fixas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          Total Mensal: {formatCurrency(totalMonthlyExpenses)}
        </h3>
        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
          Total de despesas fixas ativas
        </p>
      </div>

      <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <AnimatePresence>
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`p-4 rounded-xl shadow-md border mb-3 ${
                expense.is_active
                  ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-medium ${
                        expense.is_active
                          ? 'text-gray-800 dark:text-gray-200'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {expense.description}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.category}
                      </span>
                    </div>
                    <span className={`font-bold ${
                      expense.is_active
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Vencimento: todo dia {expense.due_day}</span>
                  </div>
                  {expense.notes && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {expense.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      expense.is_active
                        ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                        : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                    }`}
                    onClick={() => onToggleActive(expense.id, !expense.is_active)}
                  >
                    {expense.is_active ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => onEditExpense(expense)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredExpenses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            {searchTerm ? 'Nenhuma despesa fixa encontrada' : 'Nenhuma despesa fixa registrada'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FixedExpenseList;
