# Step 4: API Keys Collection - Interactive Guide

## 🎯 What We'll Do

1. Copy Gemini API key from your existing `.env.local`
2. Get HeyGen credentials (API key, Avatar ID, Voice ID)

**Estimated time:** 5 minutes

---

## 🤖 Step 4.1: Gemini API Key (Already Have It!)

You mentioned you already have Gemini API in your `.env.local` file.

### Action 1: Find Your Existing Gemini Key
1. Open your existing project's `.env.local` file
2. Look for a line like:
   ```
   GEMINI_API_KEY=AIza...
   ```
   or
   ```
   GOOGLE_AI_API_KEY=AIza...
   ```
3. Copy the key value (the part after the `=`)
4. Save it for Step 6 (Configuration)

**✅ Gemini API Key:** `AIza...` (starts with "AIza")

---

## 🎬 Step 4.2: HeyGen Credentials

You mentioned you have HeyGen Pro. Now we need 3 things:

### Action 2: Get HeyGen API Key
1. Go to: https://app.heygen.com/
2. Sign in to your account
3. Click on your **profile icon** (top right)
4. Select **"API Keys"** or **"Settings"** → **"API"**
5. You should see your API key, or create a new one
6. Click **"Copy"** to copy the API key

**✅ HeyGen API Key:** `hg_...` (save this)

---

### Action 3: Get Avatar ID
1. In HeyGen, go to **"Avatars"**
2. Choose the avatar you want to use for videos
3. Click on the avatar
4. Look for **"Avatar ID"** or click **"Use in API"**
5. Copy the Avatar ID (looks like: `avatar_abc123xyz`)

**✅ Avatar ID:** `avatar_...` (save this)

**Note:** If you don't have a custom avatar, you can use HeyGen's stock avatars. Just pick one and get its ID.

---

### Action 4: Get Voice ID
1. In HeyGen, go to **"Voices"** or **"Voice Library"**
2. Choose the voice you want for narration
3. Click on the voice
4. Look for **"Voice ID"** or **"Use in API"**
5. Copy the Voice ID (looks like: `voice_abc123xyz`)

**✅ Voice ID:** `voice_...` (save this)

**Note:** Pick a voice that matches your content style (professional, friendly, etc.)

---

## 📝 Step 4.3: Optional Services (Can Skip for Now)

These are optional - you can add them later if needed:

### Canva API (for Infographics)
- Sign up at: https://www.canva.com/developers/
- Get API key if you want automated infographics

### Pictory API (for Explainer Videos)
- Sign up at: https://pictory.ai/
- Get API key if you want explainer videos separate from HeyGen

**For now, we'll use HeyGen for videos and can add others later!**

---

## ✅ Step 4 Complete! What You Should Have:

- [ ] Gemini API Key (from your existing `.env.local`)
- [ ] HeyGen API Key
- [ ] HeyGen Avatar ID
- [ ] HeyGen Voice ID

---

## 💬 When Done, Reply With:

```
Step 4 done ✅
Got all keys: Gemini, HeyGen API, Avatar ID, Voice ID
```

**(Don't paste the actual keys here - we'll add them to the .env file in Step 6)**

---

## 🆘 Troubleshooting

**Can't find HeyGen API key?**
- Go to Settings → API or Integrations
- You may need to generate a new API key if you don't have one
- Contact HeyGen support if needed

**Can't find Avatar/Voice IDs?**
- Look for "API" or "Developer" sections in HeyGen
- Check the avatar/voice details or settings
- Some avatars show the ID when you hover over "Use in API"

**Need help?** Just ask and I'll guide you through!
