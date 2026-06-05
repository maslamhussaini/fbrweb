export function StatCard({
  label, value, sub, color = 'blue'
}: {
  label: string
  value: string | number
  sub?: string
  color?: 'blue' | 'green' | 'red' | 'yellow'
}) {
  const colors = {
    blue:   'border-blue-200 bg-blue-50',
    green:  'border-green-200 bg-green-50',
    red:    'border-red-200 bg-red-50',
    yellow: 'border-yellow-200 bg-yellow-50',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
