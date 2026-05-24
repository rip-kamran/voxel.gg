--!strict
--[=[
    VOXEL.GG - Roblox Studio Plugin
    AI-powered Luau script generator
    
    Installation:
    1. Copy this entire script
    2. Open Roblox Studio
    3. Home → Plugins → Manage Plugins
    4. Create New Plugin
    5. Paste this code
    6. Save
    7. Reload Studio
    8. Click ⚡ Voxel button!
]=]

local toolbar = plugin:CreateToolbar("Voxel")
local button = toolbar:CreateButton("⚡ Voxel", "AI Script Generator", "rbxasset://textures/Startup/Home/2.0/GeneralCollaborationTab/ic-plugins.png")

-- ========== CONFIGURATION ==========
local API_URL = "https://your-supabase-project.supabase.co/functions/v1/voxel-api" -- UPDATE THIS!
local USER_ID = tostring(game:GetService("Players").LocalPlayer.UserId or "studio_user_" .. os.time())
local PLUGIN_VERSION = "2.0.0"

-- ========== UI SETUP ==========
local widget = Instance.new("DockWidgetPluginGui")
widget.Name = "VoxelWidget"
widget.Title = "⚡ Voxel.gg"
widget.ResetOnSpawn = false
widget.InitialDockState = Enum.InitialDockState.Right
widget.Size = UDim2.new(0, 500, 0, 750)
widget.MinSize = UDim2.new(0, 400, 0, 600)

-- Main container
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
headerFrame.Size = UDim2.new(1, 0, 0, 60)
headerFrame.Parent = mainFrame

local headerLabel = Instance.new("TextLabel")
headerLabel.Name = "Title"
headerLabel.Text = "⚡ Voxel.gg"
headerLabel.TextSize = 20
headerLabel.TextColor3 = Color3.fromRGB(0, 170, 255)
headerLabel.BackgroundTransparency = 1
headerLabel.Font = Enum.Font.GothamBold
headerLabel.Size = UDim2.new(1, -10, 0, 30)
headerLabel.Position = UDim2.new(0, 10, 0, 5)
headerLabel.Parent = headerFrame

local versionLabel = Instance.new("TextLabel")
versionLabel.Name = "Version"
versionLabel.Text = "v" .. PLUGIN_VERSION
versionLabel.TextSize = 10
versionLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
versionLabel.BackgroundTransparency = 1
versionLabel.Font = Enum.Font.Gotham
versionLabel.Size = UDim2.new(1, -10, 0, 15)
versionLabel.Position = UDim2.new(0, 10, 0, 30)
versionLabel.Parent = headerFrame

-- Status indicator
local statusIndicator = Instance.new("Frame")
statusIndicator.Name = "StatusIndicator"
statusIndicator.BackgroundColor3 = Color3.fromRGB(0, 170, 255)
statusIndicator.BorderSizePixel = 0
statusIndicator.Size = UDim2.new(0, 8, 0, 8)
statusIndicator.Position = UDim2.new(1, -18, 0, 13)
statusIndicator.Parent = headerFrame

local statusLabel = Instance.new("TextLabel")
statusLabel.Name = "StatusLabel"
statusLabel.Text = "Ready"
statusLabel.TextSize = 10
statusLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
statusLabel.BackgroundTransparency = 1
statusLabel.Font = Enum.Font.Gotham
statusLabel.Size = UDim2.new(0, 40, 0, 10)
statusLabel.Position = UDim2.new(1, -65, 0, 13)
statusLabel.Parent = headerFrame

-- ========== PROMPT INPUT ==========
local promptLabel = Instance.new("TextLabel")
promptLabel.Name = "PromptLabel"
promptLabel.Text = "Describe your script:"
promptLabel.TextSize = 12
promptLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
promptLabel.BackgroundTransparency = 1
promptLabel.Font = Enum.Font.GothamSemibold
promptLabel.Size = UDim2.new(1, -20, 0, 20)
promptLabel.Position = UDim2.new(0, 10, 0, 70)
promptLabel.Parent = mainFrame

local promptBox = Instance.new("TextBox")
promptBox.Name = "PromptBox"
promptBox.Text = ""
promptBox.PlaceholderText = "e.g., Create a function that prints Hello World"
promptBox.TextSize = 11
promptBox.TextColor3 = Color3.fromRGB(230, 230, 230)
promptBox.PlaceholderColor3 = Color3.fromRGB(100, 100, 100)
promptBox.BackgroundColor3 = Color3.fromRGB(25, 25, 45)
promptBox.BorderColor3 = Color3.fromRGB(0, 170, 255)
promptBox.BorderSizePixel = 1
promptBox.ClearTextOnFocus = false
promptBox.Font = Enum.Font.Gotham
promptBox.TextWrapped = true
promptBox.Size = UDim2.new(1, -20, 0, 100)
promptBox.Position = UDim2.new(0, 10, 0, 95)
promptBox.Parent = mainFrame

-- Cost indicator
local costLabel = Instance.new("TextLabel")
costLabel.Name = "CostLabel"
costLabel.Text = "Cost: 0.8 credits"
costLabel.TextSize = 11
costLabel.TextColor3 = Color3.fromRGB(150, 200, 150)
costLabel.BackgroundTransparency = 1
costLabel.Font = Enum.Font.Gotham
costLabel.Size = UDim2.new(0.5, -10, 0, 20)
costLabel.Position = UDim2.new(0, 10, 0, 200)
costLabel.Parent = mainFrame

