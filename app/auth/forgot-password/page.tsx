'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f1117'}}>
      <div style={{background:'#1a1d27', border:'1px solid #2d3148'}}
           className="rounded-2xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div style={{background:'#1a3a6b', color:'#4f8ef7'}}
               className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black">
            FBR
          </div>
        </div>

        {!sent ? (
          <>
            <h1 className="text-2xl font-bold mb-1 text-center" style={{color:'#f1f5f9'}}>
              Forgot Password
            </h1>
            <p className="text-sm text-center mb-8" style={{color:'#94a3b8'}}>
              Enter your email and we'll send a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}
                />
              </div>

              {error && (
                <p className="text-sm rounded-lg px-3 py-2"
                   style={{color:'#ef4444', background:'#450a0a', border:'1px solid #dc2626'}}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-bold text-white disabled:opacity-50"
                style={{background:'#4f8ef7'}}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{color:'#94a3b8'}}>
              Remember your password?{' '}
              <Link href="/login" style={{color:'#4f8ef7'}} className="hover:underline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#f1f5f9'}}>Check your email</h2>
            <p className="text-sm mb-2" style={{color:'#94a3b8'}}>
              We sent a password reset link to:
            </p>
            <p className="font-semibold mb-6" style={{color:'#4f8ef7'}}>{email}</p>
            <p className="text-xs mb-8" style={{color:'#475569'}}>
              Click the link in the email to reset your password.
              The link expires in 1 hour.
            </p>
            <Link
              href="/login"
              className="block w-full py-2.5 rounded-lg font-semibold text-center"
              style={{background:'#2a2d3a', color:'#f1f5f9', border:'1px solid #2d3148'}}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
