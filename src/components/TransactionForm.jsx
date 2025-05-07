
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { TRANSACTION_TYPES, CATEGORIES } from '@/lib/constants';
import { useToast } from './ui/use-toast';
import { Plus } from 'lucide-react';

const TransactionForm = ({ onAddTransaction, companies }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: TRANSACTION_TYPES.EXPENSE,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    company_id: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const selectedCompany = formData.company_id 
      ? companies.find(c => c.id === Number(formData.company_id))
      : null;

    onAddTransaction({
      ...formData,
      amount: Number(formData.amount),
      id: Date.now(),
      company: selectedCompany
    });

    setFormData({
      type: TRANSACTION_TYPES.EXPENSE,
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      company_id: ''
    });

    toast({
      title: "Sucesso",
      description: "Transação adicionada com sucesso!"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a categoria.",
        variant: "destructive"
      });
      return;
    }

    // Adicionar a nova categoria ao array apropriado
    if (formData.type === TRANSACTION_TYPES.INCOME) {
      CATEGORIES.INCOME.push(newCategory);
    } else {
      CATEGORIES.EXPENSE.push(newCategory);
    }

    // Atualizar a categoria selecionada
    setFormData(prev => ({ ...prev, category: newCategory }));
    
    // Limpar e esconder o input
    setNewCategory('');
    setShowCategoryInput(false);

    toast({
      title: "Sucesso",
      description: "Nova categoria adicionada com sucesso!"
    });
  };

  const categories = formData.type === TRANSACTION_TYPES.INCOME 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-700"
          >
            <option value={TRANSACTION_TYPES.EXPENSE}>Despesa</option>
            <option value={TRANSACTION_TYPES.INCOME}>Receita</option>
          </Select>
        </div>
        <div>
          <Input
            type="number"
            name="amount"
            placeholder="Valor"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-gray-700"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowCategoryInput(true)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {showCategoryInput && (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700"
              />
              <Button
                type="button"
                onClick={handleAddCategory}
                className="shrink-0"
              >
                Adicionar
              </Button>
            </div>
          )}
        </div>
        <div>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <Select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-gray-700"
        >
          <option value="">Selecione uma empresa (opcional)</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          type="text"
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
      >
        Adicionar Transação
      </Button>
    </form>
  );
};

export default TransactionForm;
