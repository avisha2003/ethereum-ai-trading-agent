function StatusBadge({ label, value, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'border-slate-700/70 bg-slate-900/60 text-slate-200',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    danger: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  }

  return (
    <div className={`rounded-full border px-3 py-1 text-sm ${toneClasses[tone]}`}>
      <span className="mr-2 text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default StatusBadge
