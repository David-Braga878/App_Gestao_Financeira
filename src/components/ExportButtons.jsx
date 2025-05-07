
import React from 'react';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { useToast } from './ui/use-toast';

const ExportButtons = ({ transactions }) => {
  const { toast } = useToast();

  const handleExport = (type) => {
    try {
      if (transactions.length === 0) {
        toast({
          title: "Erro",
          description: "Não há transações para exportar.",
          variant: "destructive"
        });
        return;
      }

      if (type === 'pdf') {
        exportToPDF(transactions);
      } else {
        exportToExcel(transactions);
      }

      toast({
        title: "Sucesso",
        description: `Relatório exportado em ${type.toUpperCase()} com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao exportar o relatório.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400"
        onClick={() => handleExport('pdf')}
      >
        <FileDown className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400"
        onClick={() => handleExport('excel')}
      >
        <FileDown className="h-4 w-4" />
        Excel
      </Button>
    </div>
  );
};

export default ExportButtons;
