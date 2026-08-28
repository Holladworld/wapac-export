import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decodeBase64Url } from "https://deno.land/std@0.224.0/encoding/base64url.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Token",
};

const JWT_SECRET = Deno.env.get("ADMIN_JWT_SECRET");

async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const data = `${headerB64}.${payloadB64}`;
    const sigBytes = decodeBase64Url(sigB64);
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadB64)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// Tables that contain sensitive api_key columns — never return those columns
const SENSITIVE_TABLES = new Set(["integrations", "admin_users"]);

// Columns to exclude from select responses on sensitive tables
const SENSITIVE_COLUMNS = new Set(["api_key_encrypted", "password_hash", "failed_attempts", "last_failed_at"]);

function maskApiKey(key: string | null): string | null {
  if (!key) return null;
  if (key.length <= 4) return "****";
  return "*".repeat(Math.max(4, key.length - 4)) + key.slice(-4);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Auth check — require valid JWT
  if (!JWT_SECRET) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const adminToken = req.headers.get("X-Admin-Token");
  if (!adminToken) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload = await verifyJwt(adminToken, JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const table = url.searchParams.get("table");
    const operation = url.searchParams.get("op") || "select";

    if (!table) {
      return new Response(JSON.stringify({ error: "Table parameter required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowedTables = [
      "products", "orders", "order_items", "blog_posts", "contact_submissions",
      "reviews", "site_settings", "email_templates", "integrations", "media_library",
      "newsletter_subscribers", "audit_logs", "error_logs",
    ];

    if (!allowedTables.includes(table)) {
      return new Response(JSON.stringify({ error: "Table not allowed" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    let body: any = {};
    if (req.method === "POST" || req.method === "PUT") {
      body = await req.json();
    }

    // Strip sensitive columns from any insert/update body
    if (SENSITIVE_TABLES.has(table)) {
      for (const col of SENSITIVE_COLUMNS) {
        if (col !== "api_key_encrypted") delete body[col];
      }
    }

    let query = supabase.from(table);

    switch (operation) {
      case "select": {
        let columns = url.searchParams.get("select") || "*";
        // Force-exclude sensitive columns from integrations selects
        if (table === "integrations" && columns === "*") {
          columns = "id,service_name,display_name,webhook_url,enabled,config,created_at,updated_at";
        }
        if (table === "admin_users" && columns === "*") {
          columns = "id,email,display_name,role,active,created_at,last_login";
        }
        const filterCol = url.searchParams.get("filterCol");
        const filterVal = url.searchParams.get("filterVal");
        const orderBy = url.searchParams.get("orderBy");
        const ascending = url.searchParams.get("ascending") !== "false";
        const limit = url.searchParams.get("limit");
        const single = url.searchParams.get("single") === "true";

        let q = query.select(columns);
        if (filterCol && filterVal) {
          q = q.eq(filterCol, filterVal);
        }
        if (orderBy) q = q.order(orderBy, { ascending: ascending as boolean });
        if (limit) q = q.limit(parseInt(limit));
        if (single) q = q.single();

        const { data, error } = await q;
        if (error) {
          return new Response(JSON.stringify({ error: "Query failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Mask API keys in integrations response
        let responseData = data;
        if (table === "integrations" && Array.isArray(data)) {
          responseData = data.map((row: any) => ({
            ...row,
            api_key_encrypted: maskApiKey(row.api_key_encrypted),
          }));
        } else if (table === "integrations" && data && !Array.isArray(data)) {
          responseData = { ...data, api_key_encrypted: maskApiKey(data.api_key_encrypted) };
        }

        return new Response(JSON.stringify({ data: responseData }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "insert": {
        const { data, error } = await query.insert(body);
        if (error) {
          return new Response(JSON.stringify({ error: "Insert failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ data }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "update": {
        const filterCol = url.searchParams.get("filterCol") || "id";
        const filterVal = url.searchParams.get("filterVal");
        if (!filterVal) {
          return new Response(JSON.stringify({ error: "Filter value required for update" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await query.update(body).eq(filterCol, filterVal);
        if (error) {
          return new Response(JSON.stringify({ error: "Update failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ data }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "delete": {
        const filterCol = url.searchParams.get("filterCol") || "id";
        const filterVal = url.searchParams.get("filterVal");
        if (!filterVal) {
          return new Response(JSON.stringify({ error: "Filter value required for delete" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await query.delete().eq(filterCol, filterVal);
        if (error) {
          return new Response(JSON.stringify({ error: "Delete failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ data }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "upsert": {
        const { data, error } = await query.upsert(body);
        if (error) {
          return new Response(JSON.stringify({ error: "Upsert failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ data }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      default:
        return new Response(JSON.stringify({ error: "Unknown operation" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
