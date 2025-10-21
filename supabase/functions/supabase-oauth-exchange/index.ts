import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const SUPABASE_CLIENT_ID = '39a0b2e0-9063-4838-b03d-c81a7481a621'
const SUPABASE_CLIENT_SECRET = Deno.env.get('NATI_SUPABASE_CLIENT_SECRET')
const REDIRECT_URI = 'https://natiweb.vercel.app/supabase-oauth/callback'

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
    console.log('Starting token exchange...')
    
    if (!SUPABASE_CLIENT_SECRET) {
      console.error('NATI_SUPABASE_CLIENT_SECRET is not set!')
      throw new Error('NATI_SUPABASE_CLIENT_SECRET not configured')
    }
    
    console.log('Environment variable found, client secret length:', SUPABASE_CLIENT_SECRET.length)

    const { code } = await req.json()
    console.log('Received authorization code:', code ? 'YES' : 'NO')
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'Authorization code is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.supabase.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SUPABASE_CLIENT_ID,
        client_secret: SUPABASE_CLIENT_SECRET,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Supabase token exchange failed:', errorData)
      throw new Error(`Failed to exchange code: ${tokenResponse.status} ${errorData}`)
    }

    const tokenData = await tokenResponse.json()
    
    return new Response(JSON.stringify({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('OAuth exchange error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to exchange authorization code' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
