import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const LITELLM_API_URL = 'https://litellm-production-6380.up.railway.app/user/info'
const LITELLM_MASTER_KEY = Deno.env.get('LITELLM_MASTER_KEY')

// Credit system constants - matches desktop app
const CONVERSION_RATIO = 15  // $1 in LiteLLM = 15 credits

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 })
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

    // Get user's API key from database
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('api_keys')
      .select('api_key')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (apiKeyError || !apiKeyData) {
      return new Response(JSON.stringify({ 
        error: 'No API key found. Please generate one first.',
        hasKey: false
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch credit info from LiteLLM
    const liteLLMResponse = await fetch(LITELLM_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKeyData.api_key}`,
        'Content-Type': 'application/json',
      },
    })

    if (!liteLLMResponse.ok) {
      const errorData = await liteLLMResponse.json()
      throw new Error(errorData.error || 'Failed to fetch credit info from LiteLLM')
    }

    const creditData = await liteLLMResponse.json()
    const userInfo = creditData.user_info

    // Convert LiteLLM dollars to credits (matching desktop app)
    const response = {
      usedCredits: Math.round(userInfo.spend * CONVERSION_RATIO),
      totalCredits: Math.round(userInfo.max_budget * CONVERSION_RATIO),
      remainingCredits: Math.round((userInfo.max_budget - userInfo.spend) * CONVERSION_RATIO),
      budgetResetDate: userInfo.budget_reset_at,
      hasKey: true
    }

    return new Response(JSON.stringify(response), {
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
