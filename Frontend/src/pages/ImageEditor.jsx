import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ImageEditor = () => {
  const location = useLocation();
  const image = location.state?.image;

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imgRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);

  const [undoStack, setUndoStack] = useState([]);

  // Load image into canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      imgRef.current = img;
    };
  }, [image]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;

    setUndoStack((prev) => [...prev, canvas.toDataURL()]);
    const ctx = ctxRef.current;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = ctxRef.current;
    ctx.closePath();
    setIsDrawing(false);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const previous = undoStack.pop();
    setUndoStack([...undoStack]);

    const img = new Image();
    img.src = previous;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.drawImage(imgRef.current, 0, 0);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Edit Your Image</h1>

      <div className="mb-4 flex gap-4 items-center">
        <label>
          Brush Size:
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="ml-2"
          />
        </label>

        <label>
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="ml-2"
          />
        </label>

        <button onClick={() => setBrushColor("#000000")} className="bg-gray-700 p-2 rounded">
          Eraser
        </button>

        <button onClick={undo} className="bg-blue-600 p-2 rounded">Undo</button>
        <button onClick={clearCanvas} className="bg-yellow-600 p-2 rounded">Reset</button>
        <button onClick={downloadImage} className="bg-green-600 p-2 rounded">Download</button>
      </div>

      <canvas
        ref={canvasRef}
        className="shadow-lg rounded-xl border border-gray-700"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </div>
  );
};

export default ImageEditor;
