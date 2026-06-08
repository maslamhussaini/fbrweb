'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router  = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 2500)
        }
        if (event === 'TOKEN_REFRESHED') {
          setStatus('success')
        }
      }
    )

    // Handle the token from URL hash
    const handleConfirm = async () => {
      const hash = window.location.hash
      if (hash) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken  = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type         = params.get('type')
        const errorDesc    = params.get('error_description')

        if (errorDesc) {
          setStatus('error')
          setMessage(decodeURIComponent(errorDesc.replace(/\+/g, ' ')))
          return
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token:  accessToken,
            refresh_token: refreshToken
          })
          if (error) {
            setStatus('error')
            setMessage(error.message)
          } else {
            setStatus('success')
            setTimeout(() => router.push('/dashboard'), 2500)
          }
        }
      } else {
        // Check if already logged in
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('error')
          setMessage('No confirmation token found. Check your email link.')
        }
      }
    }

    handleConfirm()
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0f1117'}}>
      <div style={{background:'#1a1d27', border:'1px solid #2d3148'}}
           className="rounded-2xl p-10 w-full max-w-md text-center">

        {/* FBR Logo */}
        <div className="flex justify-center mb-6">
          <div style={{background:'#1a3a6b', color:'#4f8ef7'}}
               className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black">
            FBR
          </div>
        </div>

        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#f1f5f9'}}>
              Confirming your account...
            </h2>
            <p style={{color:'#94a3b8'}} className="text-sm">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#22c55e'}}>
              Email Confirmed!
            </h2>
            <p style={{color:'#94a3b8'}} className="text-sm mb-6">
              Your account is verified. Redirecting to dashboard...
            </p>
            <div className="w-full rounded-full h-1" style={{background:'#2d3148'}}>
              <div className="h-1 rounded-full animate-pulse" style={{background:'#22c55e', width:'100%'}}/>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2" style={{color:'#ef4444'}}>
              Confirmation Failed
            </h2>
            <p style={{color:'#94a3b8'}} className="text-sm mb-6">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-2.5 rounded-lg font-semibold text-white"
              style={{background:'#4f8ef7'}}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
