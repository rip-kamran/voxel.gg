// ========== VOXEL.GG WEBSITE - WEBSOCKET INTEGRATION ==========
// Add this to your website HTML before closing </body>

class VoxelWebSocketClient {
  constructor(websocketUrl, userId) {
    this.websocketUrl = websocketUrl;
    this.userId = userId;
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      this.socket = new WebSocket(this.websocketUrl);

      this.socket.onopen = () => {
        console.log("✅ Connected to Voxel WebSocket");
        this.connected = true;
        this.reconnectAttempts = 0;

        // Register this user with the WebSocket server
        this.socket.send(
          JSON.stringify({
            type: "register",
            userId: this.userId,
          })
        );

        // Update UI
        document.getElementById("connection-status")?.classList.add("connected");
        document.getElementById("connection-status").textContent = "🟢 Connected";
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📨 WebSocket message:", data);

        if (data.type === "registered") {
          console.log("✅ Registered:", data.pluginId);
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.handleDisconnect();
      };

      this.socket.onclose = () => {
        console.log("❌ WebSocket closed");
        this.handleDisconnect();
      };
    } catch (error) {
      console.error("❌ Failed to connect WebSocket:", error);
      this.handleDisconnect();
    }
  }

  handleDisconnect() {
    this.connected = false;
    document.getElementById("connection-status")?.classList.remove("connected");
    document.getElementById("connection-status").textContent = "🔴 Disconnected";

    // Try to reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect(), 3000);
    }
  }

  sendCodeToPlugin(code, scriptName = "VoxelGenerated") {
    if (!this.connected || !this.socket) {
      console.error("❌ Not connected to WebSocket");
      alert(
        "⚠️ Plugin is not connected. Make sure you have Roblox Studio open with the Voxel plugin!"
      );
      return false;
    }

    try {
      this.socket.send(
        JSON.stringify({
          type: "insertCode",
          userId: this.userId,
          code,
          scriptName,
        })
      );
      console.log("📤 Code sent to plugin!");
      return true;
    } catch (error) {
      console.error("❌ Failed to send code:", error);
      return false;
    }
  }

  checkConnection() {
    if (!this.connected) {
      return false;
    }

    try {
      this.socket.send(
        JSON.stringify({
          type: "ping",
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

// ========== INITIALIZE WEBSOCKET CLIENT ==========
// Usage in your HTML:
/*
<script>
  const API_URL = 'https://your-supabase-project.supabase.co/functions/v1/voxel-api';
  const WEBSOCKET_URL = 'wss://your-supabase-project.supabase.co/functions/v1/voxel-ws';
  const USER_ID = 'user_' + Date.now();

  // Create WebSocket client
  const voxelClient = new VoxelWebSocketClient(WEBSOCKET_URL, USER_ID);
  voxelClient.connect();

  // When user generates code and clicks "Insert to Studio"
  document.getElementById('insertBtn').addEventListener('click', () => {
    const code = document.getElementById('codeBox').value;
    const success = voxelClient.sendCodeToPlugin(code, 'VoxelGenerated');
    
    if (success) {
      alert('✓ Code sent to Studio! Check your Roblox Studio window.');
    }
  });
</script>
*/

// ========== HELPER FUNCTIONS ==========

// Check if plugin is connected before generating
async function checkPluginConnection(userId) {
  try {
    const response = await fetch(
      new URL("/api/check-connection", API_URL).toString(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await response.json();
    return data.connected;
  } catch (error) {
    console.error("❌ Failed to check connection:", error);
    return false;
  }
}

// Send code through REST API if WebSocket fails
async function sendCodeViaREST(userId, code, scriptName = "VoxelGenerated") {
  try {
    const response = await fetch(
      new URL("/api/send-code", API_URL).toString(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          code,
          scriptName,
        }),
      }
    );

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Failed to send code via REST:", error);
    return false;
  }
}
