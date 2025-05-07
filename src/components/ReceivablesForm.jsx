
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { useToast } from './ui/use-toast';

const ReceivablesForm = ({ onAddReceivable, companies }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    company_id: '',
    notes: '',
    status: 'pending'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.due_date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onAddReceivable({
        ...formData,
        amount: Number(formData.amount)
      });

      setFormData({
        description: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        company_id: '',
        notes: '',
        status: 'pending'
      });

      toast({
        title: "Sucesso",
        description: "Valor a receber registrado com sucesso!"
      });

    } catch (error) {
      console.error('Erro ao registrar valor a receber:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar valor a receber. Tente novamente.",
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
            placeholder="Descrição *"
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
            placeholder="Valor *"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Input
            type="date"
            name="due_date"
            value={formData.due_date}
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
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-gray-700"
        >
          <option value="pending">Pendente</option>
          <option value="scheduled">Programado</option>
          <option value="partial">Parcialmente Recebido</option>
          <option value="received">Recebido</option>
          <option value="overdue">Atrasado</option>
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
        Registrar Valor a Receber
      </Button>
    </form>
  );
};

export default ReceivablesForm;
