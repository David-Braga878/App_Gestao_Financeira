
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { useToast } from './ui/use-toast';

const EditPayableDialog = ({ payable, onClose, onUpdate, companies }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    id: '',
    description: '',
    amount: '',
    due_date: '',
    company_id: '',
    notes: '',
    status: 'pending'
  });

  React.useEffect(() => {
    if (payable) {
      setFormData({
        id: payable.id,
        description: payable.description || '',
        amount: payable.amount || '',
        due_date: payable.due_date || '',
        company_id: payable.company_id || '',
        notes: payable.notes || '',
        status: payable.status || 'pending'
      });
    }
  }, [payable]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.due_date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onUpdate({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={!!payable} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Valor a Pagar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="description"
            placeholder="Descrição *"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />

          <div className="grid grid-cols-2 gap-4">
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
            <Input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <Select
            name="company_id"
            value={formData.company_id || ''}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-700"
          >
            <option value="">Selecione uma empresa (opcional)</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </Select>

          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-700"
          >
            <option value="pending">Pendente</option>
            <option value="scheduled">Programado</option>
            <option value="partial">Parcialmente Pago</option>
            <option value="paid">Pago</option>
            <option value="overdue">Atrasado</option>
          </Select>

          <Input
            type="text"
            name="notes"
            placeholder="Observações"
            value={formData.notes}
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

export default EditPayableDialog;
