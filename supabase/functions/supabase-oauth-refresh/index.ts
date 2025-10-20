import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const SUPABASE_CLIENT_ID = '39a0b2e0-9063-4838-b03d-c81a7481a621'
const SUPABASE_CLIENT_SECRET = Deno.env.get('NATI_SUPABASE_CLIENT_SECRET')

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
    if (!SUPABASE_CLIENT_SECRET) {
      throw new Error('NATI_SUPABASE_CLIENT_SECRET not configured')
    }

    const { refreshToken } = await req.json()
    
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'Refresh token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Refreshing Supabase access token...')

    // Refresh the access token using the refresh token
    const tokenResponse = await fetch('https://api.supabase.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: SUPABASE_CLIENT_ID,
        client_secret: SUPABASE_CLIENT_SECRET,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Supabase token refresh failed:', errorData)
      throw new Error(`Failed to refresh token: ${tokenResponse.status} ${errorData}`)
    }

    const tokenData = await tokenResponse.json()
    
    console.log('Token refreshed successfully')
    
    return new Response(JSON.stringify({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to refresh access token' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
