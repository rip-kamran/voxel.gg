# 🎯 Action Items - Launch Voxel.gg

**Your exact to-do list to launch. Do these in order.**

---

## ✅ Phase 1: Preparation (Today - 30 min)

### Task 1.1: Get Groq API Key (5 min)
- [ ] Open https://console.groq.com
- [ ] Click "Sign Up" (free)
- [ ] Create account (email verification)
- [ ] Go to "API Keys"
- [ ] Click "Create New API Key"
- [ ] Copy the key (starts with `gsk_`)
- [ ] Save in notepad: `GROQ_KEY=gsk_...`

### Task 1.2: Get Gemini API Key (5 min)
- [ ] Open https://aistudio.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the key (starts with `AIza_`)
- [ ] Save in notepad: `GEMINI_KEY=AIza_...`

### Task 1.3: Get OpenRouter API Key (5 min)
- [ ] Open https://openrouter.ai/auth/signup
- [ ] Create free account
- [ ] Go to Settings → API Keys
- [ ] Copy the key (starts with `sk-or-v1_`)
- [ ] Save in notepad: `OPENROUTER_KEY=sk-or-v1_...`

### Task 1.4: Create GitHub Repository (10 min)
- [ ] Go to https://github.com/new
- [ ] Name: `voxel-gg`
- [ ] Description: "AI-powered Luau script generator for Roblox"
- [ ] Create repository
- [ ] Clone to your computer:
  ```bash
  git clone https://github.com/YOUR_USERNAME/voxel-gg.git
  cd voxel-gg
  ```

### Task 1.5: Copy All Files (5 min)
From the outputs folder, copy these files:
- [ ] `server.js` → `backend/server.js`
- [ ] `package.json` → `backend/package.json`
- [ ] `.env.example` → `backend/.env.example`
- [ ] `index.html` → `website/index.html`
- [ ] `.gitignore` → `.gitignore`
- [ ] All markdown files to root

---

## ✅ Phase 2: Configuration (Today - 15 min)

### Task 2.1: Create .env File (5 min)
In `backend/` folder:
- [ ] Create file: `.env`
- [ ] Add these lines:
  ```
  GROQ_KEY=gsk_YOUR_KEY_HERE
  GEMINI_KEY=AIza_YOUR_KEY_HERE
  OPENROUTER_KEY=sk-or-v1_YOUR_KEY_HERE
  PORT=3000
  NODE_ENV=production
  ```
- [ ] Replace `YOUR_KEY_HERE` with actual keys from Phase 1
- [ ] **Save the file**

### Task 2.2: Create .gitignore (1 min)
- [ ] Verify `.gitignore` file exists in root
- [ ] Should contain: `.env` and `node_modules/`
- [ ] ⚠️ **CRITICAL:** This prevents secrets from leaking!

### Task 2.3: Test Locally (5 min)
```bash
cd backend
npm install
npm start
```
- [ ] Should say: "🚀 Voxel.gg API Server running on port 3000"
- [ ] Test: `curl http://localhost:3000/health`
- [ ] Should return: `{"status":"ok"...}`
- [ ] Stop server: `Ctrl+C`

### Task 2.4: Push to GitHub (3 min)
```bash
git add .
git commit -m "Initial commit: Voxel.gg backend and website"
git push -u origin main
```
- [ ] All files uploaded to GitHub
- [ ] ⚠️ **Verify** `.env` is NOT in the commit (should be in .gitignore)

---

## ✅ Phase 3: Deploy Backend (Tomorrow - 10 min)

### Task 3.1: Create Railway Account (2 min)
- [ ] Go to https://railway.app
- [ ] Click "New Project"
- [ ] Sign up with GitHub
- [ ] Authorize Railway to access your GitHub

### Task 3.2: Deploy Backend (5 min)
- [ ] Click "Deploy from GitHub repo"
- [ ] Select `voxel-gg` repository
- [ ] Select `backend` directory (important!)
- [ ] Add variables (one by one):
  - [ ] Click "Add Variable"
  - [ ] Name: `GROQ_KEY` → Value: `gsk_...`
  - [ ] Name: `GEMINI_KEY` → Value: `AIza_...`
  - [ ] Name: `OPENROUTER_KEY` → Value: `sk-or-v1_...`
- [ ] Click "Deploy"
- [ ] Wait for deployment (~3 min)

### Task 3.3: Get Railway URL (2 min)
- [ ] Click on your project
- [ ] Copy domain (looks like: `voxel-gg-prod.up.railway.app`)
- [ ] Save in notepad: `RAILWAY_URL=https://voxel-gg-prod.up.railway.app`

### Task 3.4: Test Backend (1 min)
```bash
curl https://YOUR_RAILWAY_URL/health
```
- [ ] Should return: `{"status":"ok"...}`
- [ ] ✅ Backend is live!

---

## ✅ Phase 4: Deploy Website (Tomorrow - 10 min)

### Task 4.1: Create Vercel Account (2 min)
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up"
- [ ] Use GitHub account
- [ ] Authorize Vercel

### Task 4.2: Configure Website (3 min)
Before deploying, update API URL:
- [ ] Open `website/index.html`
- [ ] Find line: `const API_URL = ...`
- [ ] Replace with: `const API_URL = 'https://YOUR_RAILWAY_URL'`
- [ ] Save file
- [ ] Commit to GitHub:
  ```bash
  git add website/index.html
  git commit -m "Update API URL for production"
  git push
  ```

### Task 4.3: Deploy Website (3 min)
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Select `voxel-gg` repository
- [ ] Framework: "Other"
- [ ] Root Directory: `website`
- [ ] Click "Deploy"
- [ ] Wait for deployment (~2 min)

### Task 4.4: Get Website URL (2 min)
- [ ] Vercel shows URL: `voxel-gg.vercel.app`
- [ ] Click link to visit website
- [ ] Should look beautiful! ✨

---

## ✅ Phase 5: Test Everything (Tomorrow - 15 min)

### Task 5.1: Test Backend Health (2 min)
```bash
curl https://YOUR_RAILWAY_URL/health
```
- [ ] Response: `{"status":"ok"}`
- [ ] ✅ Backend responding

### Task 5.2: Test Code Generation (5 min)
```bash
curl -X POST https://YOUR_RAILWAY_URL/api/generate \
  -H "Content-Type: application/json" \
  -H "x-user-id: test_user" \
  -d '{"prompt":"Create a script that gives players 10 coins"}'
```
- [ ] Response includes Luau code
- [ ] Code starts with `#!strict`
- [ ] Code includes comments
- [ ] ✅ Generation working!

### Task 5.3: Test Website (3 min)
- [ ] Open: `https://voxel-gg.vercel.app`
- [ ] Hero section loads
- [ ] All text visible
- [ ] Images/icons render
- [ ] Buttons clickable
- [ ] Mobile responsive (test on phone)
- [ ] ✅ Website live!

### Task 5.4: Test Installation Instructions (3 min)
- [ ] Click "Get Plugin" button
- [ ] Modal appears
- [ ] Installation steps clear
- [ ] Copy button works (test)
- [ ] ✅ Ready for users!

### Task 5.5: Test Admin Stats (2 min)
```bash
curl https://YOUR_RAILWAY_URL/admin/stats
```
- [ ] Shows: users, credits used, API status
- [ ] ✅ Monitoring ready!

---

## ✅ Phase 6: Plugin Setup (Tomorrow - 10 min)

### Task 6.1: Update Plugin Code (5 min)
- [ ] Find plugin code in your files
- [ ] Look for line: `local API_URL = "http://localhost:3000"`
- [ ] Replace with: `local API_URL = "https://YOUR_RAILWAY_URL"`
- [ ] Save plugin code

### Task 6.2: Install Plugin in Studio (5 min)
- [ ] Open Roblox Studio
- [ ] Go to **Home → Plugins → Manage Plugins**
- [ ] Click **Create New Plugin**
- [ ] Paste updated plugin code
- [ ] Click **Save**
- [ ] Reload Studio
- [ ] See **⚡ Voxel** in toolbar
- [ ] ✅ Plugin installed!

---

## ✅ Phase 7: Full System Test (Tomorrow - 20 min)

### Task 7.1: Generate Your First Code (5 min)
- [ ] Open Roblox Studio with plugin
- [ ] Click **⚡ Voxel** in toolbar
- [ ] Type prompt: `"Create a click detector that gives 10 coins"`
- [ ] Click **Generate**
- [ ] Wait 2-3 seconds
- [ ] See Luau code appear
- [ ] Code shows in output box
- [ ] ✅ Generation working!

### Task 7.2: Insert Code (5 min)
- [ ] Click **Insert** button
- [ ] Code appears in ServerScriptService
- [ ] Script name: `VoxelScript_...`
- [ ] Code is valid Luau
- [ ] ✅ Insertion working!

### Task 7.3: Test Multiple Generations (5 min)
- [ ] Generate 3 different prompts:
  - [ ] "NPC dialogue system"
  - [ ] "Health and damage system"
  - [ ] "Shop with currency"
- [ ] All generate successfully
- [ ] All insert correctly
- [ ] Credits decrease appropriately
- [ ] ✅ Scaling test passed!

### Task 7.4: Test Error Handling (5 min)
- [ ] Try empty prompt → Should error
- [ ] Try very long prompt → Should truncate
- [ ] Disconnect internet → Should error gracefully
- [ ] All errors are clear
- [ ] ✅ Error handling good!

