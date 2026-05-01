# 🤖 Using Your SDXL API with Claude & Claude Code

## Overview

Once your SDXL API is running in Google Colab (via ngrok), you can access it from multiple places:

1. **Claude Code (Artifacts)** - Interactive web apps
2. **Claude Code (Python)** - Script-based processing
3. **Direct API calls** - From any app/service
4. **CLI** - Command line tools

---

## 🚀 Quick Start - Which Option?

| Use Case | Best Option | Difficulty |
|----------|------------|-----------|
| Visual UI to generate images | React/Claude Code | ⭐ Easy |
| Batch process images | Python/Claude Code | ⭐⭐ Medium |
| Integrate into existing app | Direct API calls | ⭐⭐ Medium |
| Test API quickly | Curl/Browser | ⭐ Easy |

---

## ✅ Method 1: React UI (Easiest)

### How It Works:
1. I create a React component as a Claude Code artifact
2. You paste your ngrok URL into the UI
3. Generate images directly in Claude.ai

### Steps:

**Step 1: Get Your ngrok URL**
- Run Cell 3 in your Colab notebook
- Copy the URL: `https://abc-123-def.ngrok-free.app`

**Step 2: Use the React App**
- Ask me to create a React image generator
- Or use the `SDXL_Interactive_UI.jsx` file I provided
- Paste your URL into the app
- Click "Test Connection" first
- Then generate images!

### Advantages:
- ✅ No coding required
- ✅ Beautiful UI
- ✅ Real-time preview
- ✅ Parameter control
- ✅ Download images
- ✅ Works in Claude.ai

### Example Prompt for Me:
```
"Create a React app that calls my SDXL API at my_ngrok_url. 
Include a prompt input, preview, and download button."
```

---

## 🐍 Method 2: Python Integration

### How It Works:
1. I create a Python script in Claude Code
2. Script calls your SDXL API with requests library
3. Generates and processes images

### Steps:

**Step 1: Prepare Your URL**
- Have your ngrok URL ready: `https://abc-123-def.ngrok-free.app`

**Step 2: Use Python Script**
```python
from requests import post
import base64
from PIL import Image
from io import BytesIO

API_URL = "YOUR_NGROK_URL"

response = post(f"{API_URL}/generate", json={
    "prompt": "A beautiful sunset, photorealistic",
    "steps": 30,
    "guidance_scale": 7.5
})

data = response.json()
img = Image.open(BytesIO(base64.b64decode(data['image_base64'])))
img.show()
```

### Use Cases:
- ✅ Batch processing multiple prompts
- ✅ Parameter optimization
- ✅ Seed variation testing
- ✅ Automated workflows
- ✅ Data collection

### Example Prompt for Me:
```
"Create a Python script that:
1. Takes a list of prompts
2. Generates images for each using my SDXL API
3. Saves them with seed numbers
4. Shows generation time"
```

---

## 🌐 Method 3: Direct API Calls

### JavaScript/Fetch

```javascript
const API_URL = "YOUR_NGROK_URL";

async function generateImage(prompt) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: prompt,
      negative_prompt: "blurry, low quality",
      steps: 30,
      guidance_scale: 7.5
    })
  });
  
  const data = await response.json();
  return {
    src: `data:image/png;base64,${data.image_base64}`,
    seed: data.seed_used
  };
}

// Use it
const result = await generateImage("A sunset over mountains");
console.log(result.seed); // For reproducibility
```

### Python/Requests

```python
import requests
import json

API_URL = "YOUR_NGROK_URL"

response = requests.post(f"{API_URL}/generate", json={
    "prompt": "A sunset over mountains, photorealistic",
    "negative_prompt": "blurry, low quality",
    "steps": 30,
    "guidance_scale": 7.5,
    "seed": -1
})

data = response.json()
print(f"Generated! Seed: {data['seed_used']}")
```

### cURL (Command Line)

```bash
curl -X POST "YOUR_NGROK_URL/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A majestic eagle, photorealistic, 8k",
    "steps": 30,
    "guidance_scale": 7.5
  }'
```

---

## 📋 Step-by-Step: Using React UI in Claude Code

### What You'll Need:
1. Your ngrok URL (from Colab)
2. This conversation

### How to Do It:

**Option A: Ask Me to Create It**
```
"Create an interactive React app that generates images using my SDXL API. 
Include prompt input, parameter sliders, and a test connection button."
```

**Option B: Use the Provided File**
1. I already created `SDXL_Interactive_UI.jsx`
2. Create a new Claude Code artifact
3. Paste the React code
4. Replace placeholder URLs with your ngrok URL
5. Run it!

**Option C: Simple Inline Version**
Ask me for a minimal version with just:
- Prompt input
- Generate button
- Image display
- Download button

