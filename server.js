const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ========== VOXEL CONFIG ==========
const BRAND_NAME = 'Voxel';
const BRAND_DOMAIN = 'voxel.gg';
const CREATOR_NAME = 'Kamran090907';
const ADMIN_EMAIL = 'shaikzaid7373@gmail.com'; // ← YOUR ADMIN EMAIL

// ========== API CONFIGURATION ==========
const APIs = [
    {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        key: process.env.GROQ_KEY,
        model: 'llama-3.1-8b-instant',
        dailyLimit: 14400,
        requestsToday: 0,
        lastReset: new Date(),
        enabled: true,
        priority: 1
    },
    {
        name: 'Gemini',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        key: process.env.GEMINI_KEY,
        model: 'gemini-2.0-flash',
        dailyLimit: 1000,
        requestsToday: 0,
        lastReset: new Date(),
        enabled: true,
        priority: 2
    },
    {
        name: 'Cerebras',
        url: 'https://api.cerebras.ai/v1/chat/completions',
        key: process.env.CEREBRAS_KEY,
        model: 'llama-3.1-8b',
        dailyLimit: 1000000,
        requestsToday: 0,
        lastReset: new Date(),
        enabled: true,
        priority: 3
    }
];

const COSTS = { SMALL: 0.8, BIG: 2.5 };
const FREE_MONTHLY_CREDITS = 20;

// ========== DATABASE (In-memory for launch) ==========
const users = new Map();
const sessions = new Map(); // Track logged-in users

const getUser = (userId) => {
    if (!users.has(userId)) {
        users.set(userId, {
            userId,
            email: null,
            credits: FREE_MONTHLY_CREDITS,
            lastReset: new Date(),
            totalUsed: 0,
            purchasedCredits: 0,
            createdAt: new Date(),
            isAdmin: false,
            lastLogin: new Date(),
            banned: false
        });
    }
    return users.get(userId);
};

const getOrCreateUser = (userId) => {
    const user = getUser(userId);
    const now = new Date();
    
    // Reset monthly credits
    if (user.lastReset.getMonth() !== now.getMonth() || user.lastReset.getFullYear() !== now.getFullYear()) {
        user.credits = FREE_MONTHLY_CREDITS + user.purchasedCredits;
        user.lastReset = now;
    }
    
    return user;
};

// ========== AUTHENTICATION ==========
const loginUser = (email) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isAdmin = email === ADMIN_EMAIL;
    
    sessions.set(sessionId, {
        email,
        isAdmin,
        loginTime: new Date(),
        lastActivity: new Date()
    });
    
    return { sessionId, isAdmin, email };
};

const verifySession = (sessionId) => {
    if (!sessions.has(sessionId)) return null;
    
    const session = sessions.get(sessionId);
    session.lastActivity = new Date();
    
    return session;
};

const requireAdmin = (req, res, next) => {
    const sessionId = req.headers['x-session-id'];
    const session = verifySession(sessionId);
    
    if (!session || !session.isAdmin) {
        return res.status(403).json({
            error: 'Unauthorized',
            message: 'Admin access required'
        });
    }
    
    req.session = session;
    next();
};

// ========== API ROTATION ==========
function resetDailyCounters() {
    const now = new Date();
    APIs.forEach(api => {
        if (api.lastReset.getDate() !== now.getDate() || 
            api.lastReset.getMonth() !== now.getMonth() ||
            api.lastReset.getFullYear() !== now.getFullYear()) {
            api.requestsToday = 0;
            api.lastReset = now;
            api.enabled = true;
            console.log(`🌅 ${api.name} daily limit reset`);
        }
    });
}

function getAvailableAPI() {
    resetDailyCounters();
    const available = APIs
        .filter(api => api.enabled && api.requestsToday < api.dailyLimit)
        .sort((a, b) => a.priority - b.priority);
    
    return available[0] || null;
}

function exhaustAPI(apiName) {
    const api = APIs.find(a => a.name === apiName);
    if (api) {
        api.enabled = false;
        console.log(`⚠️ ${apiName} exhausted (${api.requestsToday}/${api.dailyLimit})`);
    }
}

function getTotalRemaining() {
    resetDailyCounters();
    return APIs.reduce((sum, api) => sum + Math.max(0, api.dailyLimit - api.requestsToday), 0);
}

// ========== SYSTEM PROMPT ==========
const SYSTEM_PROMPT = `You are VoxelBot, an expert Roblox Luau developer powered by ${BRAND_NAME}.gg.

CRITICAL RULES:
1. Output ONLY valid Luau code. NO markdown fences, NO \`\`\`lua\`\`\`, NO explanations.
2. Start with #!strict
3. Use type annotations for all function parameters and returns
4. Use modern APIs: task.wait(), task.spawn(), task.delay()
5. Cache services at the top: local Players = game:GetService("Players")
6. Use FindFirstChildOfClass/FindFirstChildWhichIsA with proper nil checks
7. NEVER use: loadstring, getfenv, setfenv, debug.*, _G
8. Handle errors with pcall when calling untrusted code
9. Write clean, well-commented code
10. Follow Roblox security best practices

OUTPUT ONLY CODE. NO OTHER TEXT. NO MARKDOWN. JUST CODE.`;