---

## ✅ Phase 8: Launch & Share (Day 3)

### Task 8.1: Create README (5 min)
- [ ] You have `README.md` ready
- [ ] Post on GitHub
- [ ] Update with:
  - [ ] Your website URL
  - [ ] Your creator name
  - [ ] Any custom info

### Task 8.2: Share Website (5 min)
Create posts about Voxel.gg:
- [ ] Roblox Community Discord: Share link
- [ ] Reddit r/roblox: Share link
- [ ] Twitter/X: Tweet about it
- [ ] Roblox DevForums: Create topic

### Task 8.3: Monitor First Users (Ongoing)
- [ ] Watch for first generations
- [ ] Check `/admin/stats` for activity
- [ ] Watch for errors in Railway logs
- [ ] Be ready to help users

### Task 8.4: Get Feedback (Week 1)
- [ ] Ask users: "What features would you want?"
- [ ] Ask users: "Any bugs?"
- [ ] Ask users: "Would you pay for credits?"
- [ ] Iterate based on feedback

---

## 📋 Complete Checklist

### Phase 1: Preparation
- [ ] Task 1.1: Groq API key
- [ ] Task 1.2: Gemini API key
- [ ] Task 1.3: OpenRouter API key
- [ ] Task 1.4: GitHub repository
- [ ] Task 1.5: Copy all files

### Phase 2: Configuration
- [ ] Task 2.1: Create .env file
- [ ] Task 2.2: Verify .gitignore
- [ ] Task 2.3: Test locally
- [ ] Task 2.4: Push to GitHub

### Phase 3: Backend Deployment
- [ ] Task 3.1: Create Railway account
- [ ] Task 3.2: Deploy to Railway
- [ ] Task 3.3: Get Railway URL
- [ ] Task 3.4: Test backend

### Phase 4: Website Deployment
- [ ] Task 4.1: Create Vercel account
- [ ] Task 4.2: Configure website (API URL)
- [ ] Task 4.3: Deploy to Vercel
- [ ] Task 4.4: Get website URL

### Phase 5: Testing
- [ ] Task 5.1: Test backend health
- [ ] Task 5.2: Test code generation
- [ ] Task 5.3: Test website
- [ ] Task 5.4: Test installation
- [ ] Task 5.5: Test admin stats

### Phase 6: Plugin
- [ ] Task 6.1: Update plugin API URL
- [ ] Task 6.2: Install in Studio

### Phase 7: Full Test
- [ ] Task 7.1: Generate first code
- [ ] Task 7.2: Insert into Studio
- [ ] Task 7.3: Test multiple generations
- [ ] Task 7.4: Test error handling

### Phase 8: Launch
- [ ] Task 8.1: Create README
- [ ] Task 8.2: Share website
- [ ] Task 8.3: Monitor users
- [ ] Task 8.4: Get feedback

---

## ⏱️ Time Estimate

| Phase | Tasks | Time |
|-------|-------|------|
| 1: Preparation | 5 | 30 min |
| 2: Configuration | 4 | 15 min |
| 3: Backend Deploy | 4 | 10 min |
| 4: Website Deploy | 4 | 10 min |
| 5: Testing | 5 | 15 min |
| 6: Plugin Setup | 2 | 10 min |
| 7: Full Test | 4 | 20 min |
| 8: Launch | 4 | 15 min |
| **TOTAL** | **32** | **~2 hours** |

---

## 🚀 Ready?

Print this checklist. Go through each task. Check them off as you complete.

By the end of today, Voxel.gg will be **live and generating code**.

**Let's do this!** ⚡

---

## 💡 Pro Tips

1. **Do Phase 1-2 first** - Get API keys, create repo, push code
2. **Deploy overnight** - Start Railway/Vercel, let them deploy
3. **Test in morning** - Verify everything works
4. **Launch by midday** - Share with community
5. **Monitor for bugs** - Watch logs first 24 hours

---

## 🆘 If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| "API key invalid" | Regenerate on provider's website |
| "Cannot connect to Railway" | Check .env file, redeploy |
| "Website shows errors" | Check API_URL in index.html |
| "Generation fails" | Check Railway logs for errors |
| "Code won't insert" | Update plugin API_URL |

---

## 🎉 When You're Done

You'll have:
✅ Live backend (Railway)  
✅ Live website (Vercel)  
✅ Working plugin (Studio)  
✅ Generating code (2-3s)  
✅ First users (coming soon!)  
✅ Revenue stream (Robux!)  

**Congrats!** You built an AI tool! 🎊

---

**Questions?** Check the documentation files:
- `QUICK_START.md` - For quick reference
- `DEPLOYMENT_GUIDE.md` - For detailed steps
- `INDEX.md` - For file explanations

**Now go launch it!** 🚀
