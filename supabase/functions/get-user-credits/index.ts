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
    console.log('Starting get-user-credits function')
    
    if (!LITELLM_MASTER_KEY) {
      console.error('LITELLM_MASTER_KEY not found in environment')
      throw new Error('Missing LITELLM_MASTER_KEY environment variable.')
    }

    console.log('Creating Supabase client')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    console.log('Getting authenticated user')
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      console.error('No authenticated user found')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    console.log('User authenticated:', user.id)

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

    console.log('Fetching credit info from LiteLLM for key:', apiKeyData.api_key.substring(0, 10) + '...')
    
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
      console.error('LiteLLM error response:', errorData)
      throw new Error(errorData.error || 'Failed to fetch credit info from LiteLLM')
    }

    const creditData = await liteLLMResponse.json()
    console.log('LiteLLM response:', JSON.stringify(creditData, null, 2))
    
    // LiteLLM returns budget data in the keys array, not user_info
    const keys = creditData.keys || []
    const firstKey = keys.find((k: any) => k.token === apiKeyData.api_key) || keys[0]
    
    if (!firstKey) {
      throw new Error('No key data found in LiteLLM response')
    }
    
    // Get data from the key object
    const maxBudget = firstKey.max_budget ?? 0
    const spend = firstKey.spend ?? 0
    const budgetResetAt = firstKey.budget_reset_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    console.log('Parsed values:', { maxBudget, spend, budgetResetAt })

    // Convert LiteLLM dollars to credits (matching desktop app)
    const response = {
      usedCredits: Math.round(spend * CONVERSION_RATIO),
      totalCredits: Math.round(maxBudget * CONVERSION_RATIO),
      remainingCredits: Math.round((maxBudget - spend) * CONVERSION_RATIO),
      budgetResetDate: budgetResetAt,
      hasKey: true
    }

    console.log('Returning credit data:', response)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in get-user-credits:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      details: error.toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
