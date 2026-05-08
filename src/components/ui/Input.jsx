/**
 * Input + Label combo. Optional left icon and right-side slot.
 * Explicitly forwards only known DOM props to <input> to avoid React warnings.
 */
export default function Input(props) {
  const {
    id,
    label,
    type = 'text',
    iconLeft,
    rightSlot,
    hint,
    error,
    className = '',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    placeholder,
    name,
    autoComplete,
    autoFocus,
    disabled,
    readOnly,
    required,
    min,
    max,
    step,
    pattern,
    inputMode,
  } = props;

  const inputProps = {
    id, type, value, defaultValue, onChange, onBlur, onFocus, onKeyDown,
    placeholder, name, autoComplete, autoFocus, disabled, readOnly, required,
    min, max, step, pattern, inputMode,
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink-700 tracking-wide">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 bg-white border rounded-xl px-3.5 h-11 transition-all
          ${error ? 'border-rose-500' : 'border-paper-300 focus-within:border-brand-500 focus-within:shadow-ring'}`}
      >
        {iconLeft && <span className="text-ink-400 shrink-0">{iconLeft}</span>}
        <input
          {...inputProps}
          className="flex-1 bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-400"
        />
        {rightSlot}
      </div>
      {(hint || error) && (
        <span className={`text-xs ${error ? 'text-rose-500' : 'text-ink-500'}`}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
