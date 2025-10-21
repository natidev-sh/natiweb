import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const LITELLM_API_URL = 'https://litellm-production-6380.up.railway.app/user/info'

// Credit system constants - matches desktop app
const CONVERSION_RATIO = 15  // $1 in LiteLLM = 15 credits

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-nati-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 })
  }

  try {
    console.log('Starting get-user-credits-desktop function')
    
    // Get the API key from the request body or header
    const { apiKey } = await req.json()
    const apiKeyFromHeader = req.headers.get('x-nati-api-key')
    const userApiKey = apiKey || apiKeyFromHeader
    
    if (!userApiKey) {
      console.error('No API key provided')
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Fetching credit info from LiteLLM for key:', userApiKey.substring(0, 10) + '...')
    
    // Fetch credit info from LiteLLM using the user's API key
    const liteLLMResponse = await fetch(LITELLM_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!liteLLMResponse.ok) {
      const errorData = await liteLLMResponse.json().catch(() => ({ error: 'Unknown error' }))
      console.error('LiteLLM error response:', errorData)
      throw new Error(errorData.error || 'Failed to fetch credit info from LiteLLM')
    }

    const creditData = await liteLLMResponse.json()
    console.log('LiteLLM response:', JSON.stringify(creditData, null, 2))
    
    // LiteLLM returns budget data in the keys array
    const keys = creditData.keys || []
    const firstKey = keys.find((k: any) => k.token === userApiKey) || keys[0]
    
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
      budgetResetDate: budgetResetAt,
    }

    console.log('Returning credit data:', response)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in get-user-credits-desktop:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      details: error.toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
