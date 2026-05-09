import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Icon from '../components/ui/Icon.jsx';
import { supabase } from '../lib/supabase.js';

export default function Signup({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validatePassword = (p) => {
    if (p.length < 8) return 'Min 8 characters';
    if (!/[A-Z]/.test(p)) return 'Must include at least one uppercase letter';
    if (!/[0-9]/.test(p)) return 'Must include at least one number';
    if (!/[^A-Za-z0-9]/.test(p)) return 'Must include at least one special character';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    const pwError = validatePassword(form.password);
    if (pwError) errs.password = pwError;
    if (!accept) errs.accept = 'You must accept the terms';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);

    if (error) {
      setErrors({ email: error.message });
      return;
    }

    // Show email confirmation message instead of going to dashboard
    if (data?.user && !data?.session) {
      setEmailSent(true);
      return;
    }

    onSignup(data.user);
  };

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  // Email confirmation sent screen
  if (emailSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We sent a confirmation link to your inbox."
        footer={
          <>
            Already confirmed?{' '}
            <button onClick={onGoLogin} className="text-brand-600 font-medium hover:text-brand-700">
              Log in
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm text-ink-700">
              We sent a confirmation email to{' '}
              <span className="font-semibold text-ink-900">{form.email}</span>
            </p>
            <p className="text-xs text-ink-500 mt-2">
              Click the link in the email to activate your account. Check your spam folder if you don't see it.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="w-full mt-2"
            onClick={onGoLogin}
          >
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking expenses in under a minute."
      footer={
        <>
          Already have one?{' '}
          <button onClick={onGoLogin} className="text-brand-600 font-medium hover:text-brand-700">
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input id="name" label="Full name" placeholder="Alex Morgan"
          value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
        <Input id="email" label="Email" type="email" placeholder="you@example.com"
          value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
        <div>
          <Input
            id="password"
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Min 8 chars, uppercase, number, symbol"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-ink-400 hover:text-ink-700"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPw ? 'eye-off' : 'eye'} className="w-4 h-4" />
              </button>
            }
          />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-paper-200 rounded-full overflow-hidden flex gap-0.5">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`flex-1 ${
                    i <= strength
                      ? strength <= 2 ? 'bg-rose-500' : strength === 3 ? 'bg-brand-500' : 'bg-sage-500'
                      : 'bg-paper-200'
                  }`} />
                ))}
              </div>
              <span className="text-[11px] text-ink-500 w-12 text-right">{strengthLabel}</span>
            </div>
          )}
          {/* Password requirements hint */}
          <div className="mt-2 grid grid-cols-2 gap-1">
            {[
              { label: '8+ characters', ok: form.password.length >= 8 },
              { label: 'Uppercase letter', ok: /[A-Z]/.test(form.password) },
              { label: 'Number', ok: /[0-9]/.test(form.password) },
              { label: 'Special character', ok: /[^A-Za-z0-9]/.test(form.password) },
            ].map(({ label, ok }) => (
              <div key={label} className={`flex items-center gap-1 text-[11px] ${ok ? 'text-sage-600' : 'text-ink-400'}`}>
                <span>{ok ? '✓' : '○'}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-ink-700 select-none">
          <input type="checkbox" className="accent-ink-900 mt-0.5"
            checked={accept} onChange={(e) => setAccept(e.target.checked)} />
          <span>I agree to the <span className="text-brand-600">Terms of Service</span> and{' '}
            <span className="text-brand-600">Privacy Policy</span>.</span>
        </label>
        {errors.accept && <span className="text-xs text-rose-500 -mt-2">{errors.accept}</span>}

        <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}