// ========== VOXEL.GG - SUPABASE EDGE FUNCTION ==========
// Deploy this to Supabase Edge Functions
// Handles all API requests, user management, admin dashboard

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// ========== CONFIG ==========
const BRAND_NAME = "Voxel";
const ADMIN_EMAIL = "shaikzaid7373@gmail.com";
const COSTS = { SMALL: 0.8, BIG: 2.5 };
const FREE_MONTHLY_CREDITS = 20;

// Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// API Keys for AI providers
const GROQ_KEY = Deno.env.get("GROQ_KEY")!;
const GEMINI_KEY = Deno.env.get("GEMINI_KEY")!;
const CEREBRAS_KEY = Deno.env.get("CEREBRAS_KEY")!;

// ========== SYSTEM PROMPT ==========
const SYSTEM_PROMPT = `You are VoxelBot, an expert Roblox Luau developer.

CRITICAL RULES:
1. Output ONLY valid Luau code. NO markdown fences, NO \`\`\`lua\`\`\`, NO explanations.
2. Start with #!strict
3. Use type annotations for all function parameters and returns
4. Use modern APIs: task.wait(), task.spawn(), task.delay()
5. Cache services at the top: local Players = game:GetService("Players")
6. Use FindFirstChildOfClass/FindFirstChildWhichIsA with proper nil checks
7. NEVER use: loadstring, getfenv, setfenv, debug.*, _G
8. Handle errors with pcall when calling untrusted code
9. Write clean, well-commented code
10. Follow Roblox security best practices

OUTPUT ONLY CODE. NO OTHER TEXT. NO MARKDOWN. JUST CODE.`;

// ========== CODE CLEANING ==========
function cleanCode(code: string): string {
  code = code
    .replace(/```luau\n?/g, "")
    .replace(/```lua\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const chattyPrefixes = [
    /^Here is your code:?\s*/i,
    /^This is the Luau code:?\s*/i,
    /^The following script:?\s*/i,
    /^Here is the script:?\s*/i,
    /^I've created the code:?\s*/i,
    /^Below is the code:?\s*/i,
  ];

  chattyPrefixes.forEach((regex) => {
    code = code.replace(regex, "");
  });

  if (!code.includes("#!strict")) {
    const firstKeyword = code.search(
      /\b(local|function|if|for|while|repeat|pcall|return)\b/
    );
    if (firstKeyword > 0) {
      code = code.substring(firstKeyword);
    }
    code = "#!strict\n\n" + code;
  }

  return code.trim();
}

// ========== AI GENERATION ==========
async function callGroq(prompt: string, isBig: boolean): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: isBig ? 4096 : 2048,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("RATE_LIMIT");
    if (response.status === 401) throw new Error("INVALID_KEY");
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return cleanCode(data.choices[0].message.content);
}

async function callGemini(prompt: string, isBig: boolean): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: isBig ? 4096 : 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return cleanCode(data.candidates[0].content.parts[0].text);
}

async function callCerebras(prompt: string, isBig: boolean): Promise<string> {
  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CEREBRAS_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: isBig ? 4096 : 2048,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("RATE_LIMIT");
    if (response.status === 402) throw new Error("OUT_OF_CREDITS");
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return cleanCode(data.choices[0].message.content);
}

