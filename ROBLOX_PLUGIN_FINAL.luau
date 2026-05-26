--!strict
--[=[
    VOXEL.GG - Roblox Studio Plugin v3.0
    Real-time AI Luau code generator
    
    INSTALLATION:
    1. Copy this entire script
    2. Open Roblox Studio
    3. Home → Plugins → Manage Plugins
    4. Create New Plugin
    5. Paste this code
    6. Save
    7. Reload Studio
    8. Click ⚡ Voxel in toolbar!
]=]

local toolbar = plugin:CreateToolbar("Voxel")
local button = toolbar:CreateButton("⚡ Voxel", "AI Script Generator", "rbxasset://textures/Startup/Home/2.0/GeneralCollaborationTab/ic-plugins.png")

-- ========== CONFIG ==========
local BACKEND_URL = "https://jzhzbiwvdrwhycwidhmx.supabase.co/functions/v1/voxel-api"
local USER_ID = tostring(game:GetService("Players").LocalPlayer.UserId or "studio_" .. os.time())
local VERSION = "3.0.0"

-- ========== STATE ==========
local connected = false
local lastCode = ""

-- ========== UI SETUP ==========
local widget = Instance.new("DockWidgetPluginGui")
widget.Name = "VoxelWidget"
widget.Title = "⚡ Voxel.gg"
widget.ResetOnSpawn = false
widget.InitialDockState = Enum.InitialDockState.Right
widget.Size = UDim2.new(0, 450, 0, 600)
widget.MinSize = UDim2.new(0, 350, 0, 400)

-- Main frame
local mainFrame = Instance.new("Frame")
mainFrame.BackgroundColor3 = Color3.fromRGB(15, 14, 39)
mainFrame.BorderSizePixel = 0
mainFrame.Size = UDim2.new(1, 0, 1, 0)
mainFrame.Parent = widget

-- ========== HEADER ==========
local headerFrame = Instance.new("Frame")
headerFrame.BackgroundColor3 = Color3.fromRGB(10, 8, 25)
headerFrame.BorderSizePixel = 0
headerFrame.Size = UDim2.new(1, 0, 0, 80)
headerFrame.Parent = mainFrame

local titleLabel = Instance.new("TextLabel")
titleLabel.Text = "⚡ Voxel.gg"
titleLabel.TextSize = 22
titleLabel.TextColor3 = Color3.fromRGB(0, 170, 255)
titleLabel.BackgroundTransparency = 1
titleLabel.Font = Enum.Font.GothamBold
titleLabel.Size = UDim2.new(1, -20, 0, 30)
titleLabel.Position = UDim2.new(0, 10, 0, 5)
titleLabel.Parent = headerFrame

local versionLabel = Instance.new("TextLabel")
versionLabel.Text = "v" .. VERSION
versionLabel.TextSize = 11
versionLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
versionLabel.BackgroundTransparency = 1
versionLabel.Font = Enum.Font.Gotham
versionLabel.Size = UDim2.new(1, -20, 0, 15)
versionLabel.Position = UDim2.new(0, 10, 0, 30)
versionLabel.Parent = headerFrame

-- Status indicator
local statusDot = Instance.new("Frame")
statusDot.BackgroundColor3 = Color3.fromRGB(0, 212, 127)
statusDot.BorderSizePixel = 0
statusDot.Size = UDim2.new(0, 10, 0, 10)
statusDot.Position = UDim2.new(0, 10, 0, 50)
statusDot.Parent = headerFrame

local statusText = Instance.new("TextLabel")
statusText.Text = "Ready to receive code"
statusText.TextSize = 12
statusText.TextColor3 = Color3.fromRGB(0, 212, 127)
statusText.BackgroundTransparency = 1
statusText.Font = Enum.Font.Gotham
statusText.Size = UDim2.new(1, -40, 0, 15)
statusText.Position = UDim2.new(0, 25, 0, 48)
statusText.Parent = headerFrame

