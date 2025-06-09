
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, Clock, Bell } from 'lucide-react';

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDemo = () => {
    // Add demo request logic here
    toast({
      title: "Demo Requested",
      description: "Thank you for your interest! We'll contact you soon."
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand and features */}
      <div className="flex-1 bg-gradient-to-br from-[#7130a0] to-[#ed1878] flex flex-col justify-center px-12 text-white">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Shield className="h-10 w-10 mr-3" />
            <h1 className="text-4xl font-bold">ComplyHub.ai</h1>
          </div>
          
          <p className="text-xl mb-8 opacity-90">
            Powered By Vivacity Coaching and Consulting.<br />
            ComplyHub.ai is your complete compliance companion<br />
            for the 1 July 2025 changes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Simplify Compliance</h3>
              <p className="opacity-90">Track your progress using real-time checklists</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="opacity-90">Upload and organise all your evidence in one central place</p>
            </div>
          </div>

          <div className="flex items-start">
            <Bell className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Ahead</h3>
              <p className="opacity-90">Notified and alerts before anything slips through the cracks</p>
            </div>
          </div>
        </div>

        {/* Request Demo Button */}
        <div className="mt-8">
          <Button 
            onClick={handleRequestDemo}
            className="bg-[#01b0f1] hover:bg-[#0190c1] text-white px-8 py-3 text-lg"
            style={{ fontWeight: 500 }}
          >
            Request A Demo
          </Button>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription style={{ color: 'rgb(75, 85, 99)' }}>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#7130a0] to-[#ed1878] hover:from-[#5e2680] hover:to-[#cc1567] text-white" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>If you need access or an account for demo, please contact your organisation administrator.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
