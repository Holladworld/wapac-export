const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TOKEN_KEY = 'wapac_admin_token';

function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function requireAuth() {
  const token = getToken();
  if (!token) throw new Error('Not authorized');
  return token;
}

async function adminFetch(params: Record<string, string>, body?: unknown, method?: string) {
  const token = requireAuth();
  const url = new URL(`${SUPABASE_URL}/functions/v1/admin-data`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), {
    method: method || (body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'X-Admin-Token': token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const adminApi = {
  select: async (table: string, opts?: {
    columns?: string; filterCol?: string; filterVal?: string;
    orderBy?: string; ascending?: boolean; limit?: number; single?: boolean;
  }) => {
    const params: Record<string, string> = { table, op: 'select' };
    if (opts?.columns) params.select = opts.columns;
    if (opts?.filterCol) params.filterCol = opts.filterCol;
    if (opts?.filterVal) params.filterVal = opts.filterVal;
    if (opts?.orderBy) params.orderBy = opts.orderBy;
    if (opts?.ascending === false) params.ascending = 'false';
    if (opts?.limit) params.limit = String(opts.limit);
    if (opts?.single) params.single = 'true';
    return adminFetch(params);
  },

  insert: async (table: string, row: Record<string, unknown>) =>
    adminFetch({ table, op: 'insert' }, row),

  update: async (table: string, filterVal: string, row: Record<string, unknown>, filterCol = 'id') =>
    adminFetch({ table, op: 'update', filterCol, filterVal }, row),

  delete: async (table: string, filterVal: string, filterCol = 'id') =>
    adminFetch({ table, op: 'delete', filterCol, filterVal }),

  upsert: async (table: string, row: Record<string, unknown>) =>
    adminFetch({ table, op: 'upsert' }, row),
};
