
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { useToast } from './ui/use-toast';
import { TRANSACTION_TYPES, CATEGORIES } from '@/lib/constants';

const EditTransactionDialog = ({ transaction, onClose, onUpdate, companies }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState(transaction);

  React.useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

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

    onUpdate({
      ...formData,
      amount: Number(formData.amount)
    });
    
    toast({
      title: "Sucesso",
      description: "Transação atualizada com sucesso!"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const categories = formData?.type === TRANSACTION_TYPES.INCOME 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  return (
    <Dialog open={!!transaction} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select 
                name="type"
                value={formData?.type || ''}
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
                value={formData?.amount || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select 
                name="category"
                value={formData?.category || ''}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-700"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            <div>
              <Input
                type="date"
                name="date"
                value={formData?.date || ''}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <Select
              name="company_id"
              value={formData?.company_id || ''}
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
              value={formData?.description || ''}
              onChange={handleChange}
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>

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

export default EditTransactionDialog;
