# Stable Diffusion XL Studio

A full-stack AI image generation application powered by **Stable Diffusion XL (SDXL)**, with a React frontend and a Google Colab backend served over ngrok.

## Features

- **React UI** — prompt editor, negative prompt, steps, guidance scale, seed, and dimensions
- **Real-time generation** — live timer while SDXL generates your image
- **Download support** — save generated images directly from the browser
- **Python integration** — batch generation and variation scripts via `SDXL_Python_Integration.py`
- **Colab-ready backend** — runs SDXL on free/paid Colab GPU, exposed via ngrok tunnel

## Project Structure

```
Stable_diffusion/
├── SDXL_ReactApp.jsx            # Primary React UI component
├── SDXL_Interactive_UI.jsx      # Alternative interactive UI
├── SDXL_Python_Integration.py   # Python client for batch generation
├── package.json                 # Node.js / React dependencies
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variable template
├── SDXL_Setup_Guide.md          # Google Colab backend setup
├── SDXL_Setup_Checklist.txt     # Step-by-step setup checklist
├── QUICK_START_GUIDE.md         # 3-option quick start overview
├── LOCAL_SETUP_COMPLETE_GUIDE.md
└── docs/                        # Additional guides
```

## Quick Start

### 1. Backend — Google Colab

1. Open **Google Colab** and enable a GPU runtime (`Runtime → Change runtime type → T4 GPU`)
2. Follow [SDXL_Setup_Guide.md](SDXL_Setup_Guide.md) to install and launch the FastAPI server
3. Copy the **ngrok public URL** (e.g. `https://abc-123-def.ngrok-free.app`)

### 2. Frontend — React App

```bash
# Clone the repo
git clone https://github.com/ajvizganapathy-pixel/Stable_diffusion.git
cd Stable_diffusion

# Install dependencies
npm install

# Start the dev server
npm start
```

Open [http://localhost:3000](http://localhost:3000), paste your ngrok URL, and start generating.

### 3. Python Client (optional)

```bash
pip install -r requirements.txt

python - <<'EOF'
from SDXL_Python_Integration import SDXLImageGenerator

gen = SDXLImageGenerator("https://your-ngrok-url.ngrok-free.app")
gen.check_health()
gen.generate_image("A sunset over mountains, photorealistic, 8k")
EOF
```

## Environment Variables

Copy `.env.example` to `.env` and set your ngrok URL:

```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_URL
```

## Generation Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Steps | 30 | Inference steps (more = higher quality, slower) |
| Guidance Scale | 7.5 | Prompt adherence (higher = closer to prompt) |
| Seed | -1 | -1 for random; set a value to reproduce results |
| Width × Height | 1024×1024 | Output resolution |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, lucide-react |
| Backend | Python, FastAPI, ngrok |
| AI Model | Stable Diffusion XL (SDXL) |
| GPU Runtime | Google Colab (T4 / A100) |
| Deployment | Vercel (frontend) |

## Deployment

The React app can be deployed to **Vercel** in one click — see [GITHUB_COMPLETE_GUIDE.md](GITHUB_COMPLETE_GUIDE.md) for the full walkthrough.

## License

[MIT](LICENSE)
