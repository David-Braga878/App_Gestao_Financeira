
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Building2, MapPin, Phone, Mail, PencilLine as PencilIcon, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const CompanyList = ({ companies, onDeleteCompany, onEditCompany }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCompanies = React.useMemo(() => {
    if (!searchTerm.trim()) return companies;

    const searchLower = searchTerm.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchLower) ||
      company.segment.toLowerCase().includes(searchLower) ||
      company.location.toLowerCase().includes(searchLower)
    );
  }, [companies, searchTerm]);

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Pesquisar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 dark:bg-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <AnimatePresence>
          {filteredCompanies.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="p-4 rounded-xl shadow-md border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 mb-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {company.segment}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => onEditCompany(company)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        onClick={() => onDeleteCompany(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {company.location}
                    </div>
                    {company.phone && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {company.phone}
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {company.email}
                      </div>
                    )}
                  </div>

                  {company.notes && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                      {company.notes}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredCompanies.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