---

## 🔄 Step-by-Step: Using Python in Claude Code

### What You'll Need:
1. Your ngrok URL
2. This conversation

### How to Do It:

**Step 1: Ask Me**
```
"Create a Python script that:
1. Connects to my SDXL API
2. Takes a prompt from user input
3. Generates an image
4. Shows generation time"
```

**Step 2: Use the Provided File**
```python
# I already created SDXL_Python_Integration.py
# You can use it as a template or ask me to adapt it

from SDXL_Python_Integration import SDXLImageGenerator

gen = SDXLImageGenerator("YOUR_NGROK_URL")
gen.check_health()
result = gen.generate("A sunset over mountains")
```

**Step 3: Integration with Claude Code**
- Create a Python artifact in Claude Code
- Use requests library to call your API
- Process and display results

---

## 🔗 API Endpoints Reference

### Generate Image
```
POST /generate
```

**Request:**
```json
{
  "prompt": "string (required)",
  "negative_prompt": "string (optional)",
  "width": 512 or 1024,
  "height": 512 or 1024,
  "steps": 10-50,
  "guidance_scale": 1-15,
  "seed": -1 for random
}
```

**Response:**
```json
{
  "image_base64": "very long base64 string",
  "seed_used": 1234567890,
  "prompt": "your prompt",
  "width": 1024,
  "height": 1024
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "model": "stabilityai/stable-diffusion-xl-base-1.0",
  "gpu": "Tesla T4",
  "vram_used_gb": 7.2,
  "vram_total_gb": 16.0
}
```

### Swagger UI
```
GET /docs
```
Opens interactive API documentation in browser.

---

## ⚠️ Important Limitations

### Rate Limits
- Generation takes 30-45 seconds (model processing time)
- Only 1 image at a time (API processes sequentially)
- No hard rate limit, but dependent on Colab quota

### Session Duration
- Colab sessions timeout after ~12 hours of inactivity
- When session ends, ngrok URL expires
- You'll need to restart and get a new URL

### Cost
- **Free while Colab session is active** ✅
- No subscription needed
- No payment required

---

## 🎯 Common Use Cases

### Use Case 1: Quick Image Generation
**Solution:** React UI in Claude Code
- Pros: Visual, easy to use, parameter control
- Time: 1 minute to set up

### Use Case 2: Testing Different Prompts
**Solution:** Python script in Claude Code
- Pros: Batch processing, fast iteration
- Time: 5 minutes to set up

### Use Case 3: Integrate into Existing App
**Solution:** Direct API calls
- Pros: Flexible, works anywhere
- Time: 10-15 minutes to implement

### Use Case 4: Automated Workflow
**Solution:** Python script with scheduling
- Pros: Runs automatically, reproducible
- Time: 20 minutes to set up

---

## ✨ Next Steps

1. **Get your ngrok URL ready** (from Colab)
2. **Choose your method** (React UI, Python, or Direct API)
3. **Tell me what you want** (I'll create the code)
4. **Paste your URL** into the app/script
5. **Start generating!** 🎨

---

## 💡 Pro Tips

### Tip 1: Save Successful Seeds
If you generate an image you love:
- Note the `seed_used` value
- Use the same seed + prompt = identical image

### Tip 2: Vary with Seeds
```python
base_seed = 1234567890
for i in range(5):
    gen.generate(prompt, seed=base_seed + i)
    # Gets 5 variations
```

### Tip 3: Batch Process
```python
prompts = [
    "A sunset",
    "A forest",
    "A mountain"
]
for prompt in prompts:
    gen.generate(prompt)
```

### Tip 4: Parameter Tuning
- Lower steps (20) = faster, lower quality
- Higher steps (40) = slower, better quality
- Higher guidance (10+) = stricter prompt adherence
- Lower guidance (5) = more creative freedom

---

## ❓ Troubleshooting

### "Cannot reach API"
- ✅ Is your Colab session still active?
- ✅ Is Cell 3 still running?
- ✅ Is your ngrok URL correct?
- ✅ Does the URL still have the ngrok-free.app domain?

### "API returned 500 error"
- ✅ Check Colab for error messages
- ✅ Restart the runtime and run cells again
- ✅ Check VRAM usage (should be ~7GB)

### "Seed not reproducible"
- ⚠️ Different steps/guidance_scale = different results
- ✅ Keep ALL parameters the same for identical output

---

## 🚀 Ready to Start?

1. Have your **ngrok URL** from Colab
2. Pick your **method** (React, Python, or Direct)
3. **Ask me** to create the code
4. **Paste your URL** when prompted
5. **Generate amazing images!** 🎨

---

**Questions?** Ask me directly - I can create custom code for your specific needs!
