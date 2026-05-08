# Track It — Expense Tracker

A modern, minimal expense-tracking SaaS dashboard. Built with **React 18 + Vite + Tailwind CSS**.

## Quick start

```bash
cd vite-app
npm install
npm run dev
```

The dev server runs at **http://localhost:5173** and opens automatically.

## Scripts

| Script            | What it does                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Start the Vite dev server (HMR)               |
| `npm run build`   | Build for production into `dist/`             |
| `npm run preview` | Preview the production build locally          |

## Folder structure

```
vite-app/
├── index.html              # Vite entry HTML (loads /src/main.jsx)
├── package.json            # Dependencies + scripts
├── vite.config.js          # Vite config (React plugin, dev port)
├── tailwind.config.js      # Tailwind theme tokens (colors, fonts, shadows)
├── postcss.config.js       # PostCSS pipeline (Tailwind + Autoprefixer)
└── src/
    ├── main.jsx            # ReactDOM.createRoot + StrictMode
    ├── App.jsx             # Top-level state, routing switch
    ├── index.css           # Tailwind directives + global styles
    │
    ├── data/
    │   └── mockData.js     # CATEGORIES, MOCK_EXPENSES, MOCK_USER
    │
    ├── pages/
    │   ├── Login.jsx       # /login
    │   ├── Signup.jsx      # /signup
    │   └── Dashboard.jsx   # /dashboard (composed from components below)
    │
    └── components/
        ├── ui/             # Reusable primitives
        │   ├── Button.jsx
        │   ├── Card.jsx
        │   ├── Icon.jsx    # Inline SVG icon set
        │   └── Input.jsx
        │
        ├── AuthLayout.jsx       # Two-column auth shell (form + brand panel)
        ├── Topbar.jsx           # Sticky header (brand + search + profile menu)
        ├── SummaryCard.jsx      # Generic KPI tile
        ├── CategoryCards.jsx    # Grid of category tiles with totals
        ├── CategoryChart.jsx    # SVG donut chart with leader-line callouts
        ├── TransactionList.jsx  # Recent-first compact list
        ├── ExpenseTable.jsx     # Sortable, filterable full table
        ├── AddExpenseModal.jsx  # Add-expense form modal
        └── SetLimitModal.jsx    # Edit monthly spending limit
```

### Why this structure?

- **`pages/`** are top-level views — each maps to a "route".
- **`components/`** are reusable building blocks consumed by pages.
- **`components/ui/`** holds tiny presentational primitives (Button, Card, Input, Icon). Anything dashboard-specific lives one level up.
- **`data/`** isolates mock data so the swap to a real backend is one file.

## Dependencies

### Runtime
- `react` `^18.3.1`
- `react-dom` `^18.3.1`

### Dev
- `vite` `^5.4.11` — bundler + dev server
- `@vitejs/plugin-react` `^4.3.4` — React Fast Refresh
- `tailwindcss` `^3.4.17` — utility CSS
- `postcss` `^8.4.49` — required by Tailwind
- `autoprefixer` `^10.4.20` — vendor prefixes

## What's inside

### Pages
- **Login** — email/password with show-toggle and validation
- **Signup** — name/email/password with strength meter + ToS checkbox
- **Dashboard** — full-width SaaS layout

### Dashboard sections
- Topbar: brand, search, notifications, profile dropdown (Settings / Log out)
- Hero: personalized greeting + prominent **Add expense** CTA
- Summary row: This Month spending (with limit progress + month switcher) + Highest Category card with top-3 breakdown
- Spending Breakdown: SVG donut chart with arrow-style amount callouts and a pinned right-side legend
- Recent Transactions: 5 most recent, with "View all" jumping to the full table
- Category tiles: 7 categories (incl. **Other**) with mini progress bars
- All expenses: sortable table with category-chip filters + per-row delete

### State management
All state lives in `App.jsx` and is passed down via props:

| State           | Owner       | Used by                                |
|-----------------|-------------|----------------------------------------|
| `isAuthed`      | `App`       | route switch                           |
| `route`         | `App`       | route switch                           |
| `expenses`      | `App`       | `Dashboard` (read), modals (write)     |
| `monthlyLimit`  | `Dashboard` | summary card, set-limit modal          |
| `selectedMonth` | `Dashboard` | filters all month-scoped sections      |
| `query`         | `Dashboard` | passed to `Topbar` and `ExpenseTable`  |

For a real app, hoist `expenses` + `user` into a Context (e.g. `AuthContext`, `ExpensesContext`) and replace the route switch with `react-router-dom`.

## Connecting Supabase later

When you're ready to wire up a real backend:

1. **Install the client**

   ```bash
   npm install @supabase/supabase-js
   ```

2. **Add a `.env` with your project credentials** (Vite exposes `VITE_*` vars):

   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. **Create `src/lib/supabase.js`:**

   ```js
   import { createClient } from '@supabase/supabase-js';

   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

4. **Replace mock auth in `App.jsx`:**

   ```js
   // Login page
   const { error } = await supabase.auth.signInWithPassword({ email, password });

   // Signup page
   const { error } = await supabase.auth.signUp({ email, password });

   // Logout
   await supabase.auth.signOut();

   // Listen for session changes (replaces isAuthed state)
   useEffect(() => {
     const { data } = supabase.auth.onAuthStateChange((_event, session) => {
       setIsAuthed(!!session);
       setUser(session?.user ?? null);
     });
     return () => data.subscription.unsubscribe();
   }, []);
   ```

5. **Replace `MOCK_EXPENSES` with a real table.** Create the table in Supabase:

   ```sql
   create table expenses (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     name text not null,
     amount numeric not null,
     category text not null,
     custom_category text,
     date date not null,
     note text,
     created_at timestamptz default now()
   );

   alter table expenses enable row level security;
   create policy "Users can read their own expenses" on expenses
     for select using (auth.uid() = user_id);
   create policy "Users can insert their own expenses" on expenses
     for insert with check (auth.uid() = user_id);
   create policy "Users can delete their own expenses" on expenses
     for delete using (auth.uid() = user_id);
   ```

6. **Fetch + mutate from Dashboard:**

   ```js
   useEffect(() => {
     supabase.from('Expenses').select('*').order('date', { ascending: false })
       .then(({ data }) => setExpenses(data ?? []));
   }, []);

   const addExpense = async (expense) => {
     const { data, error } = await supabase.from('Expenses').insert(expense).select().single();
     if (!error) setExpenses((xs) => [data, ...xs]);
   };

   const deleteExpense = async (id) => {
     await supabase.from('Expenses').delete().eq('id', id);
     setExpenses((xs) => xs.filter((x) => x.id !== id));
   };
   ```

That's it — the UI doesn't change at all because all data flows through props.

## Best practices applied

- **Component-per-file** with a single default export — keeps imports unambiguous.
- **Named exports for utilities** (`fmtDate` from `TransactionList.jsx`) — co-located with their primary consumer.
- **`useMemo` for derived data** (month filtering, category totals, slice angles) — avoids recompute on every render.
- **No prop drilling beyond 2 levels** — when it grows, lift to Context.
- **Tailwind for visuals, no CSS files per component** — fewer files, easier theming via `tailwind.config.js`.
- **Mock data isolated** — one file to delete when wiring a real API.
