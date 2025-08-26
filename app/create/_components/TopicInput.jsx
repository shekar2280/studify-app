import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import Tesseract from "tesseract.js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GoUpload } from "react-icons/go";

function TopicInput({ setTopic, setDifficultyLevel }) {
  const router = useRouter();
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
        setTopic(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        setLoading(false);
      });
  };

  return (
    <div className="mt-2 w-full max-w-lg mx-auto flex-col">
      <h2 className="text-sm sm:text-base">
        Enter topic or paste the content for which you want to generate the
        content
      </h2>
      <Textarea
        placeholder="Start writing here"
        className="mt-2 w-full h-28 sm:h-40"
        onChange={(event) => setTopic(event.target.value)}
      />

      <div className="flex flex-col items-center justify-center mt-5 gap-4">
        <h2 className="text-sm sm:text-base"> OR </h2>
        <div className="p-4 w-full sm:w-[400px] flex flex-col items-center justify-center border rounded-xl shadow-md">
          <GoUpload className="mb-3" size={20} />
          <h2 className="mb-4 text-base font-semibold">Upload an Image</h2>
          <input
            type="file"
            accept="image/*"
            className="flex justify-center text-sm"
            onChange={handleImageUpload}
          />
          {loading && <p className="mt-4 text-cyan-500">Reading image...</p>}
          {ocrResult && (
            <div className="mt-4 text-center">
              <h3 className="font-semibold mb-2">📝 Topic Contents:</h3>
              <p className="whitespace-pre-line text-sm max-w-xs sm:max-w-md">
                {ocrResult}
              </p>
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-5 mb-3 text-sm sm:text-base">
        Select the difficulty level
      </h2>
      <Select onValueChange={(value) => setDifficultyLevel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Difficulty Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopicInput;
