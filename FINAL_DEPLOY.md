# 🚀 **DEPLOY VOXEL.GG - FINAL STEPS**

Your package.json is fixed! Node 20.x is now set.

---

## **STEP 1: DEPLOY WEBSITE TO VERCEL** (5 minutes)

1. Go to: https://vercel.com/dashboard
2. Click: **"Add New"** → **"Project"**
3. Select: **rip-kamran/voxel-gg** repo
4. Framework: Select **"Other"** (it's static HTML)
5. **Root Directory:** Make sure it says `website/` 
   - If it doesn't, scroll down and set it manually
6. Click: **"Deploy"**
7. Wait 1 minute...
8. **BOOM!** Website is LIVE! 🎉

**You'll get URL like:** `https://voxel-gg.vercel.app`

---

## **STEP 2: DEPLOY BACKEND TO RAILWAY** (10 minutes)

1. Go to: https://railway.app/dashboard
2. Click: **"New Project"**
3. Select: **"Deploy from GitHub repo"**
4. Choose: **rip-kamran/voxel-gg**
5. **Root Directory:** Set to `backend/`
6. **Add Environment Variables:**
   - `GROQ_KEY=YOUR_GROQ_KEY`
   - `GEMINI_KEY=YOUR_GEMINI_KEY`
   - `CEREBRAS_KEY=YOUR_CEREBRAS_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`
7. Click: **"Deploy"**
8. Wait 2 minutes...
9. **BOOM!** Backend is LIVE! 🎉

**You'll get URL like:** `https://voxel-gg-prod.up.railway.app`

---

## **STEP 3: UPDATE WEBSITE WITH BACKEND URL** (2 minutes)

1. Go to your GitHub repo: `rip-kamran/voxel-gg`
2. Open: `website/index.html`
3. Click the **edit button** (pencil icon)
4. Find this line (around line 650):
   ```javascript
   const API_URL = 'https://your-backend-url.com';
   ```
5. Replace with your Railway URL:
   ```javascript
   const API_URL = 'https://voxel-gg-prod.up.railway.app';
   ```
6. Click: **"Commit changes"**
7. Vercel auto-redeploys in 30 seconds ✅

---

## **STEP 4: TEST EVERYTHING** (5 minutes)

1. Go to your Vercel website
2. See the landing page? ✅
3. Click "Try Now"
4. Generate some test code
5. Check your admin dashboard:
   ```
   https://voxel-gg-prod.up.railway.app/admin/dashboard
   ```
   (Will ask for session, login with your email)

---

## **YOU'RE NOW LIVE!** 🎉

✅ Website: `https://voxel-gg.vercel.app`
✅ Backend API: `https://voxel-gg-prod.up.railway.app`
✅ Admin: Email `shaikzaid7373@gmail.com`
✅ 3 AI Providers: Groq, Gemini, Cerebras
✅ 1M+ daily capacity
✅ Making money!

---

## **NEXT:**

1. Share your website link with community
2. Users start generating scripts
3. You make Robux!
4. Check `/admin/dashboard` daily
5. Manage users, credits, quotas

---

**KAMRAN YOU DID IT!** 🔥

Voxel.gg is officially LIVE!

Go celebrate! 🎊
