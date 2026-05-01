# 🎯 SDXL Studio - Your Complete GitHub Workflow

## Timeline: ~15-20 minutes total

---

## ✅ STEP 1: Prerequisites (Do Once)

### Do You Have These?
- [ ] GitHub Account (https://github.com)
- [ ] Git Installed (https://git-scm.com)
- [ ] Your `sdxl-studio` folder with React app
- [ ] Terminal/Command Prompt knowledge

If missing any, get them first!

---

## 🔑 STEP 2: Configure Git (Do Once)

Open Terminal/Command Prompt and run these TWO commands:

### Command 1: Set Your Name
```bash
git config --global user.name "Anjan Ganapathy K"
```

### Command 2: Set Your Email
```bash
git config --global user.email "ajvizganapathy@gmail.com"
```

**Change the name and email to match YOUR GitHub account!**

### Verify It Worked:
```bash
git config --global user.name
git config --global user.email
```

You should see your name and email printed ✅

---

## 📂 STEP 3: Go to Your Project Folder

In Terminal/Command Prompt:

```bash
cd sdxl-studio
```

You should be in the folder where you have your React app (where `src/` and `package.json` are)

### Verify You're in Right Folder:
```bash
ls
```

You should see:
```
node_modules/
public/
src/
package.json
package-lock.json
...
```

✅ If you see these, you're in the right place!

---

## 🚀 STEP 4: Initialize Git (First Time Only)

```bash
git init
```

You'll see: `Initialized empty Git repository in /path/to/sdxl-studio/.git`

### Add All Your Files:
```bash
git add .
```

### Create Your First Commit:
```bash
git commit -m "Initial commit: SDXL Studio React app with Stable Diffusion XL integration"
```

You'll see files being added:
```
create mode 100644 src/App.js
create mode 100644 package.json
...
```

✅ Your local files are now tracked!

---

## 📌 STEP 5: Create Repository on GitHub (Online)

### Go to GitHub:
1. Open: https://github.com/new
2. You're creating a new repository

### Fill in These Fields:

**Repository name:**
```
sdxl-studio
```

**Description (optional):**
```
Professional AI image generation app using Stable Diffusion XL. Built with React, Tailwind CSS, and ngrok tunnel for local Colab API access.
```

**Public or Private:**
- ✅ **Public** - Anyone can see/use your code
- ⭕ **Private** - Only you can see it

Choose **Public** if you want others to use it!

**Initialize repository:**
- ❌ DO NOT check "Add a README file"
- ❌ DO NOT check "Add .gitignore"  
- ❌ DO NOT check "Choose a license"

**Why?** Your local project already has everything!

### Click: "Create repository"

---

## 🔗 STEP 6: Connect Local to GitHub

After creating the repository, GitHub shows you these instructions:

```
git remote add origin https://github.com/YOUR_USERNAME/sdxl-studio.git
git branch -M main
git push -u origin main
```

### Go Back to Terminal and Run These 3 Commands:

**Command 1:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/sdxl-studio.git
```

Replace `YOUR_USERNAME` with your actual GitHub username!

**Example:**
```bash
git remote add origin https://github.com/ajvizganapathy/sdxl-studio.git
```

**Command 2:**
```bash
git branch -M main
```

**Command 3:**
```bash
git push -u origin main
```

This might ask for your GitHub credentials:
- Enter your GitHub username
- Enter your GitHub password (or personal access token)

### You'll See:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
* [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Your code is now on GitHub!

---

## ✨ STEP 7: Verify It's on GitHub

1. Go to: `https://github.com/YOUR_USERNAME/sdxl-studio`
2. Replace `YOUR_USERNAME` with your username
3. You should see all your files!
4. Click on `src/App.js` - you see your React code ✅

### Example URL:
```
https://github.com/ajvizganapathy/sdxl-studio
```

---

## 📝 STEP 8: Add Documentation Files (Optional But Recommended)

Your repository is complete, but let's add nice documentation!

### Create README.md File

In your `sdxl-studio` folder, create a new file called `README.md`:

**Content to paste:**
```markdown
# 🎨 SDXL Studio

Professional AI image generation with Stable Diffusion XL Base 1.0

## Features

✨ Beautiful UI - Dark theme with modern design
⚡ Real-time GPU monitoring - See status and VRAM usage
🎛️ Full parameter control - Adjust steps, guidance, seed, dimensions
💾 Download images - Save generated images as PNG
🔄 Reproducible results - Use seeds for identical generations
🚀 Fast generation - 30-45 seconds per image on free T4 GPU

## Tech Stack

- Frontend: React 18, Tailwind CSS, Lucide Icons
- Backend: Stable Diffusion XL in Google Colab
- Tunneling: ngrok (public API access)

## Quick Start

```bash
npm install lucide-react
npm start
```

Then:
1. Get ngrok URL from Colab
2. Paste into the app
3. Test connection
4. Enter prompt
5. Click Generate! 🎨

## Example Prompts

- "A majestic eagle soaring over mountains, photorealistic, 8k"
- "Beautiful sunset over ocean, golden hour, cinematic"
- "Futuristic city at night, cyberpunk style, neon lights"

## Parameters Guide

- **Steps**: 30 (default) - Higher = better quality, slower
- **Guidance**: 7.5 (default) - Higher = stricter prompt adherence
- **Seed**: -1 (random) - Fixed = reproducible results
- **Size**: 1024x1024 (SDXL optimized)

## Get Started

1. Clone this repo
2. `npm install lucide-react`
3. `npm start`
4. Have your SDXL API ready!

## License

MIT - Use freely!
```

### Create .gitignore File

Create a new file called `.gitignore`:

**Content to paste:**
```
node_modules/
build/
.env
.env.local
.DS_Store
npm-debug.log*
.cache/
```

### Add These Files to GitHub

In Terminal:

```bash
git add README.md .gitignore
git commit -m "Add README and gitignore documentation"
git push
```

---

## 🔄 STEP 9: Make Changes Later

Every time you update your app, run these 3 commands:

```bash
git add .
git commit -m "Your description of changes here"
git push
```

### Examples:
```bash
git commit -m "Add dark mode theme"
git commit -m "Fix API connection error"
git commit -m "Improve image preview styling"
git commit -m "Add seed management feature"
```

---

## 🎉 STEP 10: Share Your Project

Your project is now on GitHub! Share this link:

```
https://github.com/YOUR_USERNAME/sdxl-studio
```

**Example:**
```
https://github.com/ajvizganapathy/sdxl-studio
```

Anyone can:
- View your code
- Fork your project
- Learn from it
- Contribute to it

---

## 📊 What You Have Now

```
GitHub Repository
├── src/
│   ├── App.js (Your React code)
│   └── ...
├── public/
├── package.json
├── README.md (Documentation)
├── .gitignore (Keep folders out)
└── ...
```

All on GitHub with full version history! ✅

---

## 🚀 Optional: Deploy to Vercel

Your GitHub repo can be deployed to Vercel for FREE!

```bash
npm install -g vercel
vercel
```

This creates a live URL like:
```
https://sdxl-studio.vercel.app
```

Anyone can use your app from the browser!

---

## 🎓 Git Commands You Need

```bash
# Check what changed
git status

# See all your commits
git log

# Add files
git add .

# Commit changes
git commit -m "Message"

# Push to GitHub
git push

# Pull latest from GitHub
git pull
```

---

## ✅ Congratulations! 🎉

You now have:

✅ SDXL Studio app running locally  
✅ Code on GitHub (backed up & shared)  
✅ Professional README documentation  
✅ Version control for future changes  
✅ Shareable GitHub link  
✅ Ready to deploy online  

---

## 📞 Next Questions?

"How do I..."

- Deploy to Vercel? → Run `vercel` command
- Add a feature? → Edit code, then `git add .` + `git commit` + `git push`
- Share with friends? → Give them your GitHub link
- Contribute to others? → Fork their repo!

---

## 🎨 You Did It!

Your SDXL Studio is now:
- ✅ Running locally
- ✅ On GitHub
- ✅ Ready to share
- ✅ Professional quality
- ✅ Fully documented

**Enjoy building amazing AI images!** 🚀🎨
