import React, { useState } from 'react';
import { Loader, Download } from 'lucide-react';

export default function SDXLImageGenerator() {
  const [apiUrl, setApiUrl] = useState('');
  const [prompt, setPrompt] = useState('A beautiful sunset over mountains, photorealistic, 8k');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, watermark');
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(-1);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState(null);
  const [seedUsed, setSeedUsed] = useState(null);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('disconnected');

  // Check API status
  const checkApiStatus = async () => {
    if (!apiUrl.trim()) {
      setError('Please enter your ngrok API URL');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        setApiStatus('connected');
        setError('');
        alert(`✅ Connected!\nGPU: ${data.gpu}\nVRAM: ${data.vram_used_gb}GB / ${data.vram_total_gb}GB`);
      }
    } catch (err) {
      setApiStatus('disconnected');
      setError(`❌ Cannot reach API. Check your URL and ensure Colab session is active.`);
    }
  };

  // Generate image
  const generateImage = async () => {
    if (!apiUrl.trim()) {
      setError('Please enter your ngrok API URL and test connection first');
      return;
    }

    if (apiStatus !== 'connected') {
      setError('API is not connected. Please test your URL first.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setError('');
    setImage(null);

    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          width: parseInt(width),
          height: parseInt(height),
          steps: parseInt(steps),
          guidance_scale: parseFloat(guidanceScale),
          seed: seed === -1 ? -1 : parseInt(seed),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setImage(`data:image/png;base64,${data.image_base64}`);
      setSeedUsed(data.seed_used);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Download image
  const downloadImage = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image;
    link.download = `sdxl-${seedUsed || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Randomize seed
  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 2147483647));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎨 SDXL Image Generator</h1>
          <p className="text-slate-400">Your free AI image generation API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* API URL Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4">🔗 API Configuration</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your ngrok URL
                  </label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://abc-123-def.ngrok-free.app"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Paste the URL from your Colab notebook</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={checkApiStatus}
                    className={`flex-1 px-4 py-2 rounded font-medium transition ${
                      apiStatus === 'connected'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {apiStatus === 'connected' ? '✅ Connected' : 'Test Connection'}
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4">📝 Prompt</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Main Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Describe what you want to generate..."
                  />
                  <p className="text-xs text-slate-400 mt-1">Be detailed and descriptive</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Negative Prompt
                  </label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="What to avoid in the image..."
                  />
                </div>
              </div>
            </div>

            {/* Generation Settings */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-4">⚙️ Settings</h2>

              <div className="space-y-4">
                {/* Inference Steps */}
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    Inference Steps: <span className="text-blue-400">{steps}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">30 = quality + speed balance</p>
                </div>

                {/* Guidance Scale */}
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    Guidance Scale: <span className="text-blue-400">{guidanceScale.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">How strictly to follow prompt</p>
                </div>

                {/* Seed */}
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    Seed: <span className="text-blue-400">{seed === -1 ? 'Random' : seed}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      placeholder="-1 for random"
                    />
                    <button
                      onClick={randomizeSeed}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600 transition"
                    >
                      🔄
                    </button>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Width</label>
                    <select
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="512">512</option>
                      <option value="1024">1024</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Height</label>
                    <select
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="512">512</option>
                      <option value="1024">1024</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={generating || apiStatus !== 'connected'}
              className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                generating || apiStatus !== 'connected'
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating... (30-45s)
                </>
              ) : (
                '🎨 Generate Image'
              )}
            </button>
          </div>

          {/* Image Display */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">🖼️ Generated Image</h2>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded p-4 mb-4 text-red-200">
                {error}
              </div>
            )}

            {image ? (
              <div className="flex flex-col items-center gap-4 flex-1">
                <img
                  src={image}
                  alt="Generated"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
                <div className="text-sm text-slate-400 text-center">
                  <p>Seed used: {seedUsed}</p>
                  <p className="text-xs mt-1">Use this seed with same prompt to reproduce</p>
                </div>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="text-lg mb-2">👇 Click "Generate Image" to start</p>
                  <p className="text-sm">1. Test your API connection first</p>
                  <p className="text-sm">2. Enter a detailed prompt</p>
                  <p className="text-sm">3. Click Generate and wait 30-45 seconds</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>💡 Tip: Use detailed, descriptive prompts for better results</p>
          <p>🚀 Your SDXL API is running locally in Google Colab via ngrok tunnel</p>
        </div>
      </div>
    </div>
  );
}
