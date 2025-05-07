
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

const CompanyForm = ({ onAddCompany }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    segment: '',
    location: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.segment || !formData.location) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onAddCompany(formData);

      setFormData({
        name: '',
        segment: '',
        location: '',
        email: '',
        phone: '',
        notes: ''
      });

      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso!"
      });

    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar empresa. Tente novamente.",
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
            name="name"
            placeholder="Nome da Empresa *"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            name="segment"
            placeholder="Segmento de Atuação *"
            value={formData.segment}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Input
            type="text"
            name="location"
            placeholder="Cidade/Estado *"
            value={formData.location}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
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
        Cadastrar Empresa
      </Button>
    </form>
  );
};

export default CompanyForm;
