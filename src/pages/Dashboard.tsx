
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileText, Users, AlertTriangle, PieChart, Plus } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - this would come from your Supabase queries in a real implementation
  const stats = {
    totalRecords: 0,
    standards: 0,
    teamMembers: 1,
    overdue: 0
  };

  // Pie chart data for compliance
  const complianceData = [
    { name: 'Compliant', value: 0, color: '#22c55e' },
    { name: 'At Risk', value: 0, color: '#eab308' },
    { name: 'Non-Compliant', value: 0, color: '#ef4444' },
    { name: 'Not Started', value: 1, color: '#94a3b8' }
  ];

  const quickActions = [
    'Add compliance records to track your organisation\'s compliance status',
    'Define standards and requirements for your industry',
    'Manage team members and their access levels',
    'Configure system settings as an administrator'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Ian! Here's an overview of your compliance tracking.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/compliance')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRecords}</p>
                <p className="text-sm text-gray-500 mt-1">compliance records</p>
              </div>
              <Database className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/standards')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Standards</p>
                <p className="text-3xl font-bold text-gray-900">{stats.standards}</p>
                <p className="text-sm text-gray-500 mt-1">active standards</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/team')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{stats.teamMembers}</p>
                <p className="text-sm text-gray-500 mt-1">organisation members</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/compliance?filter=overdue')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
                <p className="text-sm text-gray-500 mt-1">overdue reviews</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organisation Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Organisation Information</h3>
            <p className="text-sm text-gray-500 mb-4">Your organisation details</p>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Organisation:</span>
                <span className="ml-2 text-gray-600">vivacity</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">RTO ID:</span>
                <span className="ml-2 text-gray-600">123</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Your Role:</span>
                <span className="ml-2 text-gray-600">admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-sm text-gray-500 mb-4">Get started with compliance tracking</p>
            
            <ul className="space-y-2">
              {quickActions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#7030a0] mr-2">•</span>
                  <span className="text-sm text-gray-600">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Compliance Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Compliance</h3>
            <p className="text-sm text-gray-500 mb-4">Compliance status breakdown</p>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
