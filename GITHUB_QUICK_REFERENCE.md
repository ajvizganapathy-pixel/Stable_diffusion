# ⚡ GitHub Quick Start - Copy & Paste Commands

## TL;DR - Do This Now (5 minutes)

### 1. Create GitHub Account (if needed)
Go to: https://github.com/signup

### 2. Install Git
- Windows: https://git-scm.com/download/win
- Mac: https://git-scm.com/download/mac
- Linux: `sudo apt install git`

### 3. Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### 4. Go to Your Project
```bash
cd sdxl-studio
```

### 5. Initialize & Commit (First Time)
```bash
git init
git add .
git commit -m "Initial commit: SDXL Studio React app"
```

### 6. Create Repository on GitHub
1. Go to: https://github.com/new
2. Name it: `sdxl-studio`
3. Click **Create repository**
4. **DO NOT** initialize with README/gitignore/license

### 7. Connect & Push (Copy-Paste These Lines)
```bash
git remote add origin https://github.com/YOUR_USERNAME/sdxl-studio.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### 8. Done! ✅
Check: https://github.com/YOUR_USERNAME/sdxl-studio

---

## Make Changes Later

Every time you update your code:

```bash
git add .
git commit -m "Your change description here"
git push
```

---

## Useful Commands

```bash
# Check what you changed
git status

# See your commits
git log

# Add specific file instead of all
git add filename.js

# See what changed in a file
git diff filename.js

# Undo last commit (keeps files)
git reset --soft HEAD~1
```

---

## Commit Message Examples

```bash
git commit -m "Add image download feature"
git commit -m "Fix API connection"
git commit -m "Update README with instructions"
git commit -m "Improve UI styling"
git commit -m "Add error handling"
```

---

## Files to Add (Optional But Recommended)

### README.md
```markdown
# SDXL Studio

Professional AI image generation with Stable Diffusion XL

## Setup
1. Install dependencies: `npm install lucide-react`
2. Start app: `npm start`
3. Get ngrok URL from Colab
4. Paste URL and generate images!
```

### .gitignore
```
node_modules/
build/
.env
.DS_Store
npm-debug.log*
```

Then:
```bash
git add README.md .gitignore
git commit -m "Add documentation and gitignore"
git push
```

---

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "fatal: Could not read from remote repository"
Check your SSH key or use HTTPS URL instead:
```bash
git remote set-url origin https://github.com/username/sdxl-studio.git
```

### "Please tell me who you are"
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### "Updates were rejected because the tip of your current branch is behind"
```bash
git pull origin main
git push origin main
```

---

## Share Your Project

Your GitHub URL:
```
https://github.com/YOUR_USERNAME/sdxl-studio
```

Share this link with anyone!

---

## Next: Deploy to Vercel (Optional)

```bash
npm install -g vercel
vercel
```

Then share your live URL!

---

**Done! Your project is on GitHub!** 🎉
