import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Database, BarChart3, Users, AlertTriangle, Eye } from 'lucide-react';
import { AddComplianceDialog } from '@/components/compliance/AddComplianceDialog';
import { EditComplianceDialog } from '@/components/compliance/EditComplianceDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  file_name?: string;
  file_path?: string;
}

export const ComplianceRecords = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ComplianceRecord | null>(null);
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
      console.log('Fetched records:', data);
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

  const handleEditRecord = (record: ComplianceRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

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

  const handleViewFile = async (filePath: string, fileName: string) => {
    try {
      console.log('Downloading file:', filePath, fileName);
      
      const { data, error } = await supabase.storage
        .from('compliance-evidence')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      // Create a blob URL and download the file
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
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
      icon: BarChart3,
      iconColor: 'text-green-500' 
    },
    { 
      label: 'Total Records', 
      value: complianceRecords.length.toString(), 
      subtitle: 'Compliance items tracked', 
      icon: Database,
      iconColor: 'text-blue-500' 
    },
    { 
      label: 'Non-Compliant', 
      value: complianceRecords.filter(r => r.compliance_status === 'Non-Compliant').length.toString(), 
      subtitle: 'Items requiring attention', 
      icon: AlertTriangle,
      iconColor: 'text-red-500' 
    },
    { 
      label: 'At Risk', 
      value: complianceRecords.filter(r => r.compliance_status === 'At Risk').length.toString(), 
      subtitle: 'Items being addressed', 
      icon: Users,
      iconColor: 'text-yellow-500' 
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
        <div className="flex items-center">
          <Database className="h-8 w-8 text-[#7030a0] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Compliance Records</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.subtitle}</div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compliance Records Section */}
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Evidence</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const fileNames = record.file_name ? record.file_name.split(', ') : [];
                  const filePaths = record.file_path ? record.file_path.split(', ') : [];
                  
                  return (
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
                        {fileNames.length > 0 && filePaths.length > 0 ? (
                          <div className="space-y-1">
                            {fileNames.map((fileName, index) => {
                              const filePath = filePaths[index];
                              if (!filePath) return null;
                              
                              return (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewFile(filePath, fileName)}
                                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 mr-1 mb-1"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  {fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName}
                                </Button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No files</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this compliance record?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the compliance record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRecord(record.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      <EditComplianceDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        onSuccess={fetchComplianceRecords}
        record={editingRecord}
      />
    </div>
  );
};
