/**
 * Card — soft-shadowed container with consistent radius + padding.
 */
export default function Card({
  children,
  className = '',
  as: As = 'div',
  padded = true,
  ...rest
}) {
  return (
    <As
      className={`bg-white border border-paper-200 rounded-xl2 shadow-soft ${
        padded ? 'p-5 md:p-6' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
