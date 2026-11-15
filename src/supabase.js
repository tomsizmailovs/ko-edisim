import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://smetznogxrcufhxmcomj.supabase.co";

const supabaseAnonKey =
  "sb_publishable_LHH0HpcQglsoJnhutzg3zg_LF6ZxoZe";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);