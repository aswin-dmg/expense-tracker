import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Icon from '../components/ui/Icon.jsx';
import { supabase } from '../lib/supabase.js';

export default function Login({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
    if (password.length < 6) errs.password = 'Min 6 characters';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setErrors({ password: error.message });
      return;
    }
    onLogin(data.user);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to view your spending."
      footer={
        <>
          New to Track It?{' '}
          <button onClick={onGoSignup} className="text-brand-600 font-medium hover:text-brand-700">
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          id="password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-ink-700 select-none">
            <input type="checkbox" className="accent-ink-900" />
            Remember me
          </label>
          <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  );
}