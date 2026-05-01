# 💻 SDXL React App - Local Setup Guide

## Complete Instructions for Your Computer

---

## ⏱️ Timeline
- **Node.js installation**: 5-10 minutes
- **Creating the app**: 3-5 minutes
- **First run**: 2-3 minutes
- **Every time after**: 10 seconds to start

---

## 📋 Step 1: Install Node.js (One-Time Setup)

### What is Node.js?
Node.js is a JavaScript runtime that allows you to run React apps on your computer.

### Installation Steps:

#### **Windows:**
1. Go to: https://nodejs.org/
2. Click the **LTS** (Long Term Support) button - it's the left one
3. Download the installer (`.msi` file)
4. Run the installer
5. Click **Next** through all steps (keep defaults)
6. Click **Install**
7. Restart your computer

#### **Mac:**
1. Go to: https://nodejs.org/
2. Click the **LTS** button (left one)
3. Download for Mac
4. Open the installer file
5. Follow the installation wizard
6. Restart your computer

#### **Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Or use Node Version Manager (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

### Verify Installation:

Open **Terminal** or **Command Prompt** and type:
```bash
node --version
npm --version
```

You should see version numbers like `v18.17.0` and `9.6.7`

✅ **If you see version numbers, Node.js is installed!**

---

## 🚀 Step 2: Create Your React App

### Open Terminal/Command Prompt

**Windows:**
- Right-click on Desktop → Open Terminal
- OR: Press `Win + X` → Terminal

**Mac:**
- Press `Cmd + Space` → Type "Terminal" → Enter
- OR: Finder → Applications → Utilities → Terminal

**Linux:**
- Right-click → Open Terminal in Folder
- OR: Ctrl + Alt + T

### Navigate to Where You Want the Project

```bash
# Go to your Documents folder (example)
cd Documents
```

### Create the React App

Copy and paste this command:
```bash
npx create-react-app sdxl-studio
```

**What happens:**
- Downloads React framework
- Creates a folder called `sdxl-studio`
- Sets up all the files
- ⏳ Takes 2-5 minutes

**You'll see:**
```
Creating a new React app in /Users/yourname/Documents/sdxl-studio...
...
Success! Created sdxl-studio at /path/to/sdxl-studio
```

### Enter the Project Folder

```bash
cd sdxl-studio
```

---

## 🎨 Step 3: Replace the App Code

### Open the Project in a Code Editor

I recommend **Visual Studio Code** (free):
1. Download from: https://code.visualstudio.com/
2. Install it
3. In your terminal, type:
   ```bash
   code .
   ```
4. VS Code opens with your project

### Find and Edit App.js

In VS Code:
1. Left panel → `src` folder
2. Click `App.js`
3. Select all code: `Ctrl+A` (Windows) or `Cmd+A` (Mac)
4. Delete it: `Delete` or `Backspace`

### Paste the SDXL React Code

Copy the entire code below and paste it into `App.js`:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Zap, Check, AlertCircle, Loader } from 'lucide-react';

