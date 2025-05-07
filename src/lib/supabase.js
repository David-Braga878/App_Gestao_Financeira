
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de banco de dados
export async function fetchCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchReceivables() {
  const { data, error } = await supabase
    .from('receivables')
    .select('*')
    .order('due_date');
  
  if (error) throw error;
  return data;
}

export async function fetchPayables() {
  const { data, error } = await supabase
    .from('payables')
    .select('*')
    .order('due_date');
  
  if (error) throw error;
  return data;
}

export async function fetchFixedExpenses() {
  const { data, error } = await supabase
    .from('fixed_expenses')
    .select('*')
    .order('due_day');
  
  if (error) throw error;
  return data;
}

export async function addCompany(company) {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCompany(company) {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', company.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCompany(id) {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addTransaction(transaction) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTransaction(transaction) {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', transaction.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addReceivable(receivable) {
  const { data, error } = await supabase
    .from('receivables')
    .insert([receivable])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateReceivable(receivable) {
  const { data, error } = await supabase
    .from('receivables')
    .update(receivable)
    .eq('id', receivable.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteReceivable(id) {
  const { error } = await supabase
    .from('receivables')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addPayable(payable) {
  const { data, error } = await supabase
    .from('payables')
    .insert([payable])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePayable(payable) {
  const { data, error } = await supabase
    .from('payables')
    .update(payable)
    .eq('id', payable.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePayable(id) {
  const { error } = await supabase
    .from('payables')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function addFixedExpense(expense) {
  const { data, error } = await supabase
    .from('fixed_expenses')
    .insert([expense])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateFixedExpense(expense) {
  const { data, error } = await supabase
    .from('fixed_expenses')
    .update(expense)
    .eq('id', expense.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteFixedExpense(id) {
  const { error } = await supabase
    .from('fixed_expenses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function toggleFixedExpenseActive(id, isActive) {
  const { data, error } = await supabase
    .from('fixed_expenses')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
