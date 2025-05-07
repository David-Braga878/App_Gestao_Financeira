
import React, { useState, useEffect } from 'react';
import { useToast } from './components/ui/use-toast';
import { Toaster } from './components/ui/toaster';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CompanyForm from './components/CompanyForm';
import CompanyList from './components/CompanyList';
import CompanyRanking from './components/CompanyRanking';
import EditCompanyDialog from './components/EditCompanyDialog';
import EditTransactionDialog from './components/EditTransactionDialog';
import ExportButtons from './components/ExportButtons';
import ReceivablesForm from './components/ReceivablesForm';
import ReceivablesList from './components/ReceivablesList';
import EditReceivableDialog from './components/EditReceivableDialog';
import PayablesForm from './components/PayablesForm';
import PayablesList from './components/PayablesList';
import EditPayableDialog from './components/EditPayableDialog';
import EditFixedExpenseDialog from './components/EditFixedExpenseDialog';
import WorkingCapital from './components/WorkingCapital';
import MonthlyFinancialChart from './components/MonthlyFinancialChart';
import {
  fetchCompanies,
  fetchTransactions,
  fetchReceivables,
  fetchPayables,
  fetchFixedExpenses,
  addCompany,
  updateCompany,
  deleteCompany,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addReceivable,
  updateReceivable,
  deleteReceivable,
  addPayable,
  updatePayable,
  deletePayable,
  addFixedExpense,
  updateFixedExpense,
  deleteFixedExpense,
  toggleFixedExpenseActive
} from '@/lib/supabase';

