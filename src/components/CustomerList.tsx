// components/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { AddCustomer } from './AddCustomer';
import type { Database } from '../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCustomer(id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <button
          onClick={() => setIsAddingCustomer(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingCustomer(customer)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {customer.company_name && (
              <div className="flex items-center text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                {customer.company_name}
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {customer.email}
            </div>

            {customer.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {customer.phone}
              </div>
            )}

            {customer.address && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <div>
                  {customer.address}
                  {customer.city && `, ${customer.city}`}
                  {customer.state && `, ${customer.state}`}
                  {customer.postal_code && ` ${customer.postal_code}`}
                </div>
              </div>
            )}

            {customer.last_contacted_at && (
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Last Contact: {format(new Date(customer.last_contacted_at), 'MMM d, yyyy')}
              </div>
            )}

            {customer.notes && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-medium">Notes:</p>
                <p className="mt-1">{customer.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {(isAddingCustomer || editingCustomer) && (
        <AddCustomer
          customer={editingCustomer}
          onClose={() => {
            setIsAddingCustomer(false);
            setEditingCustomer(null);
          }}
          onSave={() => {
            loadCustomers();
            setIsAddingCustomer(false);
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
}
