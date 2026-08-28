import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64Url } from "https://deno.land/std@0.224.0/encoding/base64url.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const JWT_SECRET = Deno.env.get("ADMIN_JWT_SECRET");

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = encodeBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = encodeBase64Url(enc.encode(JSON.stringify(payload)));
  const data = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sigB64 = encodeBase64Url(new Uint8Array(sig));
  return `${data}.${sigB64}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!JWT_SECRET) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("email,display_name,role,password_hash,active,failed_attempts,last_failed_at")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !admin || !admin.active || !admin.password_hash) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit: 5 failed attempts triggers 15-minute lockout
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_MS = 15 * 60 * 1000;
    if (admin.failed_attempts >= MAX_ATTEMPTS && admin.last_failed_at) {
      const elapsed = Date.now() - new Date(admin.last_failed_at).getTime();
      if (elapsed < LOCKOUT_MS) {
        return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Reset after lockout expires
      await supabase
        .from("admin_users")
        .update({ failed_attempts: 0, last_failed_at: null })
        .eq("email", email.toLowerCase().trim());
    }

    const [scheme, salt, hash] = admin.password_hash.split(":");
    if (scheme !== "sha256") {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const saltBytes = Uint8Array.from(
      salt.match(/.{2}/g)!.map((b: string) => parseInt(b, 16))
    );
    const derived = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      512
    );
    const computedHash = Array.from(new Uint8Array(derived))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedHash !== hash) {
      await supabase
        .from("admin_users")
        .update({
          failed_attempts: (admin.failed_attempts || 0) + 1,
          last_failed_at: new Date().toISOString(),
        })
        .eq("email", email.toLowerCase().trim());

      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reset failed attempts on success
    await supabase
      .from("admin_users")
      .update({ failed_attempts: 0, last_failed_at: null, last_login: new Date().toISOString() })
      .eq("email", email.toLowerCase().trim());

    const now = Math.floor(Date.now() / 1000);
    const token = await signJwt(
      {
        sub: admin.email,
        role: admin.role,
        name: admin.display_name,
        iat: now,
        exp: now + 8 * 3600, // 8-hour session
      },
      JWT_SECRET
    );

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: {
          email: admin.email,
          display_name: admin.display_name,
          role: admin.role,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