export default function SDXLStudio() {
  const [apiUrl, setApiUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [prompt, setPrompt] = useState('A majestic eagle soaring over snowy mountains, photorealistic, cinematic lighting, 8k');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, watermark, text');
  
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState(-1);
  const [dimensions, setDimensions] = useState({ width: 1024, height: 1024 });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const [image, setImage] = useState(null);
  const [seedUsed, setSeedUsed] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const imageRef = useRef(null);
  const startTimeRef = useRef(null);

  const connectApi = async () => {
    if (!apiUrl.trim()) {
      setError('Please enter your ngrok URL');
      return;
    }

    try {
      const response = await fetch(`${apiUrl.trim()}/health`, { timeout: 5000 });
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setSuccessMessage(`✅ Connected! GPU: ${data.gpu} | VRAM: ${data.vram_used_gb.toFixed(1)}GB/${data.vram_total_gb.toFixed(1)}GB`);
        setError('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setError('API returned an error. Check your URL.');
        setIsConnected(false);
      }
    } catch (err) {
      setError('Cannot reach API. Ensure Colab is running and URL is correct.');
      setIsConnected(false);
    }
  };

  const generateImage = async () => {
    if (!isConnected) {
      setError('Please connect to API first');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError('');
    setImage(null);
    startTimeRef.current = Date.now();

    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          width: parseInt(dimensions.width),
          height: parseInt(dimensions.height),
          steps: parseInt(steps),
          guidance_scale: parseFloat(guidance),
          seed: seed === -1 ? -1 : parseInt(seed),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      setImage(`data:image/png;base64,${data.image_base64}`);
      setSeedUsed(data.seed_used);
      
      const duration = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
      setGenerationTime(duration);
      setSuccessMessage('Image generated successfully! 🎉');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `sdxl-${seedUsed}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const randomSeed = () => setSeed(Math.floor(Math.random() * 2147483647));

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isConnected && !isGenerating) {
      generateImage();
    }
  };

  useEffect(() => {
    const promptInput = document.querySelector('[data-prompt-input]');
    if (promptInput) promptInput.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl">🎨</span>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SDXL Studio
          </h1>
          <p className="text-slate-400 text-lg">Professional AI image generation</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-in">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Connection
                </h2>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
              
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && connectApi()}
                placeholder="https://abc-123-def.ngrok-free.app"
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all mb-3"
              />
              
              <button
                onClick={connectApi}
                disabled={isGenerating}
                className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                  isConnected
                    ? 'bg-green-600/20 border border-green-600/50 text-green-400 hover:bg-green-600/30'
                    : 'bg-blue-600/20 border border-blue-600/50 text-blue-300 hover:bg-blue-600/30'
                }`}
              >
                {isConnected ? '✓ Connected' : 'Test Connection'}
              </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Prompt</label>
              <textarea
                data-prompt-input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handlePromptKeyDown}
                placeholder="Describe your image..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">💡 Be detailed and descriptive</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Avoid</label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to exclude..."
                rows="2"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-4">Parameters</label>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-300">Steps</label>
                    <span className="text-sm font-mono bg-slate-900/50 px-2.5 py-1 rounded text-blue-300">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-300">Guidance</label>
                    <span className="text-sm font-mono bg-slate-900/50 px-2.5 py-1 rounded text-purple-300">{guidance.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={guidance}
                    onChange={(e) => setGuidance(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-300">Seed</label>
                    <button
                      onClick={randomSeed}
                      className="text-xs px-2 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-colors"
                    >
                      🔄 Random
                    </button>
                  </div>
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                    placeholder="-1"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Width</label>
                    <select
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="512">512</option>
                      <option value="1024">1024</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Height</label>
                    <select
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="512">512</option>
                      <option value="1024">1024</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={!isConnected || isGenerating}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all transform ${
                isGenerating
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : isConnected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  <span>Generate Image</span>
                </div>
              )}
            </button>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Generated Image</h2>

            {image ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <img
                  ref={imageRef}
                  src={image}
                  alt="Generated"
                  className="max-w-full max-h-96 rounded-lg shadow-2xl shadow-blue-500/20 border border-slate-700/50"
                />

                <div className="w-full space-y-3 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-1">Seed Used</p>
                    <p className="text-lg font-mono text-blue-300">{seedUsed}</p>
                  </div>

                  <button
                    onClick={downloadImage}
                    className="w-full py-3 bg-green-600/20 border border-green-600/50 text-green-300 hover:bg-green-600/30 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 opacity-50">🎨</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready to Create</h3>
                <p className="text-slate-400 mb-6 max-w-sm">
                  Paste your ngrok URL, enter a prompt, and click Generate
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-sm border-t border-slate-700/50 pt-8">
          <p>✨ Powered by Stable Diffusion XL running in Google Colab</p>
        </div>
      </div>
    </div>
  );
}
```

### Save the File

Press: `Ctrl+S` (Windows) or `Cmd+S` (Mac)

---

## 📦 Step 4: Install Lucide Icons

In your terminal (keep it in the `sdxl-studio` folder), run:

```bash
npm install lucide-react
```

**What happens:**
- Downloads the icon library
- Installs it into your project
- ⏳ Takes 1-2 minutes

---

## 🚀 Step 5: Start the App

In your terminal, run:

```bash
npm start
```

**What happens:**
- React builds your app
- A browser window opens automatically
- You see your beautiful SDXL Studio app!
- ⏳ Takes 30-60 seconds first time

---

## ✅ Step 6: Use Your App

Now you have the app running locally on your computer!

### First Time Using It:

1. **Get your ngrok URL from Colab**
   - Run Cell 3 in your Colab notebook
   - Copy the URL: `https://abc-123-def.ngrok-free.app`

2. **Paste into the app**
   - Paste the URL into the "Connection" field

3. **Test Connection**
   - Click "Test Connection" button
   - You should see: ✅ Connected! GPU: Tesla T4 | VRAM: 7.2GB/16.0GB

4. **Generate an Image**
   - Use the default prompt or write your own
   - Click "Generate Image"
   - Wait 30-45 seconds
   - See your image! 🎉

5. **Download**
   - Click "Download Image" to save it to your Downloads folder

---

## 🔄 Every Time You Want to Use It

### Start the App:
```bash
cd sdxl-studio
npm start
```

The browser opens automatically at `http://localhost:3000`

### Stop the App:
In the terminal, press: `Ctrl+C`

---

## 📝 Project Folder Structure

```
sdxl-studio/
├── node_modules/          (all dependencies)
├── public/                (static files)
├── src/
│   ├── App.js            ← Your SDXL code is here
│   ├── App.css           (styling)
│   ├── index.js          (app entry point)
│   └── ...
├── package.json          (project settings)
└── ...
```

---

## 🐛 Troubleshooting

### "npm: command not found"
**Solution:** Node.js didn't install properly
1. Uninstall Node.js completely
2. Download fresh from https://nodejs.org/
3. Restart your computer
4. Try again

### "Cannot find module 'lucide-react'"
**Solution:** You didn't install the icons
```bash
npm install lucide-react
```

### "Port 3000 is already in use"
**Solution:** Another app is using that port
```bash
# Use a different port
npm start -- --port 3001
```

Then open: `http://localhost:3001`

### "Cannot reach API" error
**Solution:**
1. Make sure your Colab session is still active
2. Make sure Cell 3 is still running
3. Copy the ngrok URL again (it may have expired)
4. Paste the fresh URL into the app

### "White blank page"
**Solution:**
1. Close and reopen the browser
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check terminal for error messages

### npm or Node.js won't install
**Solution:** Download installer directly instead of using package managers
1. Go to https://nodejs.org/
2. Download the `.msi` (Windows) or `.pkg` (Mac) installer
3. Run it and follow prompts
4. Restart computer

---

## ✨ Tips & Tricks

### Keyboard Shortcut for Generating
While your cursor is in the prompt box, press:
- `Ctrl+Enter` (Windows)
- `Cmd+Enter` (Mac)

This generates the image without clicking the button!

### Keep Terminal Always Open
Your app only runs while the terminal is open. So:
- Keep the terminal window visible
- Don't close it
- You can minimize it
- Closing it stops the app

### Edit Code While Running
You can edit the code in VS Code while the app is running:
1. Change something in `App.js`
2. Save the file
3. Browser automatically refreshes
4. See your changes instantly!

### Faster Updates
To make changes faster:
1. Edit code
2. Save: `Ctrl+S`
3. Browser auto-refreshes
4. Test immediately

---

## 🎯 Next Steps After Setup

### You now have a fully functional app!

**Customizations you can make:**
- Change colors/theme
- Add new features
- Modify the layout
- Deploy it online
- Share with friends

### Want to Deploy Online?
Once you have this working, tell me:
> "Help me deploy this to Vercel so I can share it"

I'll walk you through it!

---

## 📞 Need Help?

If something doesn't work:
1. Copy the error message
2. Tell me what happened
3. I'll help you fix it!

Common issues:
- "npm not found" → Restart computer after installation
- "Port 3000 in use" → Use port 3001 instead
- "Cannot reach API" → Verify Colab is still running
- "Blank page" → Hard refresh browser (Ctrl+Shift+R)

---

## 🎉 You're All Set!

You now have a **professional AI image generation app** running on your computer! 🚀

### Summary:
✅ Installed Node.js  
✅ Created React project  
✅ Added SDXL code  
✅ Installed dependencies  
✅ Started the app  
✅ Using it locally  

**Enjoy generating beautiful images!** 🎨

---

## 🚀 Quick Reference

### Start app:
```bash
cd sdxl-studio
npm start
```

### Stop app:
`Ctrl+C` in terminal

### Edit code:
Open `src/App.js` in VS Code

### Browser location:
`http://localhost:3000`

### Reinstall dependencies:
```bash
npm install
```

---

**Ready to start? Follow the steps above and let me know if you need any help!** 💻
