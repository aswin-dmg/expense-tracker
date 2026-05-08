/**
 * Reusable Button.
 * Variants: primary | secondary | ghost | brand | danger
 * Sizes:    sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  iconLeft,
  iconRight,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 ' +
    'focus:outline-none focus-visible:shadow-ring active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:   'bg-ink-900 text-paper-50 hover:bg-ink-700 shadow-soft',
    secondary: 'bg-paper-100 text-ink-900 border border-paper-300 hover:bg-paper-200',
    ghost:     'text-ink-700 hover:bg-paper-200',
    brand:     'bg-brand-500 text-white hover:bg-brand-600 shadow-soft',
    danger:    'bg-rose-500 text-white hover:opacity-90 shadow-soft',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-[15px] px-5 py-2.5 h-12',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
