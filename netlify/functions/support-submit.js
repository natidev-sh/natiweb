import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
)

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    const {
      subject,
      description,
      category = 'other',
      priority = 'medium',
      source = 'web',
      desktopLogsUrl,
      systemInfo
    } = body

    // Validate required fields
    if (!subject || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields: subject and description are required' 
        })
      }
    }

    // Get user from auth token if provided
    const authHeader = event.headers.authorization
    let userId = null
    let userEmail = null
    let userName = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (!error && user) {
          userId = user.id
          userEmail = user.email
          userName = user.user_metadata?.full_name || user.email
        }
      } catch (err) {
        console.error('Error getting user from token:', err)
        // Continue without user - allow anonymous tickets
      }
    }

    // Create the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        user_email: userEmail || body.email, // Allow email from body for anonymous submissions
        user_name: userName || body.name,
        subject,
        description,
        category,
        priority,
        source,
        desktop_logs_url: desktopLogsUrl,
        system_info: systemInfo,
        status: 'open'
      })
      .select()
      .single()

    if (ticketError) {
      console.error('Error creating ticket:', ticketError)
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to create support ticket',
          details: ticketError.message
        })
      }
    }

    // Send notification email to support team (optional)
    // You can integrate with SendGrid, Resend, etc. here

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        ticket_number: ticket.ticket_number,
        ticket_id: ticket.id,
        message: 'Support ticket created successfully'
      })
    }
  } catch (error) {
    console.error('Support ticket submission error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    }
  }
}
