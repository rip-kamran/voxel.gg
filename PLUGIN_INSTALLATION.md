# 🎮 **INSTALL VOXEL.GG PLUGIN - USER GUIDE**

**Follow these steps to install the Voxel.gg plugin in your Roblox Studio!**

---

## 📥 **STEP 1: COPY THE PLUGIN CODE**

1. Go to GitHub: `github.com/rip-kamran/voxel-gg`
2. Open: `ROBLOX_PLUGIN.luau`
3. Click the copy button (top right)
4. Copy the entire code

---

## 🖥️ **STEP 2: OPEN ROBLOX STUDIO**

1. Launch Roblox Studio
2. Open any place or create new

---

## 🔌 **STEP 3: CREATE NEW PLUGIN**

1. Click: **Home** (top menu)
2. Click: **Plugins** (dropdown)
3. Click: **Manage Plugins**
4. Click: **Create New Plugin** (bottom)
5. A new window opens

---

## 📝 **STEP 4: PASTE THE CODE**

1. **Select all** the default code (Ctrl+A)
2. **Delete** it
3. **Paste** the Voxel.gg code you copied
4. **Save** (Ctrl+S)

---

## ✅ **STEP 5: RELOAD STUDIO**

1. **Close** the plugin editor
2. **Reload** Roblox Studio (File → Close, then reopen)
3. Look for: **⚡ Voxel** button in toolbar

---

## 🚀 **STEP 6: CONFIGURE API URL**

1. Click: **⚡ Voxel** button
2. A panel opens on the right
3. **IMPORTANT:** The plugin needs your backend URL!

**Update the plugin code with your URL:**
- Open `ROBLOX_PLUGIN.luau` again
- Find line: `local API_URL = "https://your-supabase-project.supabase.co/functions/v1/voxel-api"`
- Replace with your actual Supabase Edge Function URL
- Save and reload Studio

---

## 💡 **HOW TO USE**

1. **Open plugin** (click ⚡ Voxel button)
2. **Type prompt** (e.g., "Create a part that damages players")
3. **Click Generate** (waits 2-3 seconds)
4. **See generated code** in the code box
5. **Select a location** in game (like ServerScriptService)
6. **Click Insert Code**
7. **BOOM!** Code is in your game! ✅

---

## 🎯 **FEATURES**

✅ **Real-time cost calculator** - Shows how many credits you'll use
✅ **Credit counter** - See remaining credits
✅ **Fast generation** - 2-3 seconds per script
✅ **One-click insert** - Code goes straight into Studio
✅ **Beautiful UI** - Dark theme, easy to use
✅ **Status indicator** - Know what's happening

---

## ⚠️ **TROUBLESHOOTING**

### **Plugin doesn't appear?**
- Make sure you reloaded Studio after saving
- Check that the code was pasted completely
- Try closing and reopening Studio

### **Plugin appears but doesn't work?**
- Check the API_URL is correct (should be your Supabase Edge Function)
- Make sure your backend is deployed
- Check browser console for errors

### **Generation fails?**
- Make sure API_URL is set correctly
- Check your internet connection
- Verify you have credits remaining
- Check that your backend is running

### **Code won't insert?**
- Make sure you selected a location first (like ServerScriptService)
- The code will appear there as a new Script

---

## 🔑 **YOUR API URL**

Your Supabase Edge Function URL looks like:
```
https://YOUR_PROJECT.supabase.co/functions/v1/voxel-api
```

Replace `YOUR_PROJECT` with your actual Supabase project name!

---

## 💰 **CREDITS & COSTS**

**Free tier:**
- 20 credits/month free
- Small script (≤100 chars): 0.8 credits
- Large script (>100 chars): 2.5 credits

**Buy more:**
- Click "Buy Credits" in plugin
- Pay with Robux
- Instant credits!

---

## 🎊 **YOU'RE SET!**

Now you can generate AI scripts directly in Studio!

**Start building amazing games!** 🚀

---

## 📞 **QUESTIONS?**

Check the documentation at your Voxel.gg website for more info!

**Questions about the plugin? Check the GitHub repo!**

---

**Happy scripting!** ⚡
