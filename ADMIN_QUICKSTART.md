# 👑 **ADMIN QUICK START**

**Your email is now admin:** `shaikzaid7373@gmail.com`

---

## 🚀 **3-Step Admin Setup**

### **Step 1: Login as Admin (Copy & Save This)**

```bash
curl -X POST https://your-railway-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shaikzaid7373@gmail.com"}'
```

**You'll get back:**
```
sessionId: session_1234567890_abc...
```

**SAVE THIS SESSION ID** - use it for all admin commands.

---

### **Step 2: Check Your Dashboard**

```bash
curl https://your-railway-url/admin/dashboard \
  -H "x-session-id: YOUR_SESSION_ID"
```

**You'll see:**
- All users
- All credits
- API usage
- Who's online
- Everything!

---

### **Step 3: Manage Your Service**

**Want to give someone free credits?**
```bash
curl -X POST https://your-railway-url/admin/users/USER_ID/add-credits \
  -H "x-session-id: YOUR_SESSION_ID" \
  -d '{"amount": 100}'
```

**Want to ban a spammer?**
```bash
curl -X POST https://your-railway-url/admin/users/USER_ID/ban \
  -H "x-session-id: YOUR_SESSION_ID" \
  -d '{"ban": true}'
```

**Want to see all users?**
```bash
curl https://your-railway-url/admin/users \
  -H "x-session-id: YOUR_SESSION_ID"
```

---

## 📋 **All Admin Commands**

| Command | Does | When to Use |
|---------|------|------------|
| `POST /auth/login` | Get session ID | Every time you need to access admin |
| `GET /admin/dashboard` | See everything | Check daily status |
| `GET /admin/users` | List all users | Find someone's ID |
| `POST /admin/users/ID/add-credits` | Give free credits | Reward users, influencers |
| `POST /admin/users/ID/reset-credits` | Reset to 20 | Fix bugs, user issues |
| `POST /admin/users/ID/ban` | Ban user | Stop spammers |
| `DELETE /admin/users/ID` | Delete user | Remove completely |

---

## 🔑 **Important: Session ID**

**What it is:** Proof you're the admin

**How to get it:**
```bash
curl -X POST https://your-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"shaikzaid7373@gmail.com"}'
```

**How to use it:** Add to every admin request:
```bash
-H "x-session-id: YOUR_SESSION_ID"
```

**How long it lasts:** Until you close the browser/session

**If it expires:** Just login again to get a new one

---

## 📊 **Dashboard Shows You**

```json
{
  "totalUsers": 1250,           ← How many people signed up
  "totalCreditsUsed": 3450.20,  ← How much they've used
  "totalCreditsSpent": 580.00,  ← How much Robux you earned
  "activeSessions": 42,         ← Currently online
  "apiStatus": [                ← How full your APIs are
    { "name": "Groq", "percentUsed": 59 },
    { "name": "Gemini", "percentUsed": 89 },
    { "name": "Cerebras", "percentUsed": 0 }
  ]
}
```

---

## 💡 **Real Examples**

### **Example 1: User Lost Their Credits**

```bash
# 1. Find them in /admin/users
# 2. Get their USER_ID
# 3. Reset their credits:

curl -X POST https://your-url/admin/users/user_12345/reset-credits \
  -H "x-session-id: YOUR_SESSION"
```

Done! They now have 20 credits again.

---

### **Example 2: Give Free Credits to Influencer**

```bash
# They want to promote your tool, so give them 1000 free credits:

curl -X POST https://your-url/admin/users/user_67890/add-credits \
  -H "x-session-id: YOUR_SESSION" \
  -d '{"amount": 1000}'
```

Now they can demo 1250+ scripts!

---

### **Example 3: Ban a Spammer**

```bash
# Bot is generating 10,000 scripts/day trying to break you:

curl -X POST https://your-url/admin/users/user_99999/ban \
  -H "x-session-id: YOUR_SESSION" \
  -d '{"ban": true}'
```

Done! They can't use Voxel anymore.

---

## 🎯 **Admin Powers Summary**

With your admin access, you can:

✅ **See everything** - All users, all activity, all data  
✅ **Give free credits** - Reward users, influencers, testers  
✅ **Reset credits** - Fix bugs, help people  
✅ **Ban users** - Stop spammers, abusers  
✅ **Delete users** - Remove completely  
✅ **Monitor quotas** - Check API usage daily  
✅ **Track revenue** - See Robux earned  

**Essentially:** Complete control over your service.

---

## 🚀 **You're Ready!**

1. ✅ Backend has admin system
2. ✅ You're automatically admin (email: shaikzaid7373@gmail.com)
3. ✅ All admin commands work
4. ✅ Dashboard shows everything

Just deploy and start managing! 👑

---

For detailed info, see: `ADMIN_GUIDE.md`
