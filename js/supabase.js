// ================================
// CONFIGURAÇÃO DO SUPABASE
// ================================

const SUPABASE_URL =
    "https://vyvpzdcvepjezqfasysf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_CTuv-i2yajzGjxnb4fHx3w_uL027P-G";


// ================================
// CRIAR CLIENTE SUPABASE
// ================================

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );