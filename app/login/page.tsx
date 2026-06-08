'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password'
        : error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f1117'}}>
      <div style={{background:'#1a1d27', border:'1px solid #2d3148'}}
           className="rounded-2xl p-10 w-full max-w-md shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div style={{background:'#1a3a6b', color:'#4f8ef7'}}
               className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black">
            FBR
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{color:'#f1f5f9'}}>
          Welcome back
        </h1>
        <p className="text-sm text-center mb-8" style={{color:'#94a3b8'}}>
          Sign in to FBR Digital Invoicing
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium" style={{color:'#94a3b8'}}>Password</label>
              <Link href="/auth/forgot-password"
                    className="text-xs hover:underline"
                    style={{color:'#4f8ef7'}}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}
            />
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2"
               style={{color:'#ef4444', background:'#450a0a', border:'1px solid #7f1d1d'}}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-bold text-white disabled:opacity-50 mt-2"
            style={{background:'#4f8ef7'}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{background:'#2d3148'}}/>
          <span className="text-xs" style={{color:'#475569'}}>OR</span>
          <div className="flex-1 h-px" style={{background:'#2d3148'}}/>
        </div>

        <p className="text-center text-sm" style={{color:'#94a3b8'}}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{color:'#4f8ef7'}} className="font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
