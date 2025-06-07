
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, FileText } from 'lucide-react';
import { AddStandardDialog } from '@/components/standards/AddStandardDialog';

export const Standards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const standards = [
    {
      id: 1,
      clause: 'Members Only',
      description: 'test',
      createdDate: '6/2/2025'
    },
    {
      id: 2,
      clause: 'demo 202',
      description: 'this is a demo 202',
      createdDate: '6/2/2025'
    },
    {
      id: 3,
      clause: 'CS1.05',
      description: 'AS 1170.1 outlines the general principles and ...',
      createdDate: '6/2/2025'
    },
    {
      id: 4,
      clause: 'CS3.1',
      description: 'There is no standard titled exactly "CS3.1" in ...',
      createdDate: '6/1/2025'
    }
  ];

  const filteredStandards = standards.filter(standard =>
    standard.clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-[#7030a0] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Standards Management</h1>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#7030a0] hover:bg-[#5e2680] text-white"
        >
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
                    <td className="py-3 px-4 font-medium">{standard.clause}</td>
                    <td className="py-3 px-4 text-gray-600">{standard.description}</td>
                    <td className="py-3 px-4 text-gray-600">{standard.createdDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddStandardDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};
