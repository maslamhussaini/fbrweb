import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get tenant
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  // Stats
  const { data: invoices } = await supabase
    .from('invoices')
    .select('status, created_at')
    .eq('tenant_id', profile?.tenant_id)

  const total     = invoices?.length || 0
  const submitted = invoices?.filter(i => i.status === 'submitted').length || 0
  const failed    = invoices?.filter(i => ['failed', 'manual_review'].includes(i.status)).length || 0
  const pending   = invoices?.filter(i => ['pending', 'retry'].includes(i.status)).length || 0

  // Recent 5 invoices
  const { data: recent } = await supabase
    .from('invoices')
    .select('id, invoice_date, buyer_business_name, scenario_id, status, tracking_no, created_at')
    .eq('tenant_id', profile?.tenant_id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">FBR Digital Invoicing</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/dashboard" className="text-green-700 font-medium">Dashboard</Link>
          <Link href="/invoices" className="text-gray-500 hover:text-gray-900">Invoices</Link>
          {profile?.role === 'admin' && (
            <Link href="/admin" className="text-gray-500 hover:text-gray-900">Admin</Link>
          )}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Invoices"  value={total}     color="blue"   />
          <StatCard label="Submitted"       value={submitted} color="green"  sub="Successfully sent to FBR" />
          <StatCard label="Pending / Retry" value={pending}   color="yellow" />
          <StatCard label="Failed"          value={failed}    color="red"    sub="Need attention" />
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
            <Link href="/invoices" className="text-sm text-green-700 hover:underline">
              View all →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase">
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Buyer</th>
                <th className="px-5 py-3 text-left">Scenario</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Tracking No.</th>
              </tr>
            </thead>
            <tbody>
              {recent?.map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-600">{inv.invoice_date}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{inv.buyer_business_name}</td>
                  <td className="px-5 py-3 text-gray-500">{inv.scenario_id}</td>
                  <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    {inv.tracking_no || '—'}
                  </td>
                </tr>
              ))}
              {!recent?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    No invoices yet. Upload your first Excel file from the desktop app.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
