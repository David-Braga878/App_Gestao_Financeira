
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency } from './utils';

export const exportToPDF = (transactions) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Relatório de Transações', 14, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);

  // Preparar dados para a tabela
  const tableData = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.type === 'income' ? 'Receita' : 'Despesa',
    transaction.category,
    transaction.company?.name || '-',
    formatCurrency(transaction.amount),
    transaction.description || '-'
  ]);

  // Criar tabela
  doc.autoTable({
    startY: 40,
    head: [['Data', 'Tipo', 'Categoria', 'Empresa', 'Valor', 'Descrição']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Adicionar totais
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expenses;

  const finalY = doc.previousAutoTable.finalY || 40;
  doc.setFontSize(10);
  doc.text(`Total de Receitas: ${formatCurrency(income)}`, 14, finalY + 10);
  doc.text(`Total de Despesas: ${formatCurrency(expenses)}`, 14, finalY + 20);
  doc.text(`Saldo: ${formatCurrency(balance)}`, 14, finalY + 30);

  // Salvar o PDF
  doc.save('transacoes.pdf');
};

export const exportToExcel = (transactions) => {
  // Preparar dados para o Excel
  const excelData = transactions.map(transaction => ({
    Data: new Date(transaction.date).toLocaleDateString(),
    Tipo: transaction.type === 'income' ? 'Receita' : 'Despesa',
    Categoria: transaction.category,
    Empresa: transaction.company?.name || '-',
    Valor: formatCurrency(transaction.amount),
    Descrição: transaction.description || '-'
  }));

  // Criar planilha
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transações');

  // Salvar o arquivo
  XLSX.writeFile(wb, 'transacoes.xlsx');
};
