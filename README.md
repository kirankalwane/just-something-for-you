
# 🌙 A Website That Wasn't Supposed to Exist

A cinematic, personal, and interactive webpage crafted specifically for **Bhakti**.  
Built with pure HTML5, modern CSS3 (glassmorphism & cosmic aesthetics), and the **Web Audio API** for tactile heartbeats, starry ambiance, and the nostalgic *Afreen Afreen* acoustic motif.

---

## ✨ Experience Flow

1. **The Mystery**: *"Hey. You weren't supposed to find this."*
2. **Setting the Boundary**: *"It's not a proposal. It's not a confession. And honestly… I don't even know what to call it."*
3. **The Realization**: Subtle, honest lines about ordinary college days and becoming a favorite distraction.
4. **Vulnerable Honesty**: Stepping back so presence never feels like pressure.
5. **Interactive Mini-Game**: *"What do you think I notice first when I see you?"* → Custom response + *"Actually… I notice when you're happy."*
6. **Heartbeat & Song**: Synchronized visual & acoustic heartbeat pulse (`thump... thump...`) followed by an acoustic music-box rendition of *Afreen Afreen*.
7. **The Improvised Climax**: Deep blackout, gentle name glow, honest confession without asking for anything in return, and the funny line: *(“I spent way too much time making this. 😂”)*.
8. **The "Wait." Twist**: *"Wait. 😄 Take care, Bhakti."* → Settles into the cosmic canopy signed **— K** with playful secret reaction buttons (including optional WhatsApp smile reply).

---

## 🚀 How to View Locally

You can simply open `index.html` in any browser:
- **Option 1**: Double-click `index.html` in your file explorer.
- **Option 2** (Recommended for local dev server):
  ```bash
  # Using Python (built-in):
  python -m http.server 8000
  # Then open http://localhost:8000 in your browser
  ```

---

## 🌐 How to Share with Her (Free Hosting Options)

To send her a clean link (e.g. `https://your-name.vercel.app` or `https://username.github.io/secret`):

### 1. Vercel (Fastest — 1 Minute)
1. Go to [vercel.com](https://vercel.com) and sign up/log in.
2. Drag and drop this folder directly into Vercel.
3. Done! It gives you an instant live URL to send her.

### 2. Netlify (Drag & Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this `webpage` folder.
3. You get a live link immediately.

### 3. GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages > Branch: main / root > Save**.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🎵 Music Setup: Two Audio Tracks Supported

The website supports **two distinct musical layers**:

### 1. 🎶 Continuous Background Music (`Vaaroon.mp3`)
Plays in the background across all scenes:
- Simply copy your audio file into this `webpage` folder and name it:
  ```text
  Vaaroon.mp3
  ```
- **Behavior**:
  - Starts playing automatically on the first click (*"I'm curious"*).
  - Loops continuously in the background at a gentle ambient volume (~35%).
  - **Automatically pauses** when she arrives at Scene 5 and `song.mp3` begins playing.
  - **Automatically resumes** when `song.mp3` is paused or completed.

### 2. 💿 Scene 5 Featured Track (`song.mp3` / Afreen Afreen)
Plays on the spinning vinyl record in Scene 5:
- Copy your featured song into this folder and name it:
  ```text
  song.mp3
  ```
- In [`script.js`](file:///c:/Users/Asus%20TUF/Desktop/webpage/script.js), you can adjust title, subtitle, or volume anytime.
- If no MP3 is provided, the website automatically falls back to the built-in acoustic music-box synthesizer so it never goes silent!

### Step 3: Test and Enjoy
1. Start the server (e.g. `node server.js` or `python -m http.server 8000`).
2. Open [`http://localhost:5173`](http://localhost:5173) on your phone or computer.
3. When you arrive at Scene 5 (The Rhythm), your song will begin playing automatically with the spinning vinyl disc and animated soundwaves!
4. Tapping the vinyl disc anytime lets you pause or resume the song.

---

## 📱 Mobile Experience
- Optimized for all mobile screen sizes (from 320px up to large iPhones and Androids).
- Full support for modern dynamic viewport height (`100dvh`), iOS notches, and safe areas (`env(safe-area-inset)`).
- Scroll-safe layouts ensure buttons and text are never cut off on compact mobile screens.
- Touch-optimized tap targets and fluid typography.

---

## 🎨 How to Customize Content

- **Signature**: In `index.html`, look for `— K` to change your signature or initials.
- **Her Name**: In `index.html`, search for `Bhakti` to adjust the name or spelling.
- **Theme**: Click the flower/moon icon in the top right to toggle between *Twilight Moonlit Night* and *Pastel Cotton-Candy Dream*.
