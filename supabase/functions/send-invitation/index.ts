
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  organisationId: string;
  organisationName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, organisationId, organisationName }: InvitationRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Get the current user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Generate unique invite token
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email,
        organisation_id: organisationId,
        invited_by: userData.user.id,
        invite_token: inviteToken,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (inviteError) {
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    // Create the invitation URL
    const baseUrl = req.headers.get("origin") || "https://your-app.com";
    const invitationUrl = `${baseUrl}/accept-invitation?token=${inviteToken}`;

    // For now, we'll just return the invitation URL
    // In production, you would send an email here using a service like Resend
    console.log(`Invitation created for ${email}. URL: ${invitationUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitationUrl,
        message: "Invitation created successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
