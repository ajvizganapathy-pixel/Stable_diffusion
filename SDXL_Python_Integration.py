"""
SDXL Image Generator - Python Integration
Use this script to generate images from your SDXL API running in Google Colab
"""

import requests
import base64
from PIL import Image
from io import BytesIO
import json

class SDXLImageGenerator:
    def __init__(self, api_url):
        """
        Initialize the SDXL Image Generator
        
        Args:
            api_url: Your ngrok public URL (e.g., https://abc-123-def.ngrok-free.app)
        """
        self.api_url = api_url.rstrip('/')
        self.last_seed = None
    
    def check_health(self):
        """Check if the API is running and get GPU status"""
        try:
            response = requests.get(f"{self.api_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print("✅ API is connected!")
                print(f"   GPU: {data['gpu']}")
                print(f"   VRAM: {data['vram_used_gb']:.1f}GB / {data['vram_total_gb']:.1f}GB")
                return True
            else:
                print(f"❌ API returned status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Cannot reach API: {e}")
            print("   Make sure your Colab session is active and URL is correct")
            return False
    
    def generate(self, prompt, negative_prompt="blurry, low quality, distorted, watermark",
                 width=1024, height=1024, steps=30, guidance_scale=7.5, seed=-1,
                 save_path="generated_image.png"):
        """
        Generate an image using SDXL
        
        Args:
            prompt: What you want to generate
            negative_prompt: What to avoid
            width: Image width (512 or 1024)
            height: Image height (512 or 1024)
            steps: Number of inference steps (10-50)
            guidance_scale: How strictly to follow prompt (1-15)
            seed: Random seed (-1 for random)
            save_path: Where to save the image
        
        Returns:
            dict with 'image' (PIL Image), 'seed', 'prompt'
        """
        print(f"⏳ Generating image with prompt: '{prompt}'")
        
        try:
            payload = {
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "width": width,
                "height": height,
                "steps": steps,
                "guidance_scale": guidance_scale,
                "seed": seed
            }
            
            response = requests.post(
                f"{self.api_url}/generate",
                json=payload,
                timeout=120  # 2 minute timeout for generation
            )
            
            if response.status_code != 200:
                print(f"❌ API error: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
            
            data = response.json()
            self.last_seed = data['seed_used']
            
            # Decode base64 image
            img_data = base64.b64decode(data['image_base64'])
            image = Image.open(BytesIO(img_data))
            
            # Save image
            image.save(save_path)
            print(f"✅ Image generated successfully!")
            print(f"   Seed: {data['seed_used']}")
            print(f"   Saved to: {save_path}")
            
            return {
                'image': image,
                'seed': data['seed_used'],
                'prompt': data['prompt'],
                'width': data['width'],
                'height': data['height']
            }
            
        except requests.Timeout:
            print("❌ Request timed out. Image generation took too long.")
            return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
    
    def batch_generate(self, prompts, output_dir="generated_images"):
        """
        Generate multiple images
        
        Args:
            prompts: List of prompts
            output_dir: Directory to save images
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        for idx, prompt in enumerate(prompts, 1):
            print(f"\n[{idx}/{len(prompts)}]")
            save_path = os.path.join(output_dir, f"image_{idx:02d}.png")
            self.generate(prompt, save_path=save_path)
    
    def vary_seed(self, prompt, base_seed, variations=3, **kwargs):
        """
        Generate variations of an image by changing the seed
        
        Args:
            prompt: The prompt to use
            base_seed: Starting seed
            variations: Number of variations
            **kwargs: Other generation parameters
        """
        results = []
        for i in range(variations):
            seed = base_seed + i
            print(f"\n[Variation {i+1}/{variations}] - Seed: {seed}")
            result = self.generate(prompt, seed=seed, **kwargs)
            if result:
                results.append(result)
        return results


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    # 1. Initialize with your ngrok URL
    API_URL = "YOUR_NGROK_URL_HERE"  # Replace with your actual URL
    
    # Example: API_URL = "https://abc-123-def.ngrok-free.app"
    
    if API_URL == "YOUR_NGROK_URL_HERE":
        print("❌ Please update API_URL with your actual ngrok URL")
        print("   You can find it in your Colab notebook output")
        exit(1)
    
    # 2. Create generator instance
    generator = SDXLImageGenerator(API_URL)
    
    # 3. Check if API is working
    print("Checking API connection...\n")
    if not generator.check_health():
        print("\n❌ Cannot connect to API. Make sure:")
        print("   1. Your Colab session is active")
        print("   2. Cell 3 (FastAPI) is running")
        print("   3. Your ngrok URL is correct")
        exit(1)
    
    # ========================================================================
    # EXAMPLE 1: Simple Image Generation
    # ========================================================================
    print("\n" + "="*60)
    print("EXAMPLE 1: Simple Generation")
    print("="*60)
    
    result = generator.generate(
        prompt="A majestic eagle soaring over snowy mountains, photorealistic, cinematic lighting, 8k",
        save_path="eagle.png"
    )
    
    if result:
        print(f"✅ Success! Image saved with seed: {result['seed']}")
    
    # ========================================================================
    # EXAMPLE 2: Batch Generation (Multiple Prompts)
    # ========================================================================
    print("\n" + "="*60)
    print("EXAMPLE 2: Batch Generation")
    print("="*60)
    
    prompts = [
        "A red fox in a snowy forest, photorealistic, 8k",
        "A futuristic city at night with neon lights",
        "An oil painting of a sunset over the ocean"
    ]
    
    # Uncomment to run batch generation:
    # generator.batch_generate(prompts)
    
    # ========================================================================
    # EXAMPLE 3: Generate Variations (Same Prompt, Different Seeds)
    # ========================================================================
    print("\n" + "="*60)
    print("EXAMPLE 3: Variations")
    print("="*60)
    
    if result:  # Use the seed from Example 1
        base_seed = result['seed']
        print(f"\nGenerating 2 variations of the eagle image...")
        print(f"(Using base seed: {base_seed})")
        
        # Uncomment to generate variations:
        # variations = generator.vary_seed(
        #     prompt=result['prompt'],
        #     base_seed=base_seed,
        #     variations=2,
        #     steps=30
        # )
    
    # ========================================================================
    # EXAMPLE 4: Fine-Tuning Parameters
    # ========================================================================
    print("\n" + "="*60)
    print("EXAMPLE 4: Parameter Tuning")
    print("="*60)
    
    print("\nGenerating with different guidance scales...")
    
    # Uncomment to test different guidance scales:
    # for guidance in [5.0, 7.5, 10.0, 12.0]:
    #     print(f"\n--- Guidance Scale: {guidance} ---")
    #     generator.generate(
    #         prompt="A beautiful woman in a red dress, portrait, photorealistic",
    #         guidance_scale=guidance,
    #         save_path=f"guidance_{guidance}.png"
    #     )
    
    print("\n" + "="*60)
    print("Done! Check your generated images.")
    print("="*60)
