# ⚡ Voxel.gg - 15 Minute Quick Start

**Get Voxel.gg live in 15 minutes. Everything you need is here.**

---

## 🎯 What You'll Have

✅ Backend running on Railway (auto-deployed)  
✅ Website live on Vercel  
✅ Plugin installed in Roblox Studio  
✅ Generating code in seconds  

---

## ⏱️ Step 1: Get API Keys (5 minutes)

### Groq (Fastest)
1. Go to https://console.groq.com
2. Click "Sign Up" → Create free account
3. Go to API Keys
4. Click "Create New API Key"
5. **Copy:** `gsk_...` (paste in .env later)

### Gemini
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. **Copy:** `AIza_...`

### OpenRouter
1. Go to https://openrouter.ai/auth/signup
2. Create account
3. Go to Settings → API Keys
4. **Copy:** `sk-or-v1_...`

**⏱️ Time: 5 minutes ✓**

---

## 🚀 Step 2: Deploy Backend (5 minutes)

### Option A: Railway (Recommended)

1. **Create GitHub Repo**
   ```bash
   git init voxel-gg
   cd voxel-gg
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Go to https://railway.app**
   - Click "New Project"
   - Click "Deploy from GitHub repo"
   - Select your voxel-gg repo
   - **Add Variables:**
     - `GROQ_KEY` = `gsk_...`
     - `GEMINI_KEY` = `AIza_...`
     - `OPENROUTER_KEY` = `sk-or-v1_...`
   - Click Deploy! 🎉

3. **Copy your URL** (looks like: `https://voxel-gg-prod.up.railway.app`)

**⏱️ Time: 5 minutes ✓**

---

## 🌐 Step 3: Deploy Website (3 minutes)

### Vercel

1. **Go to https://vercel.com**
   - Click "New Project"
   - Select your GitHub repo
   - Set root directory: `website`
   - Click Deploy! 🎉

2. **Update website API URL:**
   - Edit `website/index.html`
   - Find: `const API_URL = ...`
   - Replace with: `const API_URL = 'https://your-railway-url.up.railway.app'`
   - Push to GitHub (auto-redeployed)

**⏱️ Time: 3 minutes ✓**

---

## 🔌 Step 4: Update Plugin (2 minutes)

In your plugin code, find:
```lua
local API_URL = "https://voxel-gg-prod.up.railway.app"
```

Replace with your Railway URL.

**⏱️ Time: 2 minutes ✓**

---

## ✅ Verify Everything Works

### Test 1: Backend Health
```bash
curl https://your-railway-url.up.railway.app/health
```
Should return: `{"status":"ok",...}`

### Test 2: Generate Code
```bash
curl -X POST https://your-railway-url.up.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -H "x-user-id: test" \
  -d '{"prompt":"Give players 10 coins"}'
```
Should return Luau code!

### Test 3: Website
Open: https://voxel-gg.vercel.app  
Should look beautiful! ✨

### Test 4: Plugin
- Install plugin in Studio
- Click "⚡ Voxel"
- Type a prompt
- Click Generate
- Should get code in 2-3 seconds!

---

## 🎉 You're Live!

**Total time: ~15 minutes**

Your Voxel.gg instance is now:
- ✅ Generating Luau code
- ✅ Running on Railway (scales automatically)
- ✅ Hosted on Vercel (blazing fast)
- ✅ Integrated with Roblox Studio
- ✅ Making Kamran090907 proud 🚀

---

## 📚 Next Steps

1. **Test with real prompts** - Try different script types
2. **Share with friends** - Get feedback
3. **Monitor performance** - Check Railway logs
4. **Upgrade API quotas** - When you get busy
5. **Add database** - When you have 100+ users
6. **Integrate Robux** - For monetization

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't connect" | Check Railway URL in plugin |
| "APIs exhausted" | Wait until midnight UTC |
| "Empty code" | Be more specific in prompt |
| "Website slow" | Rebuild on Vercel |
| "500 error" | Check API keys in Railway |

---

## 📁 Your Files

You have everything in `/mnt/user-data/outputs/`:
- `index.html` - Website (copy to `website/` folder)
- `server.js` - Backend (copy to `backend/` folder)
- `package.json` - Dependencies
- `.env.example` - Template (copy to `.env`)
- `.gitignore` - Git ignore rules
- `DEPLOYMENT_GUIDE.md` - Full detailed guide
- `README.md` - Complete documentation

---

## 🎯 Checklist Before Going Live

- [ ] API keys obtained and working
- [ ] Backend deployed to Railway
- [ ] Website deployed to Vercel
- [ ] API URL updated in website
- [ ] API URL updated in plugin
- [ ] Plugin installed in Studio
- [ ] Test generation works
- [ ] Share link with users!

---

## 💡 Pro Tips

1. **Share this link:** `https://voxel-gg.vercel.app` (your website)
2. **Users install plugin** from the website
3. **Plugin connects to your backend**
4. **They generate code** right in Studio
5. **You're helping the community** while making Robux! 💰

---

## 🚀 Ready?

1. Get API keys ✓
2. Deploy backend ✓
3. Deploy website ✓
4. Update URLs ✓
5. Test everything ✓
6. **You're live!** 🎉

**Kamran090907, you built something amazing.** Go make some magic! ⚡

---

**Questions?** Check `DEPLOYMENT_GUIDE.md` or `README.md` for details.

**Need help?** All code is documented and ready to go.

**Let's ship this!** 🚀
