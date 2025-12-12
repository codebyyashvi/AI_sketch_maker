from flask import Flask, request, jsonify
from flask_cors import CORS
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from dotenv import load_dotenv
import os
import base64
import google.generativeai as genai

# Load .env variables
load_dotenv()

API_KEY = os.getenv("STABILITY_API_KEY")
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("STABILITY_API_KEY not found in .env")

if not GOOGLE_API_KEY:
    raise ValueError("Gemini api key not found")

genai.configure(api_key=GOOGLE_API_KEY)

text_model = genai.GenerativeModel("gemini-2.5-flash")

# Initialize Stability Client
generator = client.StabilityInference(
    key=API_KEY,
    engine="stable-diffusion-xl-1024-v1-0",
)

img2img = client.StabilityInference(
    key=API_KEY,
    engine="stable-diffusion-xl-1.0-img2img",  # IMAGE → IMAGE
)

# Flask app
app = Flask(__name__)
CORS(app)   # Allow frontend to access backend

def save_image(binary_data, filename="output.png"):
    with open(filename, "wb") as f:
        f.write(binary_data)
    
@app.route("/edit", methods=["POST"])
def edit_image():
    data = request.get_json()
    user_edit_prompt = data.get("prompt", "")
    base64_image = data.get("image", "")

    if not user_edit_prompt or not base64_image:
        return jsonify({"error": "Prompt and image required"}), 400

    try:
        # Step 1: Generate refined prompt using Gemini
        gemini_response = text_model.generate_content(
            f"Convert this instruction into a stable diffusion image editing prompt. "
            f"Do NOT create a new scene. Only make realistic edits.\n"
            f"User instruction: {user_edit_prompt}"
        )

        refined_prompt = gemini_response.text
        # print in console 
        print("Gemini Prompt:", refined_prompt)
        print("Raw base64 received starts with:", base64_image[:40])

        # Step 2: Decode original image
        # Remove metadata prefix if present
        if base64_image.startswith("data:image"):
            base64_image = base64_image.split(",")[1]

        init_img_bytes = base64.b64decode(base64_image)
        print("Image bytes loaded:", len(init_img_bytes))


        # Step 3: Generate edited image
        # Create an artifact from the input image
        init_image_artifact = generation.Artifact(
            type=generation.ARTIFACT_IMAGE,
            binary=init_img_bytes
        )

        answers = img2img.generate(
            prompt=refined_prompt,
            init_images=[init_image_artifact],   # MUST be a list
            width=1024,
            height=1024,
            steps=30,
            cfg_scale=7.5,
            strength=0.35
        )

        for resp in answers:
            for artifact in resp.artifacts:
                if artifact.type == generation.ARTIFACT_IMAGE:
                    new_base64 = base64.b64encode(artifact.binary).decode("utf-8")
                    save_image(artifact.binary, "output.png")
                    return jsonify({
                        "edited_image": new_base64,
                        "used_prompt": refined_prompt
                    })

        return jsonify({"error": "No edited image generated"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt_text = data.get("prompt", "")

    if not prompt_text:
        return jsonify({"error": "Prompt required"}), 400

    try:
        # Generate image
        answers = generator.generate(
            prompt=prompt_text,
            width=1024,
            height=1024,
            steps=50,
            cfg_scale=8.0
        )

        # Extract and return base64
        for resp in answers:
            for artifact in resp.artifacts:
                if artifact.type == generation.ARTIFACT_IMAGE:
                    base64_img = base64.b64encode(artifact.binary).decode("utf-8")
                    save_image(artifact.binary, "output.png")
                    return jsonify({"image": base64_img})

        return jsonify({"error": "No image generated"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