const App = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingReceivable, setEditingReceivable] = useState(null);
  const [editingPayable, setEditingPayable] = useState(null);
  const [editingFixedExpense, setEditingFixedExpense] = useState(null);

  useEffect(() => {
    const isAlreadyLogged = localStorage.getItem("logado") === "true";
    setIsLoggedIn(isAlreadyLogged);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadData = async () => {
      try {
        const [
          companiesData,
          transactionsData,
          receivablesData,
          payablesData,
          fixedExpensesData
        ] = await Promise.all([
          fetchCompanies(),
          fetchTransactions(),
          fetchReceivables(),
          fetchPayables(),
          fetchFixedExpenses()
        ]);

        setCompanies(companiesData);
        setTransactions(transactionsData);
        setReceivables(receivablesData);
        setPayables(payablesData);
        setFixedExpenses(fixedExpensesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Rest of the component remains exactly the same...
  // Companies handlers
  const handleAddCompany = async (company) => {
    try {
      const newCompany = await addCompany(company);
      setCompanies(prev => [...prev, newCompany]);
      toast({
        title: "Sucesso",
        description: "Empresa adicionada com sucesso!"
      });
    } catch (error) {
      console.error('Error adding company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a empresa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCompany = async (company) => {
    try {
      const updatedCompany = await updateCompany(company);
      setCompanies(prev => prev.map(c => c.id === company.id ? updatedCompany : c));
      setEditingCompany(null);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a empresa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      await deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Empresa removida com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a empresa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Transactions handlers
  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await addTransaction(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!"
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTransaction = async (transaction) => {
    try {
      const updatedTransaction = await updateTransaction(transaction);
      setTransactions(prev => prev.map(t => t.id === transaction.id ? updatedTransaction : t));
      setEditingTransaction(null);
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Sucesso",
        description: "Transação removida com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a transação. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Receivables handlers
  const handleAddReceivable = async (receivable) => {
    try {
      const newReceivable = await addReceivable(receivable);
      setReceivables(prev => [...prev, newReceivable]);
      toast({
        title: "Sucesso",
        description: "Valor a receber adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Error adding receivable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o valor a receber. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateReceivable = async (receivable) => {
    try {
      const updatedReceivable = await updateReceivable(receivable);
      setReceivables(prev => prev.map(r => r.id === receivable.id ? updatedReceivable : r));
      setEditingReceivable(null);
      toast({
        title: "Sucesso",
        description: "Valor a receber atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error updating receivable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o valor a receber. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReceivable = async (id) => {
    try {
      await deleteReceivable(id);
      setReceivables(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Sucesso",
        description: "Valor a receber removido com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting receivable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o valor a receber. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Payables handlers
  const handleAddPayable = async (payable) => {
    try {
      const newPayable = await addPayable(payable);
      setPayables(prev => [...prev, newPayable]);
      toast({
        title: "Sucesso",
        description: "Valor a pagar adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Error adding payable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o valor a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePayable = async (payable) => {
    try {
      const updatedPayable = await updatePayable(payable);
      setPayables(prev => prev.map(p => p.id === payable.id ? updatedPayable : p));
      setEditingPayable(null);
      toast({
        title: "Sucesso",
        description: "Valor a pagar atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error updating payable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o valor a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePayable = async (id) => {
    try {
      await deletePayable(id);
      setPayables(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Valor a pagar removido com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting payable:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o valor a pagar. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Fixed Expenses handlers
  const handleAddFixedExpense = async (expense) => {
    try {
      const newExpense = await addFixedExpense(expense);
      setFixedExpenses(prev => [...prev, newExpense]);
      toast({
        title: "Sucesso",
        description: "Despesa fixa adicionada com sucesso!"
      });
    } catch (error) {
      console.error('Error adding fixed expense:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a despesa fixa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFixedExpense = async (expense) => {
    try {
      const updatedExpense = await updateFixedExpense(expense);
      setFixedExpenses(prev => prev.map(e => e.id === expense.id ? updatedExpense : e));
      setEditingFixedExpense(null);
      toast({
        title: "Sucesso",
        description: "Despesa fixa atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Error updating fixed expense:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a despesa fixa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFixedExpense = async (id) => {
    try {
      await deleteFixedExpense(id);
      setFixedExpenses(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Sucesso",
        description: "Despesa fixa removida com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting fixed expense:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a despesa fixa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFixedExpense = async (id, isActive) => {
    try {
      await toggleFixedExpenseActive(id, isActive);
      setFixedExpenses(prev => prev.map(e => e.id === id ? { ...e, is_active: isActive } : e));
      toast({
        title: "Sucesso",
        description: `Despesa fixa ${isActive ? 'ativada' : 'desativada'} com sucesso!`
      });
    } catch (error) {
      console.error('Error toggling fixed expense:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da despesa fixa. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/c8d96113-9eb8-4402-b93c-b27282501577/d21d872f34997805f1bb1b5260f3c21a.png" 
              alt="Logo Engenharias" 
              className="h-12 w-auto transition-transform hover:scale-105"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sistema Financeiro
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => window.location.reload()}>
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="financial" className="space-y-8">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="financial">Gerenciamento Financeiro</TabsTrigger>
            <TabsTrigger value="receivables">Valores a Receber</TabsTrigger>
            <TabsTrigger value="payables">Valores a Pagar</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="working-capital">Capital de Giro</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <Dashboard 
              transactions={transactions} 
              receivables={receivables}
              payables={payables}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Nova Transação
                  </h2>
                  <TransactionForm 
                    onAddTransaction={handleAddTransaction}
                    companies={companies}
                  />
                </div>
                
                <MonthlyFinancialChart
                  transactions={transactions}
                  receivables={receivables}
                  payables={payables}
                />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Histórico de Transações
                    </h2>
                    <ExportButtons transactions={transactions} />
                  </div>
                  <TransactionList 
                    transactions={transactions}
                    payables={payables}
                    receivables={receivables}
                    onDeleteTransaction={handleDeleteTransaction}
                    onEditTransaction={setEditingTransaction}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Ranking de Empresas
                  </h2>
                  <CompanyRanking 
                    transactions={transactions}
                    companies={companies}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="receivables">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Novo Valor a Receber
                </h2>
                <ReceivablesForm 
                  onAddReceivable={handleAddReceivable}
                  companies={companies}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Lista de Valores a Receber
                </h2>
                <ReceivablesList 
                  receivables={receivables}
                  onDeleteReceivable={handleDeleteReceivable}
                  onEditReceivable={setEditingReceivable}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payables">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Novo Valor a Pagar
                </h2>
                <PayablesForm 
                  onAddPayable={handleAddPayable}
                  companies={companies}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Lista de Valores a Pagar
                </h2>
                <PayablesList 
                  payables={payables}
                  onDeletePayable={handleDeletePayable}
                  onEditPayable={setEditingPayable}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Nova Empresa
                </h2>
                <CompanyForm onAddCompany={handleAddCompany} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Lista de Empresas
                </h2>
                <CompanyList 
                  companies={companies}
                  onDeleteCompany={handleDeleteCompany}
                  onEditCompany={setEditingCompany}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="working-capital">
            <WorkingCapital 
              transactions={transactions}
              receivables={receivables}
              payables={payables}
              fixedExpenses={fixedExpenses}
              onAddFixedExpense={handleAddFixedExpense}
              onDeleteFixedExpense={handleDeleteFixedExpense}
              onEditFixedExpense={setEditingFixedExpense}
              onToggleFixedExpense={handleToggleFixedExpense}
            />
          </TabsContent>
        </Tabs>
      </main>

      {editingCompany && (
        <EditCompanyDialog
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onUpdate={handleUpdateCompany}
        />
      )}

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={handleUpdateTransaction}
          companies={companies}
        />
      )}

      {editingReceivable && (
        <EditReceivableDialog
          receivable={editingReceivable}
          onClose={() => setEditingReceivable(null)}
          onUpdate={handleUpdateReceivable}
          companies={companies}
        />
      )}

      {editingPayable && (
        <EditPayableDialog
          payable={editingPayable}
          onClose={() => setEditingPayable(null)}
          onUpdate={handleUpdatePayable}
          companies={companies}
        />
      )}

      {editingFixedExpense && (
        <EditFixedExpenseDialog
          expense={editingFixedExpense}
          isOpen={!!editingFixedExpense}
          onClose={() => setEditingFixedExpense(null)}
          onSave={handleUpdateFixedExpense}
        />
      )}

      <Toaster />
    </div>
  );
};

export default App;
