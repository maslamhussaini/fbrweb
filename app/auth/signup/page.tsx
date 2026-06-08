'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` }
    })
    setLoading(false)

    if (error) {
      setError(error.message.includes('already registered')
        ? 'Email already registered — sign in instead'
        : error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f1117'}}>
      <div style={{background:'#1a1d27', border:'1px solid #2d3148'}}
           className="rounded-2xl p-10 w-full max-w-md text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2" style={{color:'#f1f5f9'}}>Check your email</h2>
        <p className="text-sm mb-2" style={{color:'#94a3b8'}}>We sent a confirmation link to:</p>
        <p className="font-semibold mb-6" style={{color:'#4f8ef7'}}>{email}</p>
        <p className="text-xs mb-8" style={{color:'#475569'}}>
          Click the link in the email to confirm your account.<br/>
          Check your spam folder if you don't see it.
        </p>
        <Link href="/login"
              className="block w-full py-2.5 rounded-lg font-semibold text-center"
              style={{background:'#2a2d3a', color:'#f1f5f9', border:'1px solid #2d3148'}}>
          Back to Login
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f1117'}}>
      <div style={{background:'#1a1d27', border:'1px solid #2d3148'}}
           className="rounded-2xl p-10 w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div style={{background:'#1a3a6b', color:'#4f8ef7'}}
               className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black">
            FBR
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{color:'#f1f5f9'}}>
          Create account
        </h1>
        <p className="text-sm text-center mb-8" style={{color:'#94a3b8'}}>
          Register for FBR Digital Invoicing
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com" required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters" required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password" required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}/>
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2"
               style={{color:'#ef4444', background:'#450a0a', border:'1px solid #7f1d1d'}}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg font-bold text-white disabled:opacity-50"
            style={{background:'#4f8ef7'}}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{color:'#94a3b8'}}>
          Already have an account?{' '}
          <Link href="/login" style={{color:'#4f8ef7'}} className="font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
