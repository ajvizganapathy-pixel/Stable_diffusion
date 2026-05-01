# 🎨 Stable Diffusion XL Base 1.0 - Complete Setup Guide
## Free AI Image Generation API in Google Colab

---

## 📋 Quick Overview

This guide walks you through setting up a **completely free AI image generation API** using Stable Diffusion XL Base 1.0 in Google Colab. By the end, you'll have:

- ✅ A public REST API endpoint to generate images
- ✅ A web UI (Gradio) for testing
- ✅ Ability to integrate into your own apps (React, Python, JavaScript)
- ✅ Unlimited free generations while Colab session is active

**Key Facts:**
- **Model**: Stable Diffusion XL Base 1.0 (3.5B parameters)
- **Hardware**: Free T4 GPU (Google Colab)
- **VRAM Required**: ~7GB (fits comfortably on T4)
- **Generation Time**: ~30-45 seconds per image
- **Cost**: FREE (as long as you use Colab)

---

## 🔑 Step 1: Pre-Setup (One-Time, 15 minutes)

### 1.1 Create HuggingFace Account & Generate Token

The Stable Diffusion model is hosted on HuggingFace. You need an authentication token for faster downloads.

**Steps:**

1. Go to: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **"New token"** (blue button at top)
3. Fill in:
   - **Name**: `colab-sdxl` (or any name you prefer)
   - **Permission**: Select **"Read"** (only read access needed)
4. Click **"Generate"** 
5. **Copy the token** - it looks like: `hf_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567`

> **⚠️ WARNING**: Never share this token publicly! Keep it secret.

### 1.2 Create ngrok Account & Get Authtoken

ngrok creates a **public tunnel** to your Colab instance, exposing your API to the internet. Without this, only you can access your API locally.

**Steps:**

