# Sada — Voice Q&A Agent Setup Guide

Ye ek chhota project hai: ek frontend (jo mic se sawal sunta hai, jawab bolta
hai) aur ek backend (jo Claude ko sawal bhejta hai). Backend zaroori hai
kyunke aapki API key kabhi bhi browser/frontend code mein nahi honi chahiye —
warna koi bhi usay chura kar apne bill par use kar sakta hai.

## 1. Anthropic API key lein

1. https://console.anthropic.com par account banayein
2. **Settings → API Keys** mein jayein aur ek nayi key banayein
3. Billing set karein (thoda credit add karna hoga — Claude API free nahi hai,
   lekin sawal-jawab ke liye cost bohot kam hoti hai, paise ke hisaab se)
4. Key ko copy kar lein (sirf ek baar dikhti hai)

## 2. Apne computer par test karein (optional, lekin recommended)

Node.js installed hona chahiye (https://nodejs.org se, LTS version).

```bash
cd voice-agent-app
npm install
cp .env.example .env
```

`.env` file kholein aur apni asli key daal dein:

```
ANTHROPIC_API_KEY=sk-ant-aapki-asli-key-yahan
```

Phir chalayein:

```bash
npm start
```

Browser mein `http://localhost:3000` kholein. Mic kaam nahi karega kyunke
`localhost` https nahi hai — lekin Chrome `localhost` ko exception deta hai,
isliye ye testing ke liye theek chalega.

## 3. Internet par hamesha ke liye host karein (free options)

Sabse aasan free option: **Render.com**

1. https://render.com par sign up karein (GitHub account se ho sakta hai)
2. Is poore folder ko ek GitHub repository mein daal dein
   (agar GitHub istemal nahi karte, Render "Deploy from a Git repo" ke
   alawa direct upload bhi allow karta hai — unki site par dekh lein)
3. Render dashboard mein **New → Web Service** par click karein
4. Apni repository select karein
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. **Environment** section mein ek variable add karein:
   - Key: `ANTHROPIC_API_KEY`
   - Value: apni asli API key
7. **Deploy** dabayein — kuch minute mein aapko ek asli URL milega jaise
   `https://aapka-app-naam.onrender.com`

Ye URL **https** hai — isliye mic bhi kaam karega, aur AI jawab bhi, kisi
bhi phone/computer se, bina file download kiye.

(Render, Railway, Fly.io — in sab ka free tier available hai; process
zyada tar isi tarah ka hota hai. Agar Render try karte waqt koi step atke,
bata dein, main us specific step mein madad kar sakta hoon.)

## Files kya karti hain

- `server.js` — backend; `/api/ask` par sawal leta hai, Claude ko bhejta hai,
  jawab wapas deta hai. API key sirf yahan use hoti hai.
- `public/index.html` — frontend; mic se sawal sunta hai, backend ko bhejta
  hai, jawab bolta hai.
- `.env` — aapki API key (kabhi bhi GitHub par public repo mein mat daalein)

## Kharcha (cost)

Har sawal-jawab par thoda sa Anthropic ka usage-based charge lagta hai
(chhote jawabon ke liye paise ke hisaab se bohot kam). Render ka basic
hosting free hai lekin free tier thodi der na-istemal hone par so jata hai
(agli request par kuch second mein wapas jag jata hai) — agar hamesha turant
chalna chahiye to paid tier lena hoga.
