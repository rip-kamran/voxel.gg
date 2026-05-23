# 🚀 Voxel.gg Complete Deployment Guide

## Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     USER (Roblox Studio)                     │
└─────────────────────────────────────────────────────────────┘
                           ↕
                      Plugin (Luau)
                           ↕
┌─────────────────────────────────────────────────────────────┐
│              Voxel.gg Backend (Railway)                      │
│  ├─ Express.js Server                                       │
│  ├─ API Rotation (Groq → Gemini → OpenRouter)              │
│  ├─ Credit System (In-memory, upgrade to DB later)         │
│  └─ Robux Payment Handler                                   │
└─────────────────────────────────────────────────────────────┘
                           ↕
                    Three AI Providers
┌──────────────┬──────────────┬──────────────┐
│    Groq      │   Gemini     │ OpenRouter   │
│  14,400/day  │  1,000/day   │ 28,800/day   │
└──────────────┴──────────────┴──────────────┘
```

---

## Part 1: Deploy Backend to Railway.app

### Step 1: Prepare Your Repository

```bash
# Create a new folder for your project
mkdir voxel-gg
cd voxel-gg

# Initialize git
git init

# Create project structure
mkdir backend
mkdir website

# Copy server.js to backend folder
cp server.js backend/server.js
```

### Step 2: Create package.json

Create `backend/package.json`:
```json
{
  "name": "voxel-gg-api",
  "version": "1.0.0",
  "description": "AI-powered Luau script generation for Roblox",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Step 3: Create .env File

Create `backend/.env`:
```
GROQ_KEY=gsk_your_groq_api_key_here
GEMINI_KEY=AIza_your_gemini_api_key_here
OPENROUTER_KEY=sk-or-v1_your_openrouter_key_here
PORT=3000
NODE_ENV=production
```

**⚠️ CRITICAL: Add to `.gitignore`:**
```
.env
node_modules/
.DS_Store
*.log
npm-debug.log
```

### Step 4: Get API Keys

#### Groq API Key
1. Go to https://console.groq.com
2. Sign up (free account)
3. Go to API Keys
4. Create new key
5. Copy it to `GROQ_KEY`

#### Google Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy it to `GEMINI_KEY`

#### OpenRouter API Key
1. Go to https://openrouter.ai
2. Sign up or log in
3. Go to Settings → API Key
4. Copy it to `OPENROUTER_KEY`

### Step 5: Deploy to Railway

1. **Go to https://railway.app**
2. **Sign up with GitHub**
3. **Connect your GitHub account**
4. **Click "New Project"**
5. **Select "GitHub Repo"**
6. **Connect your voxel-gg repository**
7. **Add environment variables:**
   - Click "Add Variable"
   - Add each API key from your `.env` file
8. **Railway auto-deploys** when you push to GitHub!

**After deployment:**
- You'll get a URL like: `https://voxel-gg-prod.up.railway.app`
- Your backend is now live! ✅

---

## Part 2: Deploy Website to Vercel

### Step 1: Create Vercel Config

Create `vercel.json` in the root:
```json
{
  "buildCommand": "echo 'Static site ready'",
  "outputDirectory": "website",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Update Website Configuration

In `website/index.html`, find this line:
```javascript
// const API_URL = 'http://localhost:3000';
const API_URL = 'https://voxel-gg-prod.up.railway.app'; // Use your Railway URL
```

### Step 3: Deploy to Vercel

1. **Go to https://vercel.com**
2. **Click "New Project"**
3. **Select your voxel-gg GitHub repo**
4. **Configure:**
   - Framework: "Other" (it's static HTML)
   - Root Directory: `website`
5. **Click Deploy** ✅

Your website is live at: `https://voxel-gg.vercel.app`

---

## Part 3: Update Plugin API URL

In the Roblox plugin code, find this line:
```lua
local API_URL = "https://voxel-gg-prod.up.railway.app" -- Change to your Railway URL
```

Update it to your actual Railway backend URL.

---

## Part 4: Verify Everything Works

### Test Backend
```bash
curl https://voxel-gg-prod.up.railway.app/health

# Should return:
# {"status":"ok","brand":"Voxel","timestamp":"2026-05-09..."}
```

### Test Generation
```bash
curl -X POST https://voxel-gg-prod.up.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -H "x-user-id: test_user_123" \
  -d '{"prompt":"Create a script that gives players 10 coins"}'

# Should return generated Luau code!
```

### Test Website
- Open https://voxel-gg.vercel.app
- Click "Get Plugin"
- Install the plugin in Studio
- It should connect to your Railway backend

---

## Part 5: Domain Setup (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your domain (e.g., `voxel.gg`)
4. Update DNS records per Vercel instructions
5. Wait 24 hours for propagation

### Add Domain to Railway
1. Go to Railway Project Settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS per Railway instructions

---

## Part 6: Monitoring & Debugging

### View Backend Logs
```bash
# Railway automatically shows logs in the dashboard
# Or use Railway CLI:
railway logs
```

### View Website Logs
```bash
# Vercel shows logs in the dashboard
# Check real-time analytics
```

### Admin Stats Endpoint
```bash
curl https://voxel-gg-prod.up.railway.app/admin/stats

# Returns:
{
  "brand": "Voxel",
  "totalUsers": 42,
  "totalCreditsUsed": 156.8,
  "apiStatus": [...],
  "totalRemaining": 41200
}
```

---

## Part 7: Troubleshooting

### Plugin Can't Connect to Backend
- **Check:** Is your Railway URL correct in the plugin?
- **Check:** Is the backend running? Test `/health` endpoint
- **Check:** Are API keys valid? Check Railway logs
- **Solution:** Redeploy with correct API keys

### Generation Failing with "APIs Exhausted"
- This means all three providers hit daily limits
- **Wait** until midnight UTC when limits reset
- Or **upgrade API quotas** (paid plans on Groq/Gemini/OpenRouter)

### Credits Not Deducting
- Check if user ID is being sent: `x-user-id` header
- Check `/status` endpoint to verify user exists
- Check backend logs for errors

### API Returns Empty Code
- The AI model might be failing
- Check that system prompt is correct
- Test with a simpler prompt
- Check backend logs for the actual API error

---

## Part 8: Scaling (When You Have Users!)

### When You Get Many Users:

**1. Upgrade to Database**
```bash
# Add MongoDB to Railway
# Update users.js to use MongoDB instead of Map
```

**2. Increase API Quotas**
- Groq: Upgrade to paid plan
- Gemini: Request higher quota
- OpenRouter: Add payment method for higher limits

**3. Add Rate Limiting**
```javascript
// In server.js, add this
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30 // limit each IP to 30 requests per windowMs
});
app.use(limiter);
```

**4. Add Caching**
```javascript
// Cache popular prompts to save credits
const cache = new Map();
```

---

## Part 9: Environment Variables Checklist

Before deploying, ensure you have:

- [ ] GROQ_KEY - From https://console.groq.com
- [ ] GEMINI_KEY - From https://aistudio.google.com/app/apikey
- [ ] OPENROUTER_KEY - From https://openrouter.ai/settings
- [ ] API_URL updated in website
- [ ] API_URL updated in plugin
- [ ] .gitignore includes .env
- [ ] No API keys in code comments

---

## Part 10: Monitoring & Health Checks

### Railway Health Checks
```bash
# Railway automatically monitors your app
# Set up in Railway dashboard:
# Health Check URL: /health
# Expected Status: 200
```

### Uptime Monitoring (Free)
Use https://uptimerobot.com to monitor:
- `https://voxel-gg-prod.up.railway.app/health`
- Gets alerted if backend goes down
- Logs downtime history

---

## Part 11: Future Enhancements

Once you have the basic system working:

1. **Database** - Move from in-memory to MongoDB for persistence
2. **Robux Integration** - Connect to actual Roblox game passes
3. **Analytics** - Track which scripts are most generated
4. **Leaderboard** - Show top generators
5. **Discord Bot** - Generate scripts from Discord
6. **VS Code Extension** - Use Voxel from your IDE
7. **Templates** - Pre-built prompts for common patterns

---

## Quick Reference: File Structure

```
voxel-gg/
├── backend/
│   ├── server.js        ← Main backend
│   ├── package.json     ← Dependencies
│   └── .env             ← API keys (NEVER commit!)
├── website/
│   └── index.html       ← Beautiful landing page
├── .gitignore           ← Exclude .env, node_modules
├── vercel.json          ← Vercel config
└── README.md            ← This file
```

---

## Final Checklist

- [ ] Backend deployed to Railway
- [ ] Website deployed to Vercel
- [ ] API keys configured in Railway
- [ ] Website API_URL points to Railway
- [ ] Plugin API_URL points to Railway
- [ ] Tested backend with curl
- [ ] Tested generation with real prompt
- [ ] Plugin installs successfully
- [ ] Plugin generates code
- [ ] Code is #!strict compliant

---

## Support

- **Docs:** https://voxel.gg/docs
- **Discord:** (coming soon)
- **Creator:** Kamran090907

---

**You're live!** 🎉 Share Voxel.gg with the Roblox community and start helping developers build faster!
