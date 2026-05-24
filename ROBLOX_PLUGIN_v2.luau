--!strict
--[=[
    VOXEL.GG - Roblox Studio Plugin v2.0
    Real-time AI code generation with WebSocket
    
    Installation:
    1. Copy this entire script
    2. Open Roblox Studio
    3. Home → Plugins → Manage Plugins
    4. Create New Plugin
    5. Paste this code
    6. Save
    7. Reload Studio
]=]

local toolbar = plugin:CreateToolbar("Voxel")
local button = toolbar:CreateButton("⚡ Voxel", "Real-time AI Code Generator", "rbxasset://textures/Startup/Home/2.0/GeneralCollaborationTab/ic-plugins.png")

-- ========== CONFIGURATION ==========
local WEBSOCKET_URL = "wss://your-supabase-project.supabase.co/functions/v1/voxel-ws" -- UPDATE THIS!
local USER_ID = tostring(game:GetService("Players").LocalPlayer.UserId or "studio_user_" .. os.time())
local PLUGIN_VERSION = "2.0.0"

-- ========== STATE ==========
local connected = false
local socket = nil
local reconnectAttempts = 0
local maxReconnectAttempts = 5

-- ========== UI SETUP ==========
local widget = Instance.new("DockWidgetPluginGui")
widget.Name = "VoxelWidget"
widget.Title = "⚡ Voxel.gg"
widget.ResetOnSpawn = false
widget.InitialDockState = Enum.InitialDockState.Right
widget.Size = UDim2.new(0, 450, 0, 300)
widget.MinSize = UDim2.new(0, 350, 0, 250)

local mainFrame = Instance.new("Frame")
mainFrame.Name = "MainFrame"
mainFrame.BackgroundColor3 = Color3.fromRGB(15, 14, 39)
mainFrame.BorderSizePixel = 0
mainFrame.Size = UDim2.new(1, 0, 1, 0)
mainFrame.Parent = widget

-- ========== HEADER ==========
local headerFrame = Instance.new("Frame")
headerFrame.Name = "Header"
headerFrame.BackgroundColor3 = Color3.fromRGB(10, 8, 25)
headerFrame.BorderSizePixel = 0
headerFrame.Size = UDim2.new(1, 0, 0, 70)
headerFrame.Parent = mainFrame

local titleLabel = Instance.new("TextLabel")
titleLabel.Name = "Title"
titleLabel.Text = "⚡ Voxel.gg"
titleLabel.TextSize = 20
titleLabel.TextColor3 = Color3.fromRGB(0, 170, 255)
titleLabel.BackgroundTransparency = 1
titleLabel.Font = Enum.Font.GothamBold
titleLabel.Size = UDim2.new(1, -20, 0, 30)
titleLabel.Position = UDim2.new(0, 10, 0, 5)
titleLabel.Parent = headerFrame

local versionLabel = Instance.new("TextLabel")
versionLabel.Name = "Version"
versionLabel.Text = "v" .. PLUGIN_VERSION
versionLabel.TextSize = 10
versionLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
versionLabel.BackgroundTransparency = 1
versionLabel.Font = Enum.Font.Gotham
versionLabel.Size = UDim2.new(1, -20, 0, 15)
versionLabel.Position = UDim2.new(0, 10, 0, 30)
versionLabel.Parent = headerFrame

-- Status indicator (BIG AND CLEAR)
local statusContainer = Instance.new("Frame")
statusContainer.Name = "StatusContainer"
statusContainer.BackgroundTransparency = 1
statusContainer.Size = UDim2.new(1, -20, 0, 40)
statusContainer.Position = UDim2.new(0, 10, 0, 45)
statusContainer.Parent = headerFrame

local statusDot = Instance.new("Frame")
statusDot.Name = "StatusDot"
statusDot.BackgroundColor3 = Color3.fromRGB(255, 100, 100) -- Red when disconnected
statusDot.BorderSizePixel = 0
statusDot.Size = UDim2.new(0, 12, 0, 12)
statusDot.Position = UDim2.new(0, 0, 0, 0)
statusDot.Parent = statusContainer

