import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Auth check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Admin check
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { data: adminProfile, error: adminError } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (adminError || adminProfile?.role !== 'admin') {
      throw new Error('Forbidden: Admins only');
    }

    // Get params
    const { userId, action, durationDays } = await req.json();
    if (!userId || !action) throw new Error('userId and action are required');
    if (userId === user.id) throw new Error("Admins cannot change their own status.");

    let banned_until;
    switch (action) {
      case 'ban':
        banned_until = '9999-12-31T23:59:59Z'; // Effectively permanent
        break;
      case 'suspend':
        const days = Number(durationDays) || 7; // Default to 7 days
        banned_until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'unban':
        banned_until = 'none'; // Use 'none' to explicitly lift the ban
        break;
      default:
        throw new Error('Invalid action specified.');
    }

    // Update user
    const { data: updatedUserData, error: updateError } = await serviceClient.auth.admin.updateUserById(
      userId,
      { banned_until }
    );

    if (updateError) throw updateError;

    return new Response(JSON.stringify(updatedUserData.user), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})