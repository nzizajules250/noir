export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-zinc-400 hover:text-white',
  }

  return <button type={type} className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold transition ${variants[variant]} ${className}`} {...props}>{children}</button>
}
