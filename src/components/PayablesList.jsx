
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Building2, Calendar, FileText, PencilLine as PencilIcon, Search, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { formatCurrency } from '@/lib/utils';

const PayablesList = ({ payables, onDeletePayable, onEditPayable, onMarkAsPaid }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPayables = React.useMemo(() => {
    if (!searchTerm.trim()) return payables;

    const searchLower = searchTerm.toLowerCase();
    return payables.filter(payable => 
      payable.description?.toLowerCase().includes(searchLower) ||
      payable.company?.name?.toLowerCase().includes(searchLower) ||
      formatCurrency(payable.amount).includes(searchTerm) ||
      new Date(payable.due_date).toLocaleDateString().includes(searchTerm)
    );
  }, [payables, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'partial':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'overdue':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'scheduled':
        return 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'partial':
        return 'Parcialmente Pago';
      case 'overdue':
        return 'Atrasado';
      case 'scheduled':
        return 'Programado';
      default:
        return 'Pendente';
    }
  };

  const handleEdit = (payable) => {
    if (onEditPayable) {
      onEditPayable(payable);
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Pesquisar valores a pagar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <AnimatePresence>
          {filteredPayables.map((payable) => (
            <motion.div
              key={payable.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`p-4 rounded-xl shadow-md border mb-3 ${getStatusColor(payable.status)}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{payable.description}</h3>
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {formatCurrency(payable.amount)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Vencimento: {new Date(payable.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Status: {getStatusText(payable.status)}</span>
                    </div>
                  </div>
                  {payable.company && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span>{payable.company.name}</span>
                    </div>
                  )}
                  {payable.notes && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {payable.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {payable.status !== 'paid' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      onClick={() => onMarkAsPaid(payable)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => handleEdit(payable)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    onClick={() => onDeletePayable(payable.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredPayables.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            {searchTerm ? 'Nenhum valor a pagar encontrado' : 'Nenhum valor a pagar registrado'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PayablesList;
