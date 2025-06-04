
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { AddComplianceDialog } from '@/components/compliance/AddComplianceDialog';

export const ComplianceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const complianceRecords = [
    {
      id: 1,
      item: 'test2',
      standardClause: 'CS1.05',
      status: 'Compliant',
      responsiblePerson: 'Carlo Legada',
      nextReviewDate: '6/3/2025',
      reviewStatus: 'In Progress',
      evidence: 'View'
    },
    {
      id: 2,
      item: 'comly 101',
      standardClause: 'CS1.05',
      status: 'Compliant',
      responsiblePerson: 'Carlo Legada',
      nextReviewDate: '6/3/2025',
      reviewStatus: 'In Progress',
      evidence: 'No evidence'
    },
    {
      id: 3,
      item: 'Compliance 101',
      standardClause: 'CS3.1',
      status: 'Compliant',
      responsiblePerson: 'Carlo Legada',
      nextReviewDate: '6/3/2025',
      reviewStatus: 'In Progress',
      evidence: 'View'
    },
    {
      id: 4,
      item: 'Adding Entry Notifications 4.1',
      standardClause: 'I am editing this one.',
      status: 'At Risk',
      responsiblePerson: 'Ian Baterna',
      nextReviewDate: '5/31/2025',
      reviewStatus: 'In Progress',
      evidence: 'No evidence'
    },
    {
      id: 5,
      item: 'Adding New Item 3.2',
      standardClause: 'Editing entry notifications. 3.2',
      status: 'Compliant',
      responsiblePerson: 'Carlo Legada',
      nextReviewDate: '5/31/2025',
      reviewStatus: 'In Progress',
      evidence: 'View'
    }
  ];

  const stats = [
    { label: 'Overall Compliance', value: '47%', subtitle: '8 of 17 items compliant', color: 'bg-green-500' },
    { label: 'Total Records', value: '17', subtitle: 'Compliance items tracked', color: 'bg-blue-500' },
    { label: 'Non-Compliant', value: '4', subtitle: 'Items requiring attention', color: 'bg-red-500' },
    { label: 'At Risk', value: '5', subtitle: 'Items being addressed', color: 'bg-yellow-500' }
  ];

  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = record.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.standardClause.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
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
                  <SelectItem value="at risk">At Risk</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
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
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{record.item}</td>
                    <td className="py-3 px-4 text-gray-600">{record.standardClause}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{record.responsiblePerson}</td>
                    <td className="py-3 px-4 text-gray-600">{record.nextReviewDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {record.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {record.evidence === 'View' ? (
                        <Button variant="link" size="sm" className="text-[#7030a0] p-0">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">{record.evidence}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="link" size="sm" className="text-[#7030a0] p-0">
                          Edit
                        </Button>
                        <Button variant="link" size="sm" className="text-red-600 p-0">
                          Delete
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

      <AddComplianceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};
