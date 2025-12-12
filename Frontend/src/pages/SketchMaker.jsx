import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SketchMaker() {
  const navigate = useNavigate();

  // All user selected features
  const [form, setForm] = useState({
    gender: "male",
    skinColor: "light",
    faceShape: "oval",
    eyeShape: "almond",
    eyeSize: "medium",
    eyeColor: "brown",
    noseType: "sharp",
    lips: "medium",
    hairType: "short black hair",
    beard: "none",
    bodyType: "medium",
    age: "age",
    clothing: "clothing",
    moustache: "moustache",
    extra: "",
  });

  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI Edit Assistant
  const [editPrompt, setEditPrompt] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generatePrompt = () => {
    return (
      `A passport-size photo of a ${form.gender} with ${form.skinColor} skin, ${form.faceShape} face shape, ` +
      `${form.eyeSize} ${form.eyeShape} ${form.eyeColor} eyes, ${form.noseType} nose, ${form.lips} lips, ` +
      `${form.hairType}, ${form.beard}, ${form.bodyType} body type, ${form.age} aged, wearing ${form.clothing}, ` +
      `studio lighting, plain white background, realistic high resolution photograph, face forward `+
      `${form.extra ? `Additional details: ${form.extra}.` : ""}`
    );
  };

  const generateImage = async () => {
    setLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatePrompt() }),
      });

      const data = await res.json();

      if (data.image) {
        setGeneratedImage(`data:image/png;base64,${data.image}`);
      } else {
        alert("Could not generate image");
      }
    } catch (error) {
      alert("Backend error");
    }

    setLoading(false);
  };

  // ------------------- AI EDIT ASSISTANT -------------------
  const handleApplyEdit = async () => {
    if (!generatedImage) return alert("Please generate an image first!");
    if (!editPrompt.trim()) return alert("Enter what changes you want.");

    setEditLoading(true);

    try {
      const base64 = generatedImage.replace("data:image/png;base64,", "");

      const res = await fetch("http://localhost:5000/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: editPrompt,
          image: base64,
        }),
      });

      const data = await res.json();

      if (data.edited_image) {
        setGeneratedImage("data:image/png;base64," + data.edited_image);
      } else {
        alert("Could not edit image");
      }
    } catch (err) {
      alert("Error calling edit API");
    }

    setEditLoading(false);
  };
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex">

      {/* LEFT SECTION (Form + Generate + Image) */}
      <div className="w-2/3 pr-6">

        <h1 className="text-4xl font-bold mb-6">Generate Passport Photo</h1>

        <div className="bg-gray-800 p-6 rounded-xl w-full">
          {/* ---------- FORM FIELDS ----------- */}

          {/* Gender */}
          <label className="block mt-2">Gender</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.gender}
            onChange={(e) => updateForm("gender", e.target.value)}
          >
            <option>male</option>
            <option>female</option>
          </select>

          {/* Skin Color */}
          <label className="block mt-2">Skin Color</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.skinColor}
            onChange={(e) => updateForm("skinColor", e.target.value)}
          >
            <option>fair</option>
            <option>light</option>
            <option>wheatish</option>
            <option>brown</option>
            <option>dark</option>
          </select>

          {/* Face Shape */}
          <label className="block mt-2">Face Shape</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.faceShape}
            onChange={(e) => updateForm("faceShape", e.target.value)}
          >
            <option>oval</option>
            <option>round</option>
            <option>square</option>
            <option>heart</option>
            <option>diamond</option>
          </select>

          {/* Moustache */}
          <label className="block mt-2">Moustache</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.moustache}
            onChange={(e) => updateForm("moustache", e.target.value)}
          >
            <option>large</option>
            <option>very little like a boy</option>
            <option>medium size</option>
          </select>

          {/* Eye Shape */}
          <label className="block mt-2">Eye Shape</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.eyeShape}
            onChange={(e) => updateForm("eyeShape", e.target.value)}
          >
            <option>almond</option>
            <option>round</option>
            <option>monolid</option>
            <option>hooded</option>
          </select>

          {/* Eye Size */}
          <label className="block mt-2">Eye Size</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.eyeSize}
            onChange={(e) => updateForm("eyeSize", e.target.value)}
          >
            <option>small</option>
            <option>medium</option>
            <option>large</option>
          </select>

          {/* Eye Color */}
          <label className="block mt-2">Eye Color</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.eyeColor}
            onChange={(e) => updateForm("eyeColor", e.target.value)}
          >
            <option>brown</option>
            <option>black</option>
            <option>blue</option>
            <option>hazel</option>
            <option>green</option>
          </select>

          {/* Nose */}
          <label className="block mt-2">Nose Type</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.noseType}
            onChange={(e) => updateForm("noseType", e.target.value)}
          >
            <option>sharp</option>
            <option>round</option>
            <option>broad</option>
            <option>flat</option>
          </select>

          {/* Lips */}
          <label className="block mt-2">Lips</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.lips}
            onChange={(e) => updateForm("lips", e.target.value)}
          >
            <option>thin</option>
            <option>medium</option>
            <option>full</option>
          </select>

          {/* Hair */}
          <label className="block mt-2">Hair Style</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.hairType}
            onChange={(e) => updateForm("hairType", e.target.value)}
          >
            <option>short black hair</option>
            <option>short brown hair</option>
            <option>long black hair</option>
            <option>long brown hair</option>
            <option>long curly hair</option>
            <option>short curly hair</option>
            <option>long wavy hair</option>
            <option>short wavy hair</option>
          </select>

          {/* Clothing */}
          <label className="block mt-2">Clothing Type</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.clothing}
            onChange={(e) => updateForm("clothing", e.target.value)}
          >
            <option>T-shirt</option>
            <option>shirt</option>
            <option>Kurta</option>
          </select>

          {/* Beard */}
          <label className="block mt-2">Beard</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.beard}
            onChange={(e) => updateForm("beard", e.target.value)}
          >
            <option>none</option>
            <option>short beard</option>
            <option>full beard</option>
            <option>mustache</option>
          </select>

          {/* Body */}
          <label className="block mt-2">Body Type</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.bodyType}
            onChange={(e) => updateForm("bodyType", e.target.value)}
          >
            <option>slim</option>
            <option>medium</option>
            <option>fat</option>
          </select>

          {/* Age */}
          <label className="block mt-2">Age</label>
          <select className="w-full p-2 bg-gray-700"
            value={form.age}
            onChange={(e) => updateForm("age", e.target.value)}
          >
            <option>1 to 5</option>
            <option>6 to 10</option>
            <option>10 to 15</option>
            <option>16 to 18</option>
            <option>19 to 20</option>
            <option>21 to 25</option>
            <option>26 to 30</option>
            <option>31 to 35</option>
            <option>36 to 40</option>
            <option>41 to 45</option>
            <option>46 to 50</option>
            <option>51 to 55</option>
            <option>56 to 60</option>
            <option>61 to 65</option>
            <option>old aged</option>
          </select>

          {/* Extra Description */}
          <label className="block mt-4 font-semibold">Extra Description (Optional)</label>
          <textarea
            className="w-full p-3 bg-gray-700 rounded-lg"
            rows="4"
            placeholder="Add any extra description the user wants to include..."
            value={form.extra || ""}
            onChange={(e) => updateForm("extra", e.target.value)}
          ></textarea>

          {/* Generate Photo Button */}
          <button
            className="mt-6 w-full bg-blue-600 p-3 rounded-lg font-semibold"
            onClick={generateImage}
          >
            {loading ? "Generating..." : "Generate Passport Photo"}
          </button>
        </div>

        {/* Show Image */}
        {generatedImage && (
          <div className="mt-8 text-center">
            <img src={generatedImage} alt="Generated" className="max-w-xs rounded-xl shadow-xl" />
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 p-3 rounded-lg"
              onClick={() => navigate("/edit", { state: { image: generatedImage } })}
            >
              Edit Image
            </button>
          </div>
        )}
      </div>

      {/* ------------------ RIGHT SECTION — AI EDIT ASSISTANT ------------------ */}
      <div className="w-1/3 bg-gray-800 p-6 rounded-xl h-full sticky top-4">
        <h2 className="text-2xl font-semibold mb-4">AI Edit Assistant</h2>

        <textarea
          className="w-full p-3 bg-gray-700 rounded-lg"
          rows="6"
          placeholder="Describe the edit you want, e.g. 'Make the eyes bigger'"
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
        />

        <button
          onClick={handleApplyEdit}
          className="w-full mt-3 bg-purple-600 hover:bg-purple-700 p-3 rounded-lg"
        >
          {editLoading ? "Editing..." : "Apply Edit"}
        </button>
      </div>
    </div>
  );
}
