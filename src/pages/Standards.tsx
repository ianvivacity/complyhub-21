
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';
import { AddStandardDialog } from '@/components/standards/AddStandardDialog';
import { EditStandardDialog } from '@/components/standards/EditStandardDialog';
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

interface Standard {
  id: string;
  standard_clause: string;
  standard_description: string;
  created_at: string;
}

export const Standards = () => {
  const { organisationMember } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStandards = async () => {
    if (!organisationMember?.organisation_id) return;

    try {
      const { data, error } = await supabase
        .from('standards')
        .select('*')
        .eq('organisation_id', organisationMember.organisation_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStandards(data || []);
    } catch (error) {
      console.error('Error fetching standards:', error);
      toast({
        title: "Error",
        description: "Failed to fetch standards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [organisationMember]);

  const handleEditStandard = (standard: Standard) => {
    setEditingStandard(standard);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStandard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('standards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Standard deleted successfully",
      });

      fetchStandards();
    } catch (error) {
      console.error('Error deleting standard:', error);
      toast({
        title: "Error",
        description: "Failed to delete standard",
        variant: "destructive",
      });
    }
  };

  const filteredStandards = standards.filter(standard =>
    standard.standard_clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.standard_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading standards...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-[#7030a0] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Standards Management</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Standard
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by standard clause or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Standard Clause</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Standard Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Created Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandards.map((standard) => (
                  <tr key={standard.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{standard.standard_clause}</td>
                    <td className="py-3 px-4 text-gray-600">{standard.standard_description}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(standard.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditStandard(standard)}
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
                              <AlertDialogTitle>Are you sure you want to delete this standard?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the standard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStandard(standard.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStandards.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm 
                ? 'No standards found matching your search.' 
                : 'No standards yet. Click "Add Standard" to get started.'}
            </div>
          )}
        </CardContent>
      </Card>

      <AddStandardDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchStandards}
      />

      <EditStandardDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        onSuccess={fetchStandards}
        standard={editingStandard}
      />
    </div>
  );
};
