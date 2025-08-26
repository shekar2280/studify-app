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
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0">
      <div className="w-full max-w-md p-6 sm:p-10 flex flex-col items-center justify-center border rounded-xl shadow-md bg-white">
        <h2 className="mb-4 text-lg sm:text-xl font-semibold text-center">
          Upload an Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-600 mb-4"
        />

        {loading && (
          <p className="mt-2 text-cyan-500 text-sm sm:text-base">
            Extracting text from image...
          </p>
        )}

        {ocrResult && (
          <div className="mt-4 w-full text-center">
            <h3 className="font-semibold mb-2 text-base sm:text-lg">
              📝 OCR Output:
            </h3>
            <p className="whitespace-pre-line text-sm sm:text-base bg-gray-50 p-3 rounded-lg border max-h-60 overflow-y-auto text-left">
              {ocrResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
