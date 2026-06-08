'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [ready, setReady]         = useState(false)
  const [success, setSuccess]     = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle the recovery token from URL
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken  = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type         = params.get('type')

      if (type === 'recovery' && accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken
        }).then(({ error }) => {
          if (error) {
            setError('Invalid or expired reset link. Request a new one.')
          } else {
            setReady(true)
          }
        })
      } else {
        setError('Invalid reset link. Please request a new password reset.')
      }
    } else {
      // Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setReady(true)
        else setError('Invalid reset link. Please request a new password reset.')
      })
    }
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
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

        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#22c55e'}}>Password Updated!</h2>
            <p className="text-sm" style={{color:'#94a3b8'}}>
              Redirecting to dashboard...
            </p>
          </div>

        ) : !ready && error ? (
          <div className="text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#ef4444'}}>Invalid Link</h2>
            <p className="text-sm mb-6" style={{color:'#94a3b8'}}>{error}</p>
            <button
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full py-2.5 rounded-lg font-semibold text-white"
              style={{background:'#4f8ef7'}}>
              Request New Reset Link
            </button>
          </div>

        ) : (
          <>
            <h1 className="text-2xl font-bold mb-1 text-center" style={{color:'#f1f5f9'}}>
              Reset Password
            </h1>
            <p className="text-sm text-center mb-8" style={{color:'#94a3b8'}}>
              Enter your new password below
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{color:'#94a3b8'}}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{background:'#2a2d3a', border:'1px solid #2d3148', color:'#f1f5f9'}}
                />
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full" style={{
                        background: password.length >= i * 2
                          ? i <= 2 ? '#ef4444' : i === 3 ? '#f59e0b' : '#22c55e'
                          : '#2d3148'
                      }}/>
                    ))}
                  </div>
                  <p className="text-xs" style={{color:'#475569'}}>
                    {password.length < 4 ? 'Too short' :
                     password.length < 6 ? 'Weak' :
                     password.length < 8 ? 'Fair' : 'Strong'}
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm rounded-lg px-3 py-2"
                   style={{color:'#ef4444', background:'#450a0a', border:'1px solid #dc2626'}}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !ready}
                className="w-full py-2.5 rounded-lg font-bold text-white disabled:opacity-50"
                style={{background:'#4f8ef7'}}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
