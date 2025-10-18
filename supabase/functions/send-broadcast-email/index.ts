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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized');

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is admin
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || profile?.role !== 'admin') {
      throw new Error('Forbidden: Admins only');
    }

    const { subject, content, recipientGroup } = await req.json();
    if (!subject || !content || !recipientGroup) {
      throw new Error('Missing required fields: subject, content, recipientGroup');
    }

    // Fetch Resend API key
    const { data: integration, error: keyError } = await serviceClient
      .from('service_integrations')
      .select('api_key')
      .eq('service_name', 'resend')
      .single();

    if (keyError || !integration?.api_key) {
      throw new Error('Resend API key not configured in integrations.');
    }
    const resendApiKey = integration.api_key;

    // Fetch recipient emails
    let recipients = [];
    if (recipientGroup === 'waitlist') {
      const { data, error } = await serviceClient.from('waitlist').select('email');
      if (error) throw error;
      recipients = data.map(r => r.email);
    } else if (recipientGroup === 'all_users') {
      const { data: usersData, error: usersError } = await serviceClient.auth.admin.listUsers({ page: 1, perPage: 1000 }); // Note: limited to 1000 users for now
      if (usersError) throw usersError;
      recipients = usersData.users.map(u => u.email).filter(Boolean);
    } else {
      throw new Error('Invalid recipient group');
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ message: 'No recipients found for this group.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Log the email broadcast attempt
    const { data: emailLog, error: logError } = await serviceClient
      .from('marketing_emails')
      .insert({ subject, content, recipient_group: recipientGroup, status: 'sending', sent_by: user.id })
      .select()
      .single();

    if (logError) throw logError;

    // Send emails via Resend Batch API
    const resendPayload = recipients.map(email => ({
      from: 'Nati.dev <onboarding@resend.dev>', // IMPORTANT: Change this to your verified domain in Resend
      to: [email],
      subject: subject,
      html: content,
    }));

    const resendResponse = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(resendPayload),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      await serviceClient.from('marketing_emails').update({ status: 'failed' }).eq('id', emailLog.id);
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    // Update log to 'sent'
    await serviceClient.from('marketing_emails').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', emailLog.id);

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${recipients.length} recipients.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});