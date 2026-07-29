const variants = {
  primary: 'from-blue-500 to-cyan-400 text-white shadow-[0_12px_30px_rgba(59,130,246,0.35)]',
  secondary: 'from-slate-700 to-slate-600 text-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.25)]',
}

function ActionButton({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-2xl bg-gradient-to-r px-5 py-3 font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default ActionButton
