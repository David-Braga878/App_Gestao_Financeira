
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { useToast } from './ui/use-toast';

const EXPENSE_CATEGORIES = [
  'Aluguel',
  'Água',
  'Energia',
  'Internet',
  'Telefone',
  'Funcionários',
  'Impostos',
  'Contador',
  'Software/Sistemas',
  'Material de Escritório',
  'Limpeza',
  'Manutenção',
  'Outros'
];

const FixedExpenseForm = ({ onAddExpense }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    due_day: '',
    category: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.due_day || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (formData.due_day < 1 || formData.due_day > 31) {
      toast({
        title: "Erro",
        description: "O dia de vencimento deve estar entre 1 e 31.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onAddExpense({
        ...formData,
        amount: Number(formData.amount),
        due_day: Number(formData.due_day),
        is_active: true
      });

      setFormData({
        description: '',
        amount: '',
        due_day: '',
        category: '',
        notes: ''
      });

      toast({
        title: "Sucesso",
        description: "Despesa fixa registrada com sucesso!"
      });

    } catch (error) {
      console.error('Erro ao registrar despesa fixa:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar despesa fixa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            type="text"
            name="description"
            placeholder="Descrição da Despesa *"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="number"
            name="amount"
            placeholder="Valor Mensal *"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Input
            type="number"
            name="due_day"
            placeholder="Dia do Vencimento (1-31) *"
            value={formData.due_day}
            onChange={handleChange}
            min="1"
            max="31"
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-gray-700"
        >
          <option value="">Selecione uma categoria *</option>
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          type="text"
          name="notes"
          placeholder="Observações"
          value={formData.notes}
          onChange={handleChange}
          className="bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
      >
        Registrar Despesa Fixa
      </Button>
    </form>
  );
};

export default FixedExpenseForm;
