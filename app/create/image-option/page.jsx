"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);

    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m), 
    })
      .then(({ data: { text } }) => {
        setOcrResult(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-10 flex flex-col items-center justify-center border rounded-xl shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Upload an Image</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading && <p className="mt-4 text-cyan-500">Extracting text from image....</p>}
        {ocrResult && (
          <div className="mt-4 text-center">
            <h3 className="font-semibold mb-2">📝 OCR Output:</h3>
            <p className="whitespace-pre-line max-w-md">{ocrResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