// ========== CODE CLEANING ==========
function cleanCode(code) {
    code = code.replace(/```luau\n?/g, '').replace(/```lua\n?/g, '').replace(/```\n?/g, '').trim();
    
    const chattyPrefixes = [
        /^Here is your code:?\s*/i,
        /^This is the Luau code:?\s*/i,
        /^The following script:?\s*/i,
        /^Here is the script:?\s*/i,
        /^I've created the code:?\s*/i,
        /^Below is the code:?\s*/i,
    ];
    
    chattyPrefixes.forEach(regex => {
        code = code.replace(regex, '');
    });
    
    if (!code.includes('#!strict')) {
        const firstKeyword = code.search(/\b(local|function|if|for|while|repeat|pcall|return)\b/);
        if (firstKeyword > 0) {
            code = code.substring(firstKeyword);
        }
        code = '#!strict\n\n' + code;
    }
    
    return code.trim();
}

// ========== API CALLS WITH TIMEOUTS ==========
async function callGroq(api, prompt, isBig) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    try {
        const response = await fetch(api.url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: api.model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: isBig ? 4096 : 2048
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            if (response.status === 429) throw new Error('RATE_LIMIT');
            if (response.status === 401) throw new Error('INVALID_KEY');
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return cleanCode(data.choices[0].message.content);
        
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

async function callGemini(api, prompt, isBig) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    try {
        const response = await fetch(`${api.url}?key=${api.key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
                generationConfig: { 
                    temperature: 0.2, 
                    maxOutputTokens: isBig ? 4096 : 2048 
                }
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            if (response.status === 429) throw new Error('RATE_LIMIT');
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return cleanCode(data.candidates[0].content.parts[0].text);
        
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

async function callCerebras(api, prompt, isBig) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    
    try {
        const response = await fetch(api.url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: api.model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: isBig ? 4096 : 2048
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            if (response.status === 429) throw new Error('RATE_LIMIT');
            if (response.status === 402) throw new Error('OUT_OF_CREDITS');
            if (response.status === 408 || response.status === 504) throw new Error('TIMEOUT');
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return cleanCode(data.choices[0].message.content);
        
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

// ========== RESILIENT GENERATOR ==========
async function generateLuauCode(prompt, isBig) {
    let api = getAvailableAPI();
    let attempted = [];
    
    while (api) {
        try {
            console.log(`🔄 ${BRAND_NAME} using ${api.name} (${api.model})...`);
            
            let code;
            if (api.name === 'Groq') code = await callGroq(api, prompt, isBig);
            else if (api.name === 'Gemini') code = await callGemini(api, prompt, isBig);
            else code = await callCerebras(api, prompt, isBig);
            
            if (!code || code.trim() === '') {
                throw new Error('Empty response');
            }
            
            api.requestsToday++;
            return { code, provider: api.name, model: api.model };
            
        } catch (error) {
            console.error(`❌ ${api.name} failed:`, error.message);
            attempted.push(`${api.name} (${error.message})`);
            exhaustAPI(api.name);
            api = getAvailableAPI();
        }
    }
    
    throw new Error(`All APIs exhausted. Attempted: ${attempted.join(', ')}`);
}

// ========== ROUTES ==========

// ========== PUBLIC ROUTES ==========
app.get('/', (req, res) => {
    res.json({
        status: `${BRAND_NAME}.gg API`,
        brand: BRAND_NAME,
        creator: CREATOR_NAME,
        version: '1.0.0',
        totalRequestsRemaining: getTotalRemaining(),
        dailyCapacity: 1015400,
        apis: APIs.map(api => ({
            name: api.name,
            model: api.model,
            limit: api.dailyLimit,
            remaining: Math.max(0, api.dailyLimit - api.requestsToday)
        })),
        costs: COSTS
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        brand: BRAND_NAME,
        timestamp: new Date().toISOString()
    });
});

// ========== LOGIN (Get Session) ==========
app.post('/auth/login', (req, res) => {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            error: 'Invalid email',
            message: 'Email required'
        });
    }
    
    const { sessionId, isAdmin, email: userEmail } = loginUser(email);
    
    res.json({
        success: true,
        sessionId,
        email: userEmail,
        isAdmin,
        message: isAdmin ? '🎉 Welcome Admin!' : '✅ Logged in'
    });
});

// ========== GENERATION ENDPOINT ==========
app.post('/generate', (req, res) => {
    const { prompt, userId } = req.body;
    const sessionId = req.headers['x-session-id'];
    const session = verifySession(sessionId);
    
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ 
            error: 'Prompt required',
            brand: BRAND_NAME
        });
    }
    
    const user = getOrCreateUser(userId || session?.email || `user_${Date.now()}`);
    const len = prompt.length;
    const isBig = len > 100;
    const cost = isBig ? COSTS.BIG : COSTS.SMALL;
    
    if (user.credits < cost) {
        return res.status(402).json({
            error: 'Insufficient credits',
            brand: BRAND_NAME,
            required: cost,
            available: user.credits,
            message: `Need ${cost} credits. You have ${user.credits}. Buy more with Robux!`
        });
    }
    
    generateLuauCode(prompt, isBig)
        .then(result => {
            user.credits -= cost;
            user.totalUsed += cost;
            
            res.json({
                success: true,
                code: result.code,
                brand: BRAND_NAME,
                generatedBy: result.provider,
                model: result.model,
                cost,
                size: isBig ? 'BIG' : 'SMALL',
                remainingCredits: user.credits,
                message: `✨ Generated by ${result.provider}! ${cost} credits used.`
            });
        })
        .catch(error => {
            console.error('Generation error:', error);
            res.status(503).json({
                success: false,
                error: 'All APIs exhausted',
                brand: BRAND_NAME,
                message: `${BRAND_NAME} APIs at capacity. Resets at midnight UTC.`,
                details: error.message
            });
        });
});