1. Go to: [https://ngrok.com](https://ngrok.com)
2. Click **"Sign Up"** (top right)
3. Create account (email + password)
4. Go to: [https://dashboard.ngrok.com/auth/your-authtoken](https://dashboard.ngrok.com/auth/your-authtoken)
5. **Copy your authtoken** - looks like: `your_long_authtoken_string_here`

> **Note**: Free ngrok accounts give you one public URL at a time.

---

## 🚀 Step 2: Google Colab Setup (5 minutes)

### 2.1 Open the Notebook

1. Go to: [https://colab.research.google.com](https://colab.research.google.com)
2. Click **"File"** → **"Upload notebook"**
3. Upload the `SDXL_Base_Colab.ipynb` file you have

### 2.2 Configure GPU Runtime (CRITICAL!)

**This step is essential** — without T4 GPU, the notebook will be slow or fail.

**Steps:**

1. In Colab, click **"Runtime"** (top menu)
2. Click **"Change runtime type"**
3. Select:
   - **Runtime type**: `Python 3`
   - **Hardware accelerator**: `T4 GPU` ← **MUST BE T4**
4. Click **"Save"**

> **Why T4?** The model uses ~7GB VRAM in float16, which fits exactly on T4 (16GB total). Other GPUs may not work or be slower.

### 2.3 Add Secrets to Colab

This stores your tokens securely without exposing them in notebook code.

**Steps:**

1. In Colab, look for **🔑 key icon** in the left sidebar
2. Click it to open **"Secrets"** panel
3. Click **"+ Add new secret"**

**Add Secret 1: HuggingFace Token**
- **Name**: `HF_TOKEN`
- **Value**: Paste your HuggingFace token here (from Step 1.1)
- Click toggle to enable **"Notebook access"**

**Add Secret 2: ngrok Token** *(do this after running first cell, or you can skip and add it later)*
- **Name**: `NGROK_AUTHTOKEN`
- **Value**: Paste your ngrok authtoken here
- Click toggle to enable **"Notebook access"**

---

## 🔧 Step 3: Run the Notebook Cells

### 3.1 Cell 0 - HuggingFace Authentication

**What it does**: Logs into HuggingFace using your secret token for faster model downloads.

**How to run:**
- Click the **▶️ play button** in the cell, or press `Shift + Enter`
- **Expected output**:
  ```
  ✅ Logged in to HuggingFace Hub — faster downloads enabled!
  ```
  OR (if you didn't add the secret yet, it's OK):
  ```
  ⚠️ HF_TOKEN not found
  Continuing without token — model will still load (may be slower).
  ```

### 3.2 Cell 1.1 - Install Dependencies

**What it does**: Installs all required Python packages (diffusers, FastAPI, Gradio, ngrok, etc.)

**How to run:**
- Click ▶️ play button
- **Expected output**:
  ```
  ✅ Dependencies installed
  ```
- **Duration**: 2-3 minutes (installs ~10 packages)

### 3.3 Cell 1.2 - Load the Model

**What it does**: Downloads the SDXL model (~7GB) and loads it into GPU memory.

**How to run:**
- Click ▶️ play button
- **Expected output**:
  ```
  ⏳ Loading SDXL Base 1.0...
  First run downloads ~7GB of weights — takes 3–5 minutes.
  
  ✅ SDXL Base 1.0 loaded and ready!
  VRAM used: 7.2 GB
  ```
- **Duration**: 3-5 minutes on first run (downloads model)
- **Duration**: 10-20 seconds on subsequent runs (cached)

### 3.4 Cell 1.3 - Core Inference Function

**What it does**: Defines the image generation function used by both Gradio UI and FastAPI.

**How to run:**
- Click ▶️ play button
- **Expected output**: (None — this just defines the function)

### 3.5 Cell 2 - Gradio UI (Optional Visual Testing)

**What it does**: Launches an interactive web UI where you can test prompts with a nice interface.

**How to run:**
- Click ▶️ play button
- **Expected output**:
  ```
  Running on public URL: https://xxxxx-yyyyy.gradio.live
  ```
- Click the URL and test your prompts!
- **Test prompt**: Try: `"A red fox in a snowy forest, photorealistic, 8k, cinematic lighting"`

**Understanding the Gradio controls:**
- **Prompt**: What you want to generate
- **Negative Prompt**: What to avoid (artifacts, blur, watermarks)
- **Width / Height**: Image dimensions (1024x1024 optimal for SDXL)
- **Inference Steps**: 30 = good balance of quality + speed; 50 = slower but better
- **Guidance Scale**: 7.5 = follows prompt well; higher = more strict adherence
- **Seed**: -1 = random; set a number to reproduce results

### 3.6 Cell 3 - FastAPI + ngrok (The REST API)

**What it does**: Launches your REST API endpoint and exposes it to the internet via ngrok tunnel.

**⚠️ IMPORTANT**: Before running this cell, make sure you've added your **ngrok authtoken** to Colab Secrets (Step 2.3).

**How to run:**
1. If you haven't added ngrok secret yet:
   - Click 🔑 icon in left sidebar
   - Add new secret: Name = `NGROK_AUTHTOKEN`, Value = your ngrok token
   - Enable "Notebook access"

2. Click ▶️ play button in Cell 3

3. **Expected output**:
   ```
   ============================================================
   🚀 SDXL API is LIVE
   ============================================================
     Public URL   : https://abc-123-def.ngrok-free.app
     Swagger docs : https://abc-123-def.ngrok-free.app/docs
     Health check : https://abc-123-def.ngrok-free.app/health
     Generate     : POST https://abc-123-def.ngrok-free.app/generate
   ============================================================
   ```

4. **Your API is now live!** Copy the public URL.

---

## 📡 Step 4: Test Your API

### 4.1 Test via Curl (Command Line)

Replace `YOUR_NGROK_URL` with the URL from Step 3.6 above.

```bash
curl -X POST "YOUR_NGROK_URL/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A majestic eagle soaring over mountains, photorealistic, cinematic lighting",
    "negative_prompt": "blurry, low quality, watermark",
    "steps": 30,
    "guidance_scale": 7.5
  }'
```

### 4.2 Test via Browser

Visit the Swagger UI to test interactively:

```
YOUR_NGROK_URL/docs
```

Example: `https://abc-123-def.ngrok-free.app/docs`

- Click **"POST /generate"** section
- Click **"Try it out"**
- Modify the JSON request
- Click **"Execute"**
- See the image response!

### 4.3 Health Check

Check if your API is running and see GPU status:

```
YOUR_NGROK_URL/health
```

Returns:
```json
{
  "status": "ok",
  "model": "stabilityai/stable-diffusion-xl-base-1.0",
  "gpu": "Tesla T4",
  "vram_used_gb": 7.2,
  "vram_total_gb": 16.0
}
```

---

## 💻 Step 5: Integrate into Your Own App

### JavaScript / React Example

```javascript
const API_URL = "YOUR_NGROK_URL";  // Replace with your URL

async function generateImage(prompt, options = {}) {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negative_prompt: options.negativePrompt ?? "blurry, low quality",
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      steps: options.steps ?? 30,
      guidance_scale: options.guidanceScale ?? 7.5,
      seed: options.seed ?? -1,
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();

  return {
    src: `data:image/png;base64,${data.image_base64}`,
    seed: data.seed_used,
  };
}

// Usage
const { src, seed } = await generateImage("A sunset over the ocean");
// <img src={src} alt="generated" />
```

### Python Example

```python
import requests
import base64
from PIL import Image
from io import BytesIO

API_URL = "YOUR_NGROK_URL"

response = requests.post(f"{API_URL}/generate", json={
    "prompt": "A futuristic city at night, neon lights",
    "negative_prompt": "blurry, low quality",
    "width": 1024,
    "height": 1024,
    "steps": 30,
    "guidance_scale": 7.5,
    "seed": -1,
})

data = response.json()
img = Image.open(BytesIO(base64.b64decode(data["image_base64"])))
img.save("output.png")
print(f"Saved! Seed: {data['seed_used']}")
```

---

## 🎯 API Reference

### POST `/generate`

**Request Body:**

| Field | Type | Default | Range | Description |
|-------|------|---------|-------|-------------|
| `prompt` | string | required | - | What you want in the image |
| `negative_prompt` | string | `"blurry, low quality..."` | - | What to avoid |
| `width` | int | 1024 | 512, 1024 | Image width |
| `height` | int | 1024 | 512, 1024 | Image height |
| `steps` | int | 30 | 10–50 | Quality vs speed (30 = sweet spot) |
| `guidance_scale` | float | 7.5 | 1–15 | How strictly to follow prompt |
| `seed` | int | -1 | Any | -1 = random, else reproducible |

**Response:**

```json
{
  "image_base64": "iVBORw0KGgo...",
  "seed_used": 1234567890,
  "prompt": "your prompt here",
  "width": 1024,
  "height": 1024
}
```

### GET `/health`

Returns GPU status and VRAM usage (no authentication needed).

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

### GET `/docs`

Interactive API documentation (Swagger UI). Try endpoints directly in your browser!

---

## 🎨 Prompt Engineering Tips

### Structure for High-Quality Results

Use this formula for photorealistic images:

```
[subject] + [style] + [lighting] + [quality keywords] + [resolution]
```

**Example:**
```
"A highly detailed portrait of a woman with red hair, cinematic lighting,
photorealistic, 8k resolution, intricate details, masterfully crafted"
```

### Style Keywords

- **Photorealistic**: "photorealistic, 8k, ultra-detailed, cinematic"
- **3D Render**: "3d render, octane render, unreal engine"
- **Oil Painting**: "oil painting, brushstrokes, artstation, concept art"
- **Digital Art**: "digital art, artstation, fantasy, epic"
- **Anime**: "anime, manga style, cel-shading"

### Negative Prompt Best Practices

Always include defaults to avoid artifacts:

```
"blurry, low quality, distorted, watermark, text, signature, 
deformed, anatomy error, worst quality, jpeg artifacts"
```

### Using the Seed Parameter

- **-1**: Random seed (different result each time)
- **42** (or any fixed number): Reproducible results

If you like an image but want variations:
1. Note the `seed_used` from response
2. Generate again with same prompt + same seed = identical image
3. Use nearby seed (seed + 1, seed + 2) = slight variations

---

## ⏰ Timing Guide

| Task | Duration |
|------|----------|
| Setup HuggingFace + ngrok tokens | 10 minutes |
| Enable T4 GPU in Colab | 1 minute |
| Install dependencies (Cell 1.1) | 2-3 minutes |
| Download model (Cell 1.2, first run) | 3-5 minutes |
| Model load (Cell 1.2, subsequent) | 10-20 seconds |
| Generate image (first) | 30-45 seconds |
| Generate image (subsequent) | 20-30 seconds |
| **Total setup time** | **~20 minutes** |

---

## ❌ Troubleshooting

### Issue: "RuntimeError: out of memory"

**Cause**: Not using T4 GPU, or GPU not properly detected.

**Solution**:
1. Go to **Runtime → Change runtime type**
2. Verify **Hardware accelerator** = **T4 GPU**
3. Click **Save** (this restarts the runtime)
4. Re-run Cell 1.2

### Issue: "HF_TOKEN not found"

**Cause**: Token wasn't added to Colab secrets.

**Solution**:
1. Click 🔑 icon in left sidebar
2. Add new secret: Name = `HF_TOKEN`, Value = your token
3. Enable "Notebook access"
4. Re-run Cell 0

### Issue: ngrok tunnel shows "Invalid authtoken"

**Cause**: Authtoken not added or incorrect.

**Solution**:
1. Go to [https://dashboard.ngrok.com/auth/your-authtoken](https://dashboard.ngrok.com/auth/your-authtoken)
2. Copy fresh authtoken
3. In Colab, click 🔑 icon
4. Add/update secret: Name = `NGROK_AUTHTOKEN`, Value = token
5. Re-run Cell 3

### Issue: "Port 8000 already in use"

**Cause**: Previous FastAPI instance still running.

**Solution**:
1. Click **Runtime → Restart runtime**
2. Re-run all cells in order

### Issue: Image quality is poor / blurry

**Solutions**:
1. Increase `steps`: Try 40-50 instead of 30
2. Increase `guidance_scale`: Try 10-12 instead of 7.5
3. Improve your prompt: Be more specific and descriptive
4. Use the seed from a good result and try variations

### Issue: ngrok tunnel expires / "Connection refused"

**Cause**: Colab session timed out (after ~8-12 hours of inactivity).

**Solution**:
1. Click **Runtime → Run all** to restart everything
2. A new ngrok URL will be generated
3. Update your app's API URL

---

## 📚 Resources

- **HuggingFace Model**: [stabilityai/stable-diffusion-xl-base-1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- **Diffusers Documentation**: [huggingface.co/docs/diffusers](https://huggingface.co/docs/diffusers)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Gradio Docs**: [gradio.app](https://gradio.app)
- **ngrok Documentation**: [ngrok.com/docs](https://ngrok.com/docs)

---

## ✨ Next Steps

1. **Scale it**: Deploy to a permanent server (Modal, Replicate, Hugging Face Spaces)
2. **Customize**: Fine-tune SDXL on your own dataset
3. **Enhance**: Add image-to-image, inpainting, or upscaling
4. **Monetize**: Offer as a service (if you host on paid servers)

---

**Happy generating! 🎨**
