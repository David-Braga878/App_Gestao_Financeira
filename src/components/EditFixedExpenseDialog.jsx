
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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

const EditFixedExpenseDialog = ({ expense, isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState(expense);

  React.useEffect(() => {
    setFormData(expense);
  }, [expense]);

  const handleSubmit = (e) => {
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

    onSave({
      ...formData,
      amount: Number(formData.amount),
      due_day: Number(formData.due_day)
    });
    onClose();
    
    toast({
      title: "Sucesso",
      description: "Despesa fixa atualizada com sucesso!"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Despesa Fixa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="description"
            placeholder="Descrição da Despesa *"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />

          <div className="grid grid-cols-2 gap-4">
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

          <Input
            type="text"
            name="notes"
            placeholder="Observações"
            value={formData.notes || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFixedExpenseDialog;
