/**
 * Tiny inline SVG icon set. Keeps deps low and lets us color them via currentColor.
 * Usage: <Icon name="wallet" className="w-5 h-5 text-ink-500" />
 */
export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.75 }) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
  };
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>;
    case 'money':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9 8h6.5"/><path d="M9 10.5h6.5"/><path d="M9 13h2.5a2.5 2.5 0 0 0 0-5"/><path d="m9.5 13 4.5 4"/></svg>;
    case 'wallet':
      return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3"/><path d="M21 12h-4a2 2 0 1 0 0 4h4z"/></svg>;
    case 'chart':
      return <svg {...common}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>;
    case 'tag':
      return <svg {...common}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="8" cy="8" r="1.2"/></svg>;
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell':
      return <svg {...common}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'menu':
      return <svg {...common}><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>;
    case 'x':
      return <svg {...common}><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>;
    case 'logout':
      return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
    case 'eye':
      return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'eye-off':
      return <svg {...common}><path d="M3 3l18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.1"/><path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10.6 10.6 0 0 0 5.4-1.4"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>;
    case 'arrow-up':
      return <svg {...common}><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>;
    case 'arrow-down':
      return <svg {...common}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
    case 'utensils':
      return <svg {...common}><path d="M4 3v8a3 3 0 0 0 6 0V3"/><path d="M7 11v10"/><path d="M17 3c-2 0-3 2-3 5s1 5 3 5v8"/></svg>;
    case 'car':
      return <svg {...common}><path d="M5 17h14"/><path d="M5 17v-4l2-5h10l2 5v4"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>;
    case 'bag':
      return <svg {...common}><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>;
    case 'bolt':
      return <svg {...common}><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>;
    case 'heart':
      return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case 'film':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 4v16"/><path d="M16 4v16"/></svg>;
    case 'calendar':
      return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>;
    case 'check':
      return <svg {...common}><path d="m5 12 5 5 9-11"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
