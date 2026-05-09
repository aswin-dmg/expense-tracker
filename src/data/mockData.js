/**
 * Mock data for the prototype.
 * In a real app this would be fetched from Supabase / your API.
 */

export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',    icon: 'utensils',  hue: 25  },
  { id: 'transport',     label: 'Transport',         icon: 'car',       hue: 220 },
  { id: 'shopping',      label: 'Shopping',          icon: 'bag',       hue: 290 },
  { id: 'bills',         label: 'Bills & Utilities', icon: 'bolt',      hue: 50  },
  { id: 'health',        label: 'Health',            icon: 'heart',     hue: 0   },
  { id: 'entertainment', label: 'Entertainment',     icon: 'film',      hue: 175 },
  { id: 'education',     label: 'Education',         icon: 'book',      hue: 240 },
  { id: 'travel',        label: 'Travel',            icon: 'map',       hue: 190 },
  { id: 'personalcare',  label: 'Personal Care',     icon: 'user',      hue: 320 },
  { id: 'home',          label: 'Home & Rent',       icon: 'home',      hue: 30  },
  { id: 'work',          label: 'Work',              icon: 'briefcase', hue: 210 },
  { id: 'gifts',         label: 'Gifts',             icon: 'gift',      hue: 350 },
];

// `name` describes what the expense was for. `customCategory` only set when
// category === 'other' and the user types a label (e.g. "Gift", "Donation").
export const MOCK_EXPENSES = [
  { id: 'e01', name: 'Blue Bottle Coffee', category: 'food',      amount: 6.75,   date: '2026-05-08', note: 'Latte + croissant' },
  { id: 'e02', name: 'Uber',               category: 'transport', amount: 18.40,  date: '2026-05-08', note: 'Ride to office' },
  { id: 'e03', name: 'Whole Foods',        category: 'food',      amount: 84.22,  date: '2026-05-07', note: 'Weekly groceries' },
  { id: 'e04', name: 'Spotify',            category: 'leisure',   amount: 11.99,  date: '2026-05-06', note: 'Monthly subscription' },
  { id: 'e05', name: 'PG&E',               category: 'bills',     amount: 142.30, date: '2026-05-05', note: 'Electricity' },
  { id: 'e06', name: 'Zara',               category: 'shopping',  amount: 96.50,  date: '2026-05-04', note: 'Spring jacket' },
  { id: 'e07', name: 'CVS Pharmacy',       category: 'health',    amount: 24.10,  date: '2026-05-03', note: 'Prescription' },
  { id: 'e08', name: 'Lyft',               category: 'transport', amount: 12.80,  date: '2026-05-02', note: 'Late ride' },
  { id: 'e09', name: 'Trader Joe\u2019s',  category: 'food',      amount: 47.65,  date: '2026-05-02', note: 'Snacks' },
  { id: 'e10', name: 'Netflix',            category: 'leisure',   amount: 15.49,  date: '2026-05-01', note: 'Subscription' },
  { id: 'e11', name: 'Amazon',             category: 'shopping',  amount: 38.20,  date: '2026-04-29', note: 'Cables + cleaning' },
  { id: 'e12', name: 'Comcast',            category: 'bills',     amount: 79.99,  date: '2026-04-28', note: 'Internet' },
];

export const MOCK_USER = {
  name: 'Alex Morgan',
  email: 'alex@trackit.app',
  initials: 'AM',
};
