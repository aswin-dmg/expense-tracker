import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { supabase } from '../lib/supabase.js';

export default function Signup({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
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
          <Input id="password" label="Password" type="password" placeholder="At least 8 characters"
            value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
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