local creditsLabel = Instance.new("TextLabel")
creditsLabel.Name = "CreditsLabel"
creditsLabel.Text = "Credits: --"
creditsLabel.TextSize = 11
creditsLabel.TextColor3 = Color3.fromRGB(0, 170, 255)
creditsLabel.BackgroundTransparency = 1
creditsLabel.Font = Enum.Font.GothamSemibold
creditsLabel.Size = UDim2.new(0.5, -10, 0, 20)
creditsLabel.Position = UDim2.new(0.5, 0, 0, 200)
creditsLabel.Parent = mainFrame

-- ========== CODE OUTPUT ==========
local codeLabel = Instance.new("TextLabel")
codeLabel.Name = "CodeLabel"
codeLabel.Text = "Generated Code:"
codeLabel.TextSize = 12
codeLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
codeLabel.BackgroundTransparency = 1
codeLabel.Font = Enum.Font.GothamSemibold
codeLabel.Size = UDim2.new(1, -20, 0, 20)
codeLabel.Position = UDim2.new(0, 10, 0, 230)
codeLabel.Parent = mainFrame

local codeBox = Instance.new("TextBox")
codeBox.Name = "CodeBox"
codeBox.Text = ""
codeBox.PlaceholderText = "Your generated code will appear here..."
codeBox.TextSize = 10
codeBox.TextColor3 = Color3.fromRGB(0, 212, 127)
codeBox.PlaceholderColor3 = Color3.fromRGB(80, 80, 100)
codeBox.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
codeBox.BorderColor3 = Color3.fromRGB(0, 170, 255)
codeBox.BorderSizePixel = 1
codeBox.MultiLine = true
codeBox.ReadOnly = true
codeBox.Font = Enum.Font.Roboto Mono
codeBox.TextWrapped = true
codeBox.Size = UDim2.new(1, -20, 0, 250)
codeBox.Position = UDim2.new(0, 10, 0, 255)
codeBox.Parent = mainFrame

-- ========== BUTTONS ==========
local buttonFrame = Instance.new("Frame")
buttonFrame.Name = "ButtonFrame"
buttonFrame.BackgroundTransparency = 1
buttonFrame.Size = UDim2.new(1, -20, 0, 50)
buttonFrame.Position = UDim2.new(0, 10, 1, -60)
buttonFrame.Parent = mainFrame

local function createButton(name, text, position, color)
    local btn = Instance.new("TextButton")
    btn.Name = name
    btn.Text = text
    btn.TextSize = 11
    btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    btn.BackgroundColor3 = color
    btn.BorderSizePixel = 0
    btn.Font = Enum.Font.GothamSemibold
    btn.Size = UDim2.new(0.48, 0, 1, 0)
    btn.Position = position
    btn.Parent = buttonFrame
    return btn
end

local generateBtn = createButton("GenerateBtn", "Generate", UDim2.new(0, 0, 0, 0), Color3.fromRGB(0, 170, 255))
local insertBtn = createButton("InsertBtn", "Insert Code", UDim2.new(0.52, 0, 0, 0), Color3.fromRGB(0, 212, 127))

-- ========== FUNCTIONS ==========
local function updateCost()
    local promptLength = #promptBox.Text
    local cost = promptLength > 100 and 2.5 or 0.8
    costLabel.Text = "Cost: " .. cost .. " credits"
end

promptBox:GetPropertyChangedSignal("Text"):Connect(updateCost)

local function setStatus(text, color)
    statusLabel.Text = text
    statusIndicator.BackgroundColor3 = color
end

local function generateCode()
    if promptBox.Text == "" then
        setStatus("No prompt!", Color3.fromRGB(255, 100, 100))
        return
    end

    setStatus("Generating...", Color3.fromRGB(255, 165, 0))
    generateBtn.Enabled = false
    codeBox.Text = "⏳ Generating code..."

    local success, result = pcall(function()
        local httpService = game:GetService("HttpService")
        
        local payload = {
            prompt = promptBox.Text,
            userId = USER_ID
        }

        local response = httpService:PostAsync(
            API_URL .. "/generate",
            httpService:JSONEncode(payload),
            Enum.HttpContentType.ApplicationJson,
            false
        )

        return httpService:JSONDecode(response)
    end)

    if success and result then
        if result.success then
            codeBox.Text = result.code
            creditsLabel.Text = "Credits: " .. tostring(result.remainingCredits)
            setStatus("✓ Ready", Color3.fromRGB(0, 212, 127))
        else
            codeBox.Text = "❌ Error: " .. (result.error or "Unknown error")
            setStatus("Error", Color3.fromRGB(255, 100, 100))
        end
    else
        codeBox.Text = "❌ Connection failed. Check API URL in plugin code."
        setStatus("Offline", Color3.fromRGB(255, 100, 100))
    end

    generateBtn.Enabled = true
end

local function insertCode()
    if codeBox.Text == "" or codeBox.Text:find("⏳") or codeBox.Text:find("❌") then
        setStatus("No valid code!", Color3.fromRGB(255, 100, 100))
        return
    end

    local selection = game:GetService("Selection"):Get()
    if #selection == 0 then
        setStatus("Select a location first!", Color3.fromRGB(255, 165, 0))
        return
    end

    local parent = selection[1]
    local script = Instance.new("LocalScript")
    script.Name = "VoxelGenerated"
    script.Source = codeBox.Text
    script.Parent = parent

    setStatus("✓ Inserted!", Color3.fromRGB(0, 212, 127))
    promptBox.Text = ""
    codeBox.Text = ""
end

generateBtn.MouseButton1Click:Connect(generateCode)
insertBtn.MouseButton1Click:Connect(insertCode)

button.Click:Connect(function()
    widget.Enabled = not widget.Enabled
end)

-- Show widget on startup
widget.Enabled = true
setStatus("Ready", Color3.fromRGB(0, 212, 127))

-- Cleanup
plugin.Unloading:Connect(function()
    widget:Destroy()
end)
