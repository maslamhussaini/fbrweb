import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'

export default async function InvoicesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      id, invoice_date, buyer_ntn_cnic, buyer_business_name,
      scenario_id, status, tracking_no, attempts,
      error_msg, created_at
    `)
    .eq('tenant_id', profile?.tenant_id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">FBR Digital Invoicing</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
          <Link href="/invoices" className="text-green-700 font-medium">Invoices</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Invoices
            <span className="text-base font-normal text-gray-400 ml-2">
              ({invoices?.length || 0})
            </span>
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase bg-gray-50">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Buyer NTN</th>
                <th className="px-4 py-3 text-left">Buyer Name</th>
                <th className="px-4 py-3 text-left">Scenario</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tracking No.</th>
                <th className="px-4 py-3 text-left">Attempts</th>
                <th className="px-4 py-3 text-left">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices?.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{inv.invoice_date}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{inv.buyer_ntn_cnic}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.buyer_business_name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-mono">
                      {inv.scenario_id}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-green-700 font-medium">
                    {inv.tracking_no || '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{inv.attempts}</td>
                  <td className="px-4 py-3 text-xs text-red-600 max-w-xs truncate">
                    {inv.error_msg || '—'}
                  </td>
                </tr>
              ))}
              {!invoices?.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    No invoices found.
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
