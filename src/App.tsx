
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/navigation/Navigation";
import { Dashboard } from "@/pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <ProtectedRoute>
              <Header />
              <div className="flex">
                <div className="w-64 min-h-[calc(100vh-4rem)]">
                  <Navigation />
                </div>
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route 
                      path="/compliance" 
                      element={
                        <div className="p-6">
                          <h1 className="text-3xl font-bold">Compliance Records</h1>
                          <p className="text-gray-600 mt-2">Manage your compliance records here.</p>
                        </div>
                      } 
                    />
                    <Route 
                      path="/standards" 
                      element={
                        <div className="p-6">
                          <h1 className="text-3xl font-bold">Standards</h1>
                          <p className="text-gray-600 mt-2">Manage your compliance standards here.</p>
                        </div>
                      } 
                    />
                    <Route 
                      path="/team" 
                      element={
                        <div className="p-6">
                          <h1 className="text-3xl font-bold">Team Members</h1>
                          <p className="text-gray-600 mt-2">Manage your organisation members here.</p>
                        </div>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute adminOnly>
                          <div className="p-6">
                            <h1 className="text-3xl font-bold">Settings</h1>
                            <p className="text-gray-600 mt-2">Configure system settings (Admin only).</p>
                          </div>
                        </ProtectedRoute>
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
