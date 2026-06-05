import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Only admin role can access
  if (profile?.role !== 'admin') redirect('/dashboard')

  // All tenants
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name, ntn_cnic, plan, is_active, created_at')
    .order('created_at', { ascending: false })

  // Invoice counts per tenant
  const { data: counts } = await supabase
    .from('invoices')
    .select('tenant_id, status')

  const countMap: Record<string, { total: number; submitted: number; failed: number }> = {}
  counts?.forEach(inv => {
    if (!countMap[inv.tenant_id]) {
      countMap[inv.tenant_id] = { total: 0, submitted: 0, failed: 0 }
    }
    countMap[inv.tenant_id].total++
    if (inv.status === 'submitted') countMap[inv.tenant_id].submitted++
    if (['failed', 'manual_review'].includes(inv.status)) countMap[inv.tenant_id].failed++
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Clients
          <span className="text-base font-normal text-gray-400 ml-2">({tenants?.length || 0})</span>
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="px-4 py-3 text-left">Business Name</th>
                <th className="px-4 py-3 text-left">NTN/CNIC</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Submitted</th>
                <th className="px-4 py-3 text-right">Failed</th>
                <th className="px-4 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenants?.map(t => {
                const c = countMap[t.id] || { total: 0, submitted: 0, failed: 0 }
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.ntn_cnic}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded capitalize">
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.is_active ? 'submitted' : 'failed'} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{c.total}</td>
                    <td className="px-4 py-3 text-right text-green-700">{c.submitted}</td>
                    <td className="px-4 py-3 text-right text-red-600">{c.failed}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