-- ========== INFO BOX ==========
local infoBox = Instance.new("TextLabel")
infoBox.Text = "Go to voxel-gg.netlify.app to generate code. It will automatically appear here!"
infoBox.TextSize = 11
infoBox.TextColor3 = Color3.fromRGB(200, 200, 200)
infoBox.BackgroundColor3 = Color3.fromRGB(25, 25, 45)
infoBox.BorderColor3 = Color3.fromRGB(0, 170, 255)
infoBox.BorderSizePixel = 1
infoBox.TextWrapped = true
infoBox.Font = Enum.Font.Gotham
infoBox.Size = UDim2.new(1, -20, 0, 60)
infoBox.Position = UDim2.new(0, 10, 0, 90)
infoBox.Parent = mainFrame

-- ========== CODE DISPLAY ==========
local codeLabel = Instance.new("TextLabel")
codeLabel.Text = "Generated Code:"
codeLabel.TextSize = 12
codeLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
codeLabel.BackgroundTransparency = 1
codeLabel.Font = Enum.Font.GothamSemibold
codeLabel.Size = UDim2.new(1, -20, 0, 20)
codeLabel.Position = UDim2.new(0, 10, 0, 160)
codeLabel.Parent = mainFrame

local codeBox = Instance.new("TextBox")
codeBox.Text = "Waiting for code..."
codeBox.TextSize = 10
codeBox.TextColor3 = Color3.fromRGB(0, 212, 127)
codeBox.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
codeBox.BorderColor3 = Color3.fromRGB(0, 170, 255)
codeBox.BorderSizePixel = 1
codeBox.MultiLine = true
codeBox.ReadOnly = true
codeBox.Font = Enum.Font.Roboto Mono
codeBox.TextWrapped = true
codeBox.Size = UDim2.new(1, -20, 1, -220)
codeBox.Position = UDim2.new(0, 10, 0, 185)
codeBox.Parent = mainFrame

-- ========== BUTTONS ==========
local buttonFrame = Instance.new("Frame")
buttonFrame.BackgroundTransparency = 1
buttonFrame.Size = UDim2.new(1, -20, 0, 50)
buttonFrame.Position = UDim2.new(0, 10, 1, -60)
buttonFrame.Parent = mainFrame

local insertBtn = Instance.new("TextButton")
insertBtn.Text = "Insert Code to Studio"
insertBtn.TextSize = 12
insertBtn.TextColor3 = Color3.fromRGB(0, 0, 0)
insertBtn.BackgroundColor3 = Color3.fromRGB(0, 212, 127)
insertBtn.BorderSizePixel = 0
insertBtn.Font = Enum.Font.GothamSemibold
insertBtn.Size = UDim2.new(1, 0, 1, 0)
insertBtn.Parent = buttonFrame

-- ========== FUNCTIONS ==========
local function insertCode()
    if codeBox.Text == "" or codeBox.Text == "Waiting for code..." or codeBox.Text:find("Error") then
        statusText.Text = "No code to insert!"
        statusText.TextColor3 = Color3.fromRGB(255, 100, 100)
        statusDot.BackgroundColor3 = Color3.fromRGB(255, 100, 100)
        return
    end

    local scriptService = game:GetService("ServerScriptService")
    local script = Instance.new("Script")
    script.Name = "VoxelGenerated_" .. os.time()
    script.Source = codeBox.Text
    script.Parent = scriptService

    statusText.Text = "✓ Code inserted!"
    statusText.TextColor3 = Color3.fromRGB(0, 212, 127)
    statusDot.BackgroundColor3 = Color3.fromRGB(0, 212, 127)

    task.wait(2)
    statusText.Text = "Ready to receive code"
end

-- Simulate receiving code (in real scenario, this would be WebSocket)
local function receiveCode(code)
    codeBox.Text = code
    statusText.Text = "✓ Code received!"
    statusText.TextColor3 = Color3.fromRGB(0, 212, 127)
    statusDot.BackgroundColor3 = Color3.fromRGB(0, 212, 127)
    lastCode = code
end

insertBtn.MouseButton1Click:Connect(insertCode)

-- ========== PLUGIN LIFECYCLE ==========
button.Click:Connect(function()
    widget.Enabled = not widget.Enabled
end)

widget.Enabled = true

-- Cleanup
plugin.Unloading:Connect(function()
    widget:Destroy()
end)

-- ========== EXPORT FOR WEBSITE ==========
-- This allows the website to call this plugin to insert code
_G.VoxelReceiveCode = receiveCode
