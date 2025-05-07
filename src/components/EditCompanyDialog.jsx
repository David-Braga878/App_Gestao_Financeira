
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

const EditCompanyDialog = ({ company, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState(company);

  React.useEffect(() => {
    setFormData(company);
  }, [company]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.segment || !formData.location) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onUpdate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={!!company} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Nome da Empresa *"
            value={formData?.name || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Input
            name="segment"
            placeholder="Segmento de Atuação *"
            value={formData?.segment || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Input
            name="location"
            placeholder="Cidade/Estado *"
            value={formData?.location || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Input
            name="email"
            type="email"
            placeholder="E-mail"
            value={formData?.email || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Input
            name="phone"
            placeholder="Telefone"
            value={formData?.phone || ''}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
          <Input
            name="notes"
            placeholder="Observações"
            value={formData?.notes || ''}
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

export default EditCompanyDialog;
