
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/navigation/Navigation";
import { ComplianceRecords } from "@/pages/ComplianceRecords";
import { Standards } from "@/pages/Standards";
import { Dashboard } from "@/pages/Dashboard";
import { TeamMembers } from "@/pages/TeamMembers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <ProtectedRoute>
              <Header />
              <div className="flex flex-1">
                <div className="w-64 flex-shrink-0">
                  <Navigation />
                </div>
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route 
                      path="/compliance" 
                      element={<ComplianceRecords />} 
                    />
                    <Route 
                      path="/standards" 
                      element={<Standards />} 
                    />
                    <Route 
                      path="/team" 
                      element={
                        <ProtectedRoute adminOnly>
                          <TeamMembers />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <div className="p-6">
                          <h1 className="text-3xl font-bold">Settings</h1>
                          <p className="text-gray-600 mt-2">Manage your profile and account settings.</p>
                        </div>
                      } 
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
