import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Zap, Check, AlertCircle, Loader } from 'lucide-react';

export default function SDXLStudio() {
  // State management
  const [apiUrl, setApiUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [prompt, setPrompt] = useState('A majestic eagle soaring over snowy mountains, photorealistic, cinematic lighting, 8k');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, watermark, text');
  
  // Generation parameters
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState(-1);
  const [dimensions, setDimensions] = useState({ width: 1024, height: 1024 });
  
  // Loading and results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const [image, setImage] = useState(null);
  const [seedUsed, setSeedUsed] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const imageRef = useRef(null);
  const startTimeRef = useRef(null);

  // Connect to API
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

  // Generate image
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

  // Download image
  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `sdxl-${seedUsed}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Random seed
  const randomSeed = () => setSeed(Math.floor(Math.random() * 2147483647));

  // Handle enter key in prompt
  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isConnected && !isGenerating) {
      generateImage();
    }
  };

  useEffect(() => {
    // Auto-focus prompt on mount
    if (typeof window !== 'undefined') {
      const promptInput = document.querySelector('[data-prompt-input]');
      if (promptInput) promptInput.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl">🎨</span>
          </div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SDXL Studio
          </h1>
          <p className="text-slate-400 text-lg">Professional AI image generation at your fingertips</p>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-in slide-in-from-top">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Connection */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-colors">
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

            {/* Prompt Input */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Prompt</label>
              <textarea
                data-prompt-input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handlePromptKeyDown}
                placeholder="Describe your image in detail..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">💡 Tip: Be descriptive and specific for better results</p>
            </div>

            {/* Negative Prompt */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Avoid</label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to exclude from the image..."
                rows="2"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            {/* Advanced Settings */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-4">Parameters</label>
              
              <div className="space-y-4">
                {/* Steps */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-300">Inference Steps</label>
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
                  <p className="text-xs text-slate-400 mt-1">Higher = better quality, slower</p>
                </div>

                {/* Guidance */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-300">Guidance Scale</label>
                    <span className="text-sm font-mono bg-slate-900/50 px-2.5 py-1 rounded text-blue-300">{guidance.toFixed(1)}</span>
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
                  <p className="text-xs text-slate-400 mt-1">How strictly to follow prompt</p>
                </div>

                {/* Seed */}
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
                  <p className="text-xs text-slate-400 mt-1">-1 = random, fixed number = reproducible</p>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Width</label>
                    <select
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="512">512px</option>
                      <option value="1024">1024px</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Height</label>
                    <select
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="512">512px</option>
                      <option value="1024">1024px</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
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
                  <span>Generating... ({generationTime}s)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  <span>Generate Image</span>
                </div>
              )}
            </button>
          </div>

          {/* Right Panel - Image Display */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Generated Image</h2>

            {image ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="relative group">
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Generated"
                    className="max-w-full max-h-96 rounded-lg shadow-2xl shadow-blue-500/20 border border-slate-700/50 group-hover:border-slate-600/50 transition-all"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="w-full space-y-3 text-center">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-1">Seed Used</p>
                    <p className="text-lg font-mono text-blue-300">{seedUsed}</p>
                    <p className="text-xs text-slate-500 mt-2">Use this seed with the same prompt to reproduce</p>
                  </div>

                  {generationTime && (
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-sm text-slate-400">Generated in {generationTime}s</p>
                    </div>
                  )}

                  <button
                    onClick={downloadImage}
                    className="w-full py-3 bg-green-600/20 border border-green-600/50 text-green-300 hover:bg-green-600/30 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    Download Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 opacity-50">🎨</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready to Create</h3>
                <p className="text-slate-400 mb-6 max-w-sm">
                  Connect your API, write a detailed prompt, adjust the parameters, and click <span className="font-semibold text-blue-300">Generate Image</span>
                </p>
                <div className="space-y-2 text-sm text-slate-500 text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-600/50 flex items-center justify-center text-xs">1</span>
                    <span>Connect to your ngrok API URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-600/50 flex items-center justify-center text-xs">2</span>
                    <span>Enter a detailed, descriptive prompt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-600/20 border border-pink-600/50 flex items-center justify-center text-xs">3</span>
                    <span>Click Generate and wait 30-45 seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm border-t border-slate-700/50 pt-8">
          <p>✨ Powered by Stable Diffusion XL Base 1.0 running in your Google Colab</p>
        </div>
      </div>
    </div>
  );
}