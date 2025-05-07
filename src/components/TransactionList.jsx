
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Building2, Search, PencilLine as PencilIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TransactionList = ({ transactions, payables, receivables, onDeleteTransaction, onEditTransaction }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const allTransactions = React.useMemo(() => {
    const paidPayables = payables
      .filter(p => p.status === 'paid')
      .map(p => ({
        id: `payable-${p.id}`,
        type: 'expense',
        amount: p.amount,
        category: 'Valor Pago',
        description: p.description,
        date: p.due_date,
        company: p.company,
        isFromPayable: true
      }));

    const receivedReceivables = receivables
      .filter(r => r.status === 'received')
      .map(r => ({
        id: `receivable-${r.id}`,
        type: 'income',
        amount: r.amount,
        category: 'Valor Recebido',
        description: r.description,
        date: r.due_date,
        company: r.company,
        isFromReceivable: true
      }));

    return [...transactions, ...paidPayables, ...receivedReceivables].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  }, [transactions, payables, receivables]);

  const filteredTransactions = React.useMemo(() => {
    if (!searchTerm.trim()) return allTransactions;

    const searchLower = searchTerm.toLowerCase();
    return allTransactions.filter(transaction => 
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.company?.name.toLowerCase().includes(searchLower) ||
      formatCurrency(transaction.amount).includes(searchTerm) ||
      new Date(transaction.date).toLocaleDateString().includes(searchTerm)
    );
  }, [allTransactions, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Pesquisar transações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="h-[400px] overflow-y-auto space-y-3">
        <AnimatePresence>
          {filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`p-4 rounded-xl shadow-sm border ${
                transaction.type === 'income' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{transaction.category}</h3>
                    <span className={`font-bold ${
                      transaction.type === 'income' 
                        ? 'text-emerald-700 dark:text-emerald-400' 
                        : 'text-rose-700 dark:text-rose-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{transaction.description || 'Sem descrição'}</span>
                    <span className="text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                  {transaction.company && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span>{transaction.company.name}</span>
                    </div>
                  )}
                </div>
                {!transaction.isFromPayable && !transaction.isFromReceivable && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${
                        transaction.type === 'income' 
                          ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300' 
                          : 'text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300'
                      }`}
                      onClick={() => onEditTransaction(transaction)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${
                        transaction.type === 'income' 
                          ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300' 
                          : 'text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300'
                      }`}
                      onClick={() => onDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredTransactions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            {searchTerm ? 'Nenhuma transação encontrada' : 'Nenhuma transação registrada'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