async function generateLuauCode(
  prompt: string,
  isBig: boolean
): Promise<{ code: string; provider: string; model: string }> {
  const providers = [
    { name: "Groq", call: callGroq, model: "llama-3.1-8b-instant" },
    { name: "Gemini", call: callGemini, model: "gemini-2.0-flash" },
    { name: "Cerebras", call: callCerebras, model: "llama-3.1-8b" },
  ];

  let lastError;
  for (const provider of providers) {
    try {
      console.log(`🔄 ${BRAND_NAME} using ${provider.name}...`);
      const code = await provider.call(prompt, isBig);

      if (!code || code.trim() === "") {
        throw new Error("Empty response");
      }

      return {
        code,
        provider: provider.name,
        model: provider.model,
      };
    } catch (error) {
      console.error(`❌ ${provider.name} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All APIs exhausted");
}

// ========== DATABASE HELPERS ==========
async function getOrCreateUser(userId: string) {
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    const now = new Date();
    const { data: newUser } = await supabase
      .from("users")
      .insert({
        id: userId,
        credits: FREE_MONTHLY_CREDITS,
        total_used: 0,
        purchased_credits: 0,
        created_at: now,
        last_reset: now,
        is_admin: false,
        banned: false,
      })
      .select()
      .single();
    return newUser;
  }

  // Reset monthly credits if needed
  const lastReset = new Date(user.last_reset);
  const now = new Date();
  if (
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    const { data: updated } = await supabase
      .from("users")
      .update({
        credits: FREE_MONTHLY_CREDITS + user.purchased_credits,
        last_reset: now,
      })
      .eq("id", userId)
      .select()
      .single();
    return updated;
  }

  return user;
}

async function loginUser(email: string) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const isAdmin = email === ADMIN_EMAIL;

  const { data: session } = await supabase
    .from("sessions")
    .insert({
      id: sessionId,
      email,
      is_admin: isAdmin,
      login_time: new Date(),
      last_activity: new Date(),
    })
    .select()
    .single();

  return { sessionId, isAdmin, email };
}

async function verifySession(sessionId: string) {
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (session) {
    await supabase
      .from("sessions")
      .update({ last_activity: new Date() })
      .eq("id", sessionId);
  }

  return session;
}

// ========== CORS & REQUEST HANDLING ==========
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-session-id, x-user-id",
};

// ========== ROUTE HANDLERS ==========
async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // ========== PUBLIC ROUTES ==========
  if (path === "/" && method === "GET") {
    return new Response(
      JSON.stringify({
        status: `${BRAND_NAME}.gg API`,
        brand: BRAND_NAME,
        version: "2.0.0 (Supabase)",
        apis: [
          { name: "Groq", limit: "14,400/day" },
          { name: "Gemini", limit: "1,000/day" },
          { name: "Cerebras", limit: "1,000,000/day" },
        ],
        costs: COSTS,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (path === "/health" && method === "GET") {
    return new Response(
      JSON.stringify({
        status: "ok",
        brand: BRAND_NAME,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ========== AUTH ==========
  if (path === "/auth/login" && method === "POST") {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sessionId, isAdmin, email: userEmail } = await loginUser(email);

    return new Response(
      JSON.stringify({
        success: true,
        sessionId,
        email: userEmail,
        isAdmin,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ========== GENERATE CODE ==========
  if (path === "/generate" && method === "POST") {
    const { prompt, userId } = await req.json();
    const sessionId = req.headers.get("x-session-id");

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Prompt required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const session = await verifySession(sessionId!);
    const actualUserId = userId || session?.email || `user_${Date.now()}`;
    const user = await getOrCreateUser(actualUserId);

    const len = prompt.length;
    const isBig = len > 100;
    const cost = isBig ? COSTS.BIG : COSTS.SMALL;

    if (user.credits < cost) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits",
          required: cost,
          available: user.credits,
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      const result = await generateLuauCode(prompt, isBig);

      await supabase
        .from("users")
        .update({
          credits: user.credits - cost,
          total_used: user.total_used + cost,
        })
        .eq("id", actualUserId);

      return new Response(
        JSON.stringify({
          success: true,
          code: result.code,
          generatedBy: result.provider,
          model: result.model,
          cost,
          size: isBig ? "BIG" : "SMALL",
          remainingCredits: user.credits - cost,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All APIs exhausted",
          details: error.message,
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ========== ADMIN ROUTES ==========
  if (path === "/admin/dashboard" && method === "GET") {
    const sessionId = req.headers.get("x-session-id");
    const session = await verifySession(sessionId!);

    if (!session || !session.is_admin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: users } = await supabase
      .from("users")
      .select("*");

    const totalCreditsUsed = users?.reduce((sum: number, u: any) => sum + u.total_used, 0) || 0;
    const totalCreditsSpent = users?.reduce((sum: number, u: any) => sum + u.purchased_credits, 0) || 0;

    return new Response(
      JSON.stringify({
        admin: session.email,
        timestamp: new Date().toISOString(),
        totalUsers: users?.length || 0,
        totalCreditsUsed,
        totalCreditsSpent,
        users: users?.map((u: any) => ({
          id: u.id,
          credits: u.credits,
          totalUsed: u.total_used,
          isAdmin: u.is_admin,
          banned: u.banned,
        })) || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ========== NOT FOUND ==========
  return new Response(
    JSON.stringify({ error: "Not found" }),
    { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

serve(handleRequest);
