// ========== VOXEL.GG - WEBSOCKET SERVER ==========
// Deploy this as a Supabase Edge Function
// Handles real-time communication between website and plugin

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { WebSocketServer, acceptable } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

// ========== CONFIG ==========
const BRAND_NAME = "Voxel";
const ADMIN_EMAIL = "shaikzaid7373@gmail.com";

// Track active plugin connections
const activePlugins = new Map<string, WebSocket>();
const userSessions = new Map<string, string>(); // userId -> pluginId

// ========== WEBSOCKET HANDLER ==========
async function handleWebSocket(req: Request): Promise<Response> {
  if (!acceptable(req)) {
    return new Response("Not a WebSocket request", { status: 400 });
  }

  const { socket, response } = Deno.upgrade(req);
  const pluginId = `plugin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`✅ Plugin connected: ${pluginId}`);
  activePlugins.set(pluginId, socket);

  try {
    for await (const msg of socket) {
      if (typeof msg === "string") {
        const data = JSON.parse(msg);

        // ========== MESSAGE TYPES ==========

        // Plugin registers itself
        if (data.type === "register") {
          userSessions.set(data.userId, pluginId);
          socket.send(
            JSON.stringify({
              type: "registered",
              pluginId,
              status: "connected",
            })
          );
          console.log(`✅ Plugin registered for user: ${data.userId}`);
        }

        // Website sends code to be inserted
        if (data.type === "insertCode") {
          const { userId, code, scriptName } = data;
          const targetPluginId = userSessions.get(userId);

          if (targetPluginId && activePlugins.has(targetPluginId)) {
            const targetPlugin = activePlugins.get(targetPluginId)!;
            targetPlugin.send(
              JSON.stringify({
                type: "insertScript",
                code,
                scriptName: scriptName || "VoxelGenerated",
                timestamp: new Date().toISOString(),
              })
            );
            console.log(`📤 Code sent to plugin for user: ${userId}`);
          } else {
            console.warn(`⚠️ Plugin not found for user: ${userId}`);
          }
        }

        // Plugin confirms code insertion
        if (data.type === "codeInserted") {
          console.log(
            `✅ Code inserted successfully for user: ${data.userId}`
          );
        }

        // Heartbeat
        if (data.type === "ping") {
          socket.send(JSON.stringify({ type: "pong" }));
        }

        // Website checks if plugin is connected
        if (data.type === "checkConnection") {
          const { userId } = data;
          const isConnected = userSessions.has(userId);
          socket.send(
            JSON.stringify({
              type: "connectionStatus",
              userId,
              connected: isConnected,
            })
          );
        }
      }
    }
  } catch (err) {
    console.error(`❌ WebSocket error: ${err.message}`);
  } finally {
    activePlugins.delete(pluginId);
    // Find and remove user session
    for (const [userId, pId] of userSessions.entries()) {
      if (pId === pluginId) {
        userSessions.delete(userId);
      }
    }
    console.log(`❌ Plugin disconnected: ${pluginId}`);
  }

  return response;
}

// ========== REST API ENDPOINTS ==========
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // WebSocket upgrade
  if (path === "/ws" && req.headers.get("upgrade") === "websocket") {
    return handleWebSocket(req);
  }

  // Status endpoint
  if (path === "/status" && req.method === "GET") {
    return new Response(
      JSON.stringify({
        service: `${BRAND_NAME}.gg WebSocket Server`,
        status: "online",
        activePlugins: activePlugins.size,
        activeSessions: userSessions.size,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Check if user has plugin connected
  if (path === "/api/check-connection" && req.method === "POST") {
    const { userId } = await req.json();
    const connected = userSessions.has(userId);

    return new Response(
      JSON.stringify({
        userId,
        connected,
        pluginId: connected ? userSessions.get(userId) : null,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Send code to plugin
  if (path === "/api/send-code" && req.method === "POST") {
    const { userId, code, scriptName } = await req.json();
    const pluginId = userSessions.get(userId);

    if (pluginId && activePlugins.has(pluginId)) {
      const plugin = activePlugins.get(pluginId)!;
      plugin.send(
        JSON.stringify({
          type: "insertScript",
          code,
          scriptName: scriptName || "VoxelGenerated",
          timestamp: new Date().toISOString(),
        })
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: "Code sent to plugin",
          pluginId,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Plugin not connected",
        message: `No plugin connected for user ${userId}`,
      }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Admin stats
  if (path === "/api/admin/stats" && req.method === "GET") {
    return new Response(
      JSON.stringify({
        admin: ADMIN_EMAIL,
        activePlugins: activePlugins.size,
        activeSessions: userSessions.size,
        sessions: Array.from(userSessions.entries()).map(([userId, pluginId]) => ({
          userId,
          pluginId,
        })),
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("Not found", { status: 404 });
}

// ========== START SERVER ==========
serve(handleRequest);
