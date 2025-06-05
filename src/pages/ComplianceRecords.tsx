
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AddComplianceDialog } from '@/components/compliance/AddComplianceDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComplianceRecord {
  id: string;
  compliance_item: string;
  standard_clause: string;
  compliance_status: string;
  responsible_person: string;
  next_review_date: string;
  review_status: string;
  notes: string;
  created_at: string;
}

export const ComplianceRecords = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if we should filter by overdue items from URL
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'overdue') {
      setStatusFilter('overdue');
    }
  }, [searchParams]);

  const fetchComplianceRecords = async () => {
    if (!organisationMember?.organisation_id) return;

    try {
      const { data, error } = await supabase
        .from('compliance_records')
        .select('*')
        .eq('organisation_id', organisationMember.organisation_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplianceRecords(data || []);
    } catch (error) {
      console.error('Error fetching compliance records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch compliance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceRecords();
  }, [organisationMember]);

  const handleDeleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('compliance_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Compliance record deleted successfully",
      });

      fetchComplianceRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete compliance record",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { 
      label: 'Overall Compliance', 
      value: complianceRecords.length > 0 ? 
        `${Math.round((complianceRecords.filter(r => r.compliance_status === 'Compliant').length / complianceRecords.length) * 100)}%` : 
        '0%', 
      subtitle: `${complianceRecords.filter(r => r.compliance_status === 'Compliant').length} of ${complianceRecords.length} items compliant`, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Total Records', 
      value: complianceRecords.length.toString(), 
      subtitle: 'Compliance items tracked', 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Non-Compliant', 
      value: complianceRecords.filter(r => r.compliance_status === 'Non-Compliant').length.toString(), 
      subtitle: 'Items requiring attention', 
      color: 'bg-red-500' 
    },
    { 
      label: 'At Risk', 
      value: complianceRecords.filter(r => r.compliance_status === 'At Risk').length.toString(), 
      subtitle: 'Items being addressed', 
      color: 'bg-yellow-500' 
    }
  ];

  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = record.compliance_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.standard_clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.responsible_person.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'overdue') {
      matchesStatus = record.review_status?.toLowerCase() === 'overdue';
    } else if (statusFilter !== 'all') {
      matchesStatus = record.compliance_status.toLowerCase() === statusFilter.toLowerCase().replace('-', ' ');
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case 'compliant':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'at risk':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'non-compliant':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading compliance records...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ComplyHub.ai Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.color} text-white`}>
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="text-sm opacity-80 mt-1">{stat.subtitle}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Records Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Records</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Compliance Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by item, clause, or person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Compliance Item</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Standard Clause</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Responsible Person</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Next Review Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Review Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{record.compliance_item}</td>
                    <td className="py-3 px-4 text-gray-600">{record.standard_clause}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(record.compliance_status)}>
                        {record.compliance_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{record.responsible_person}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {record.next_review_date ? new Date(record.next_review_date).toLocaleDateString() : 'Not set'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {record.review_status || 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="link" size="sm" className="text-[#7030a0] p-0">
                          Edit
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-red-600 p-0"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No compliance records found matching your filters.' 
                : 'No compliance records yet. Click "Add Compliance Item" to get started.'}
            </div>
          )}
        </CardContent>
      </Card>

      <AddComplianceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchComplianceRecords}
      />
    </div>
  );
};
