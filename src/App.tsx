
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { ComplianceRecords } from "@/pages/ComplianceRecords";
import { Standards } from "@/pages/Standards";
import { TeamMembers } from "@/pages/TeamMembers";
import { Analytics } from "@/pages/Analytics";
import { Messages } from "@/pages/Messages";
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
              <ProtectedRoute>
                <AppLayout>
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
                      path="/analytics" 
                      element={<Analytics />} 
                    />
                    <Route 
                      path="/messages" 
                      element={<Messages />} 
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
                </AppLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