// ========== ADMIN ENDPOINTS ==========

// Admin Stats Dashboard
app.get('/admin/dashboard', requireAdmin, (req, res) => {
    const stats = {
        brand: BRAND_NAME,
        admin: req.session.email,
        timestamp: new Date().toISOString(),
        totalUsers: users.size,
        totalCreditsUsed: Array.from(users.values()).reduce((s, u) => s + u.totalUsed, 0),
        totalCreditsSpent: Array.from(users.values()).reduce((s, u) => s + (u.purchasedCredits || 0), 0),
        activeSessions: sessions.size,
        apiStatus: APIs.map(api => ({
            name: api.name,
            model: api.model,
            used: api.requestsToday,
            limit: api.dailyLimit,
            remaining: Math.max(0, api.dailyLimit - api.requestsToday),
            enabled: api.enabled,
            percentUsed: Math.round((api.requestsToday / api.dailyLimit) * 100)
        })),
        totalRemaining: getTotalRemaining(),
        users: Array.from(users.values()).map(u => ({
            userId: u.userId,
            email: u.email,
            credits: u.credits,
            totalUsed: u.totalUsed,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin,
            isAdmin: u.isAdmin,
            banned: u.banned
        }))
    };
    
    res.json(stats);
});

// Reset User Credits (Admin Only)
app.post('/admin/users/:userId/reset-credits', requireAdmin, (req, res) => {
    const { userId } = req.params;
    const user = getUser(userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.credits = FREE_MONTHLY_CREDITS + user.purchasedCredits;
    user.lastReset = new Date();
    
    res.json({
        success: true,
        message: `Credits reset for user ${userId}`,
        user: {
            userId: user.userId,
            credits: user.credits
        }
    });
});

// Add Credits to User (Admin Only)
app.post('/admin/users/:userId/add-credits', requireAdmin, (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const user = getUser(userId);
    user.credits += amount;
    
    res.json({
        success: true,
        message: `Added ${amount} credits to ${userId}`,
        user: {
            userId: user.userId,
            credits: user.credits
        }
    });
});

// Ban/Unban User (Admin Only)
app.post('/admin/users/:userId/ban', requireAdmin, (req, res) => {
    const { userId } = req.params;
    const { ban } = req.body;
    
    const user = getUser(userId);
    user.banned = ban === true;
    
    res.json({
        success: true,
        message: `User ${userId} is now ${user.banned ? 'banned' : 'unbanned'}`,
        user: {
            userId: user.userId,
            banned: user.banned
        }
    });
});

// View All Users (Admin Only)
app.get('/admin/users', requireAdmin, (req, res) => {
    const allUsers = Array.from(users.values()).map(u => ({
        userId: u.userId,
        email: u.email,
        credits: u.credits,
        totalUsed: u.totalUsed,
        purchasedCredits: u.purchasedCredits,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
        isAdmin: u.isAdmin,
        banned: u.banned
    }));
    
    res.json({
        success: true,
        total: allUsers.length,
        users: allUsers
    });
});

// Delete User (Admin Only)
app.delete('/admin/users/:userId', requireAdmin, (req, res) => {
    const { userId } = req.params;
    
    if (users.has(userId)) {
        users.delete(userId);
        res.json({
            success: true,
            message: `User ${userId} deleted`
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        brand: BRAND_NAME
    });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        brand: BRAND_NAME,
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`⚡ ${BRAND_NAME}.gg API Server`);
    console.log(`${'='.repeat(50)}`);
    console.log(`🚀 Running on port ${PORT}`);
    console.log(`📊 Daily Capacity: 1,015,400 requests`);
    console.log(`🔑 Groq: 14,400 | Gemini: 1,000 | Cerebras: 1,000,000`);
    console.log(`👑 Admin: ${ADMIN_EMAIL}`);
    console.log(`💰 Revenue to: ${CREATOR_NAME}`);
    console.log(`${'='.repeat(50)}\n`);
});

setInterval(resetDailyCounters, 60000);

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
