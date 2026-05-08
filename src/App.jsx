import { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { supabase } from './lib/supabase.js';

export default function App() {
  const [route, setRoute] = useState('login');
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [error, setError] = useState(null);

  // Restore session on page load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthed(true);
        setRoute('dashboard');
      }
    });
  }, []);

  // Fetch expenses when authed
  useEffect(() => {
    if (!isAuthed) return;
    const fetchExpenses = async () => {
      setLoadingExpenses(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('Expenses')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setExpenses(data ?? []);
      } catch (err) {
        setError('Failed to load expenses. Please try again.');
        console.error(err);
      } finally {
        setLoadingExpenses(false);
      }
    };
    fetchExpenses();
  }, [isAuthed]);

  const handleLogin = (user) => { setUser(user); setIsAuthed(true); setRoute('dashboard'); };
  const handleSignup = (user) => { setUser(user); setIsAuthed(true); setRoute('dashboard'); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthed(false);
    setUser(null);
    setRoute('login');
    setExpenses([]);
  };

  const addExpense = async (expense) => {
    const { data, error } = await supabase
      .from('Expenses')
      .insert([expense])
      .select()
      .single();
    if (error) { console.error('Failed to add expense:', error); return; }
    setExpenses((xs) => [data, ...xs]);
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('Expenses').delete().eq('id', id);
    if (error) { console.error('Failed to delete expense:', error); return; }
    setExpenses((xs) => xs.filter((x) => x.id !== id));
  };

  // Build user object Dashboard expects
  const dashUser = user ? {
    name: user.user_metadata?.full_name ?? user.email,
    email: user.email,
    initials: (user.user_metadata?.full_name ?? user.email)
      .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
  } : null;

  if (isAuthed && route === 'dashboard') {
    return (
      <Dashboard
        expenses={expenses}
        loadingExpenses={loadingExpenses}
        error={error}
        onAddExpense={addExpense}
        onDeleteExpense={deleteExpense}
        onLogout={handleLogout}
        user={dashUser}
      />
    );
  }

  if (route === 'signup') {
    return <Signup onSignup={handleSignup} onGoLogin={() => setRoute('login')} />;
  }

  return <Login onLogin={handleLogin} onGoSignup={() => setRoute('signup')} />;
}