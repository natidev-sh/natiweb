import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const LITELLM_API_URL = 'https://litellm-production-6380.up.railway.app/key/generate'
const LITELLM_MASTER_KEY = Deno.env.get('LITELLM_MASTER_KEY')

// Credit system constants
const CONVERSION_RATIO = 15
const DEFAULT_CREDITS = 300  
const DEFAULT_MAX_BUDGET = DEFAULT_CREDITS / CONVERSION_RATIO 

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

    const body = await req.json().catch(() => ({}))
    const metadata = body.metadata || { purpose: 'dev-pro', user_email: user.email }

    // Step 1: Register end user in LiteLLM first
    const endUserPayload = {
      user_id: user.id,
      max_budget: DEFAULT_MAX_BUDGET,
      budget_duration: "30d",
    }

    const endUserResponse = await fetch('https://litellm-production-6380.up.railway.app/end_user/new', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_MASTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(endUserPayload),
    })

    // Don't fail if user already exists (409 conflict is ok)
    if (!endUserResponse.ok && endUserResponse.status !== 409) {
      const errorData = await endUserResponse.json()
      console.error('Failed to register end user:', errorData)
      // Continue anyway - the user might already exist
    } else {
      console.log('End user registered successfully:', user.id)
    }

    // Step 2: Prepare the request payload for LiteLLM virtual key
    const liteLLMPayload = {
      max_budget: DEFAULT_MAX_BUDGET,  // Set budget limit (350 credits = $23.33)
      budget_duration: "30d",          // Reset every 30 days
      budget_id: "Pro",                // Link to Pro budget in LiteLLM
      user_id: user.id,                // Track user
      metadata: metadata,              // Additional metadata
    }

    const liteLLMResponse = await fetch(LITELLM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LITELLM_MASTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(liteLLMPayload),
    })

    if (!liteLLMResponse.ok) {
      const errorData = await liteLLMResponse.json()
      throw new Error(errorData.error || 'Failed to generate key from LiteLLM')
    }

    const keyData = await liteLLMResponse.json()

    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: user.id,
        api_key: keyData.key,
        key_info: keyData,
      })

    if (insertError) {
      throw insertError
    }

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