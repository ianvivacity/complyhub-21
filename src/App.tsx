
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
import { TeamMembers } from "@/pages/TeamMembers";
import { AcceptInvitation } from "@/pages/AcceptInvitation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route for accepting invitations */}
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <ProtectedRoute>
                  <Header />
                  <div className="flex flex-1">
                    <div className="w-64 flex-shrink-0">
                      <Navigation />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<ComplianceRecords />} />
                        <Route 
                          path="/standards" 
                          element={<Standards />} 
                        />
                        <Route 
                          path="/team" 
                          element={<TeamMembers />} 
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
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
