"use client";
import React, { useState } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import TopicInput from "./_components/TopicInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Create() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateCourseOutline = async () => {
    const courseId = uuidv4();
    router.replace(`/loading-page?courseId=${courseId}`);
    
    try {
      await axios.post("/api/generate-course-outline", {
        courseId,
        ...formData,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

    } catch (error) {
      console.error("Generation Error", error);
      toast.error("Something went wrong while generating the course.");
    }
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-24 lg:px-36 mt-6 pb-20">
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-primary text-center">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-500 text-base sm:text-lg text-center mt-2">
        Fill all details in order to generate study material for your next
        project
      </p>

      <div className="mt-10">
        {step == 0 ? (
          <SelectOption
            selectedStudyType={(value) => handleUserInput("courseType", value)}
          />
        ) : (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) =>
              handleUserInput("difficultyLevel", value)
            }
          />
        )}
      </div>

      <div className="hidden sm:flex flex-row justify-between w-full gap-4 mt-10 sm:mt-20">
        {step != 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
        ) : (
          " - "
        )}
        {step == 0 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={GenerateCourseOutline}
            className="w-full sm:w-auto hover:bg-cyan-600/80 transition-colors duration-200"
          >
            Generate
          </Button>
        )}
      </div>

      <div className="flex sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 justify-between z-50">
        {step != 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
        )}
        {step == 0 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="flex-1 ml-2"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={GenerateCourseOutline}
            className="flex-1 ml-2 hover:bg-cyan-600/80 transition-colors duration-200"
          >
            Generate
          </Button>
        )}
      </div>
    </div>
  );
}

export default Create;
