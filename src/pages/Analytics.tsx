
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Analytics = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <BarChart3 className="h-16 w-16 text-[#7030a0] mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reporting</h1>
      <p className="text-lg text-gray-600">Under Development</p>
    </div>
  );
};
