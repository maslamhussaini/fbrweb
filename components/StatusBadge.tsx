const STATUS_STYLES: Record<string, string> = {
  submitted:     'bg-green-100 text-green-800',
  pending:       'bg-yellow-100 text-yellow-800',
  retry:         'bg-yellow-100 text-yellow-800',
  failed:        'bg-red-100 text-red-800',
  manual_review: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}
