import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState } from "react";
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
import { Check, Loader } from "lucide-react";

function TopicInput({ setTopic, setDifficultyLevel }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    <div className="mt-1 w-full max-w-lg mx-auto flex-col">
      <h2 className="text-sm sm:text-base">
        Enter topic or paste the content for which you want to generate the
        content
      </h2>
      <Textarea
        placeholder="Start writing here"
        className="mt-2 w-full h-24 sm:h-30"
        onChange={(event) => setTopic(event.target.value)}
      />

      <div className="flex flex-col items-center justify-center mt-5 gap-4">
        <h2 className="text-sm sm:text-base"> OR </h2>
        <div className="p-4 w-full sm:w-[400px] flex flex-col items-center justify-center border rounded-xl shadow-md">
          
          <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-2 text-base font-semibold">
            <GoUpload size={20} /> Upload an Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {loading && (
            <div className="flex flex-row gap-3">
              <Loader />
              <p className="mt-4 text-cyan-500"> Reading image...</p>
            </div>
          )}
          {ocrResult && (
            <div className="mt-4 text-center text-green-400 flex flex-row gap-2">
              <Check />
              <h3 className="font-semibold text-green-400 mb-2">
                File Uploaded{" "}
              </h3>
              {/* <p className="whitespace-pre-line text-sm max-w-xs sm:max-w-md">
                {ocrResult}
              </p> */}
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
