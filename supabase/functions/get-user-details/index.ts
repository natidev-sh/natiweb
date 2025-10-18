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
    // 1. Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get the current user and check if they are an admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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

    // 3. Get the target user ID from the request body
    const { userId } = await req.json();
    if (!userId) throw new Error('userId is required');

    // 4. Fetch all data for the target user using the service role client
    const [
      { data: authUser, error: authError },
      { data: profile, error: profileError },
      { data: apiKeys, error: keysError }
    ] = await Promise.all([
      serviceClient.auth.admin.getUserById(userId),
      serviceClient.from('profiles').select('*').eq('id', userId).single(),
      serviceClient.from('api_keys').select('*').eq('user_id', userId)
    ]);

    if (authError) throw authError;
    if (profileError) throw profileError;
    if (keysError) throw keysError;

    // 5. Combine and return the data
    const responseData = {
      authUser: authUser.user,
      profile,
      apiKeys,
    };

    return new Response(JSON.stringify(responseData), {
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