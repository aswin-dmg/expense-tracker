import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsyahjvzinbnmfopcxej.supabase.co'
const supabaseAnonKey = 'sb_publishable_rM90_FxFZ_gFsJpqRGmRgg_QCjn8PT2'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)