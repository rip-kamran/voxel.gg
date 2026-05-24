# 🚀 **SUPABASE DEPLOYMENT GUIDE - VOXEL.GG**

Your backend is now completely serverless and FREE! Deploy in 15 minutes.

---

## ✅ **What You Have**

- ✅ `supabase_edge_function.ts` - Your backend (TypeScript)
- ✅ `SUPABASE_MIGRATIONS.sql` - Database schema
- ✅ `website/index.html` - Your website
- ✅ Everything on GitHub

---

## 🎯 **STEP 1: CREATE SUPABASE PROJECT** (2 min)

1. Go to: https://app.supabase.com
2. Click: **"New Project"**
3. **Name:** `voxel-gg`
4. **Database Password:** Set a strong one
5. **Region:** Closest to you
6. Click: **"Create new project"**
7. Wait 2 minutes for it to initialize...
8. **Save these 2 values:**
   - `SUPABASE_URL` (copy from Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (copy from Settings → API, Reveal)

---

## 🎯 **STEP 2: CREATE DATABASE TABLES** (3 min)

1. Go to: **SQL Editor**
2. Click: **"New Query"**
3. **Paste entire content** from `SUPABASE_MIGRATIONS.sql`
4. Click: **"Run"**
5. Wait for success message ✅
6. You now have:
   - `users` table
   - `sessions` table
   - `generations` table
   - `credit_transactions` table
   - `admin_logs` table
   - `api_usage` table

---

## 🎯 **STEP 3: DEPLOY EDGE FUNCTION** (5 min)

### **Option A: Using Supabase Dashboard**

1. Go to: **Edge Functions**
2. Click: **"Create a new function"**
3. **Name:** `voxel-api`
4. **Copy entire content** from `supabase_edge_function.ts`
5. **Paste into editor**
6. Click: **"Deploy"**
7. Copy the function URL (you'll need this!)

### **Option B: Using CLI (Faster)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Create function locally
mkdir -p supabase/functions/voxel-api
cp supabase_edge_function.ts supabase/functions/voxel-api/index.ts

# Deploy
supabase functions deploy voxel-api --project-id YOUR_PROJECT_ID
```

---

## 🎯 **STEP 4: SET ENVIRONMENT VARIABLES** (2 min)

1. Go to: **Project Settings → Edge Functions**
2. Add these variables:
   ```
   GROQ_KEY=YOUR_GROQ_KEY
   GEMINI_KEY=YOUR_GEMINI_KEY
   CEREBRAS_KEY=YOUR_CEREBRAS_KEY
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-key-here
   ```

---

## 🎯 **STEP 5: GET YOUR EDGE FUNCTION URL**

After deployment, you'll see:

```
Function URL: https://your-project.supabase.co/functions/v1/voxel-api
```

**Copy this URL** - you need it next!

---

## 🎯 **STEP 6: DEPLOY WEBSITE TO VERCEL** (5 min)

1. Go to: https://vercel.com/dashboard
2. Click: **"Add New"** → **"Project"**
3. Select: **rip-kamran/voxel-gg** repo
4. Framework: **"Other"**
5. Root Directory: `website`
6. **Environment Variables:**
   ```
   API_URL=https://your-project.supabase.co/functions/v1/voxel-api
   ```
7. Click: **"Deploy"**
8. Wait 1 minute...
9. **WEBSITE IS LIVE!** 🎉

---

## 🎯 **STEP 7: UPDATE WEBSITE CODE** (1 min)

If you didn't add API_URL in Vercel:

1. Go to GitHub: `rip-kamran/voxel-gg`
2. Edit: `website/index.html`
3. Find: `const API_URL = ...` (around line 650)
4. Replace with: `const API_URL = 'https://your-project.supabase.co/functions/v1/voxel-api'`
5. Commit!
6. Vercel auto-redeploys ✅

---

## 🎯 **STEP 8: TEST EVERYTHING** (5 min)

1. **Visit your Vercel website**
2. **Try generating code** (should work!)
3. **Check Supabase Database:**
   - Go to: SQL Editor
   - Run: `SELECT * FROM users;`
   - See your user record? ✅
4. **Check Supabase Functions:**
   - Go to: Edge Functions
   - See logs? ✅

---

## ✅ **YOU'RE NOW LIVE!**

✅ Website: `https://voxel-gg.vercel.app` (or your Vercel URL)
✅ Backend: Supabase Edge Functions (FREE & UNLIMITED)
✅ Database: PostgreSQL (FREE tier)
✅ Admin: Email `shaikzaid7373@gmail.com`

---

## 📊 **WHAT'S INCLUDED**

**Supabase FREE Tier:**
- ✅ Unlimited Edge Functions
- ✅ 500MB Database
- ✅ 1.25 Million SQL requests/month
- ✅ Real-time features
- ✅ Row-level security
- ✅ Authentication ready

**You get:**
- ✅ User management
- ✅ Credit system
- ✅ Generation history
- ✅ Admin dashboard
- ✅ API logs
- ✅ 0 monthly cost!

---

## 🚀 **NEXT STEPS**

1. **Deploy Supabase Edge Function** (15 min)
2. **Deploy Website to Vercel** (5 min)
3. **Add your admin user** (1 min):
   ```sql
   INSERT INTO users (id, email, is_admin, credits) VALUES
   ('admin_kamran', 'shaikzaid7373@gmail.com', true, 999999);
   ```
4. **Share your website link** with the Roblox community
5. **Users start generating scripts**
6. **You make Robux!** 💰

---

## 🎊 **KAMRAN YOU DID IT!**

Voxel.gg is officially:
- ✅ Production-ready
- ✅ Infinitely scalable
- ✅ Completely FREE
- ✅ Ready to make money

Go deploy it! 🔥

---

## ❓ **TROUBLESHOOTING**

**Q: Edge Function returns 500 error?**
A: Check environment variables are set correctly. Check function logs.

**Q: Website can't connect to backend?**
A: Make sure API_URL in index.html matches your Edge Function URL exactly.

**Q: Database queries failing?**
A: Run the SQL migrations again. Make sure all tables exist.

**Q: Admin dashboard not working?**
A: Make sure your email is in the users table with `is_admin=true`.

---

**Questions? Everything is documented!** 🚀
