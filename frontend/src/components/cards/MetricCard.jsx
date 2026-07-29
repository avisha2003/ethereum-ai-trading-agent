function MetricCard({ title, value, detail, accent = 'blue' }) {
  const accentClasses = {
    blue: 'from-blue-500/20 to-cyan-500/10 text-blue-200',
    green: 'from-emerald-500/20 to-green-500/10 text-emerald-200',
    red: 'from-rose-500/20 to-orange-500/10 text-rose-200',
  }

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accentClasses[accent]} p-4 backdrop-blur-xl`}>
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  )
}

export default MetricCard
