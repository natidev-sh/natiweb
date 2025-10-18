import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const LITELLM_API_URL = 'https://litellm-production-6380.up.railway.app/key/info'
const LITELLM_MASTER_KEY = Deno.env.get('LITELLM_MASTER_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!LITELLM_MASTER_KEY) {
      throw new Error('Missing LITELLM_MASTER_KEY environment variable.')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { keys } = await req.json()
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return new Response(JSON.stringify({ error: '`keys` array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: ownedKeys, error: verificationError } = await serviceClient
      .from('api_keys')
      .select('api_key')
      .eq('user_id', user.id)
      .in('api_key', keys)

    if (verificationError) {
      throw verificationError
    }

    const ownedKeyStrings = ownedKeys.map(k => k.api_key);
    const keysToFetch = keys.filter(key => ownedKeyStrings.includes(key));

    if (keysToFetch.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const liteLLMResponse = await fetch(LITELLM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_MASTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys: keysToFetch }),
    })

    if (!liteLLMResponse.ok) {
      const errorData = await liteLLMResponse.json()
      // FIX: Changed errorData.detail to errorData.error for consistency
      throw new Error(errorData.error || 'Failed to get key info from LiteLLM')
    }

    const keyData = await liteLLMResponse.json()

    return new Response(JSON.stringify(keyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})