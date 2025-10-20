require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
}

// Postgres (Neon) connection - Optional
// If DATABASE_URL is not set, we'll use Supabase for everything
let pool = null
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
  })

  async function ensureSchema() {
    await pool.query(`
      create table if not exists users (
        email text primary key,
        password_hash text not null,
        created_at timestamptz not null default now()
      );
    `)
  }
  ensureSchema().catch(err => {
    console.error('Failed to initialize database schema:', err)
  })
} else {
  console.log('DATABASE_URL not set - using Supabase for auth')
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.verify(token, secret)
}

app.post('/api/auth/signup', async (req, res) => {
  if (!pool) {
    return res.status(501).json({ error: 'Database not configured. Using Supabase for auth.' })
  }
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const existing = await pool.query('select email from users where email=$1', [email])
    if (existing.rowCount > 0) return res.status(409).json({ error: 'user already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    await pool.query('insert into users(email, password_hash) values($1,$2)', [email, passwordHash])
    const token = signToken({ sub: email })
    res.json({ token, user: { email } })
  } catch (e) {
    res.status(500).json({ error: 'signup_failed', detail: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  if (!pool) {
    return res.status(501).json({ error: 'Database not configured. Using Supabase for auth.' })
  }
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
    const result = await pool.query('select email, password_hash from users where email=$1', [email])
    if (result.rowCount === 0) return res.status(401).json({ error: 'invalid_credentials' })
    const { password_hash } = result.rows[0]
    const ok = await bcrypt.compare(password, password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
    const token = signToken({ sub: email })
    res.json({ token, user: { email } })
  } catch (e) {
    res.status(500).json({ error: 'login_failed', detail: e.message })
  }
})

app.get('/api/auth/me', (req, res) => {
  try {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    if (!token) return res.status(401).json({ error: 'missing_token' })
    const payload = verifyToken(token)
    const email = payload.sub
    res.json({ user: { email } })
  } catch (e) {
    res.status(401).json({ error: 'invalid_token', detail: e.message })
  }
})

app.post('/api/key/generate', async (req, res) => {
  try {
    const masterKey = process.env.LITELLM_MASTER_KEY
    if (!masterKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing LITELLM_MASTER_KEY' })
    }

    // Credit system constants (matches desktop app)
    const CONVERSION_RATIO = 15
    const DEFAULT_CREDITS = 350  
    const DEFAULT_MAX_BUDGET = DEFAULT_CREDITS / CONVERSION_RATIO 

    const metadata = req.body?.metadata || { purpose: 'dev-pro' }
    
    // Prepare payload with budget limits
    const body = {
      max_budget: DEFAULT_MAX_BUDGET,  // Set budget limit (350 credits = $23.33)
      budget_duration: "30d",          // Reset every 30 days
      budget_id: "Pro",                // Link to Pro budget in LiteLLM
      user_id: req.body?.user_id,      // Track user if provided
      metadata: metadata,              // Additional metadata
    }

    const upstream = await axios.post(
      'https://litellm-production-6380.up.railway.app/key/generate',
      body,
      { headers: { Authorization: `Bearer ${masterKey}`, 'Content-Type': 'application/json' } }
    )

    res.status(upstream.status).json(upstream.data)
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data)
    } else {
      res.status(500).json({ error: 'Upstream error', detail: err.message })
    }
  }
})

// Serve built frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html')
  res.sendFile(indexPath, err => {
    if (err) res.status(404).end()
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