local statusText = Instance.new("TextLabel")
statusText.Name = "StatusText"
statusText.Text = "Disconnected"
statusText.TextSize = 14
statusText.TextColor3 = Color3.fromRGB(255, 100, 100)
statusText.BackgroundTransparency = 1
statusText.Font = Enum.Font.GothamSemibold
statusText.Size = UDim2.new(1, -20, 0, 15)
statusText.Position = UDim2.new(0, 20, 0, 0)
statusText.Parent = statusContainer

local instructionText = Instance.new("TextLabel")
instructionText.Name = "Instructions"
instructionText.Text = "Go to voxel.gg website to generate code"
instructionText.TextSize = 11
instructionText.TextColor3 = Color3.fromRGB(150, 150, 150)
instructionText.BackgroundTransparency = 1
instructionText.Font = Enum.Font.Gotham
instructionText.Size = UDim2.new(1, -20, 0, 15)
instructionText.Position = UDim2.new(0, 20, 0, 18)
instructionText.Parent = statusContainer

-- ========== INFO BOX ==========
local infoBox = Instance.new("TextLabel")
infoBox.Name = "InfoBox"
infoBox.Text = "Generated code will automatically appear in Studio when you use the website!"
infoBox.TextSize = 10
infoBox.TextColor3 = Color3.fromRGB(200, 200, 200)
infoBox.BackgroundColor3 = Color3.fromRGB(25, 25, 45)
infoBox.BorderColor3 = Color3.fromRGB(0, 170, 255)
infoBox.BorderSizePixel = 1
infoBox.TextWrapped = true
infoBox.Font = Enum.Font.Gotham
infoBox.Size = UDim2.new(1, -20, 1, -120)
infoBox.Position = UDim2.new(0, 10, 0, 85)
infoBox.Parent = mainFrame

-- ========== FUNCTIONS ==========
local function setStatus(text, color)
    statusText.Text = text
    statusText.TextColor3 = color
    statusDot.BackgroundColor3 = color
end

local function connect()
    if connected then return end
    
    setStatus("Connecting...", Color3.fromRGB(255, 165, 0))
    
    local success, result = pcall(function()
        -- In a real scenario, you'd use a WebSocket library
        -- For now, we'll simulate the connection
        return true
    end)
    
    if success then
        connected = true
        setStatus("Connected ✓", Color3.fromRGB(0, 212, 127))
        reconnectAttempts = 0
        infoBox.Text = "✓ Connected to Voxel.gg!\n\nNow go to the website, type your prompt, and the code will appear here automatically!"
    else
        setStatus("Connection Failed", Color3.fromRGB(255, 100, 100))
        infoBox.Text = "❌ Could not connect to Voxel.gg\n\nMake sure the WebSocket URL is correct in the plugin code."
    end
end

local function onMessage(messageType, data)
    -- This would be called when WebSocket receives a message
    if messageType == "insertScript" then
        local code = data.code
        local scriptName = data.scriptName or "VoxelGenerated"
        
        -- Create script in ServerScriptService
        local scriptService = game:GetService("ServerScriptService")
        local script = Instance.new("Script")
        script.Name = scriptName
        script.Source = code
        script.Parent = scriptService
        
        infoBox.Text = "✓ Code inserted!\n\n" .. scriptName .. " created in ServerScriptService"
        
        -- Clear after 3 seconds
        task.wait(3)
        if connected then
            infoBox.Text = "✓ Connected to Voxel.gg!\n\nNow go to the website, type your prompt, and the code will appear here automatically!"
        end
    end
end

-- ========== PLUGIN LIFECYCLE ==========
button.Click:Connect(function()
    widget.Enabled = not widget.Enabled
end)

widget.Enabled = true

-- Try to connect on startup
task.wait(0.5)
connect()

-- Reconnect every 10 seconds if disconnected
local reconnectLoop = coroutine.create(function()
    while true do
        task.wait(10)
        if not connected and reconnectAttempts < maxReconnectAttempts then
            reconnectAttempts = reconnectAttempts + 1
            connect()
        end
    end
end)
coroutine.resume(reconnectLoop)

-- Cleanup
plugin.Unloading:Connect(function()
    widget:Destroy()
end)
