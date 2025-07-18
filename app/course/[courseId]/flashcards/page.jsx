"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FlashcardItem from "./_components/FlashcardItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";



function Flashcards() {
  const { courseId } = useParams();
  const route = useRouter();
  const [flashCards, setFlashCards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState();
  const { user } = useUser();

  useEffect(() => {
    GetFlashcards();
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", (index) => {
      setFlippedStates({});
      setCurrentIndex(index);
    });
  }, [api]);

  const GetFlashcards = async () => {
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
      studyType: "Flashcards",
    });
    setFlashCards(result?.data?.content || []);
  };

  const handleClick = (index) => {
    setFlippedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <div className="mt-20">
        {flashCards.length > 0 ? (
          <Carousel setApi={setApi}>
            <CarouselContent>
              {flashCards.map((flashcard, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center"
                >
                  <FlashcardItem
                    handleClick={() => handleClick(index)}
                    isFlipped={flippedStates[index] || false}
                    flashcard={flashcard}
                  />
                </CarouselItem>
              ))}
              <CarouselItem className="flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-5">
                  <h2 className="text-4xl font-semibold">End of Flashcards</h2>
                  <Button
                    className="mt-4"
                    onClick={async () => {
                      try {
                        await axios.post("/api/progress", {
                          userId: user?.id,
                          courseId,
                          type: "flashcards",
                          value: true,
                        });
                      } catch (error) {
                        console.error("Failed to update progress:", error);
                      } finally {
                        route.back();
                      }
                    }}
                  >
                    Go to Course Page
                  </Button>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 ">
            <p className="mt-4 text-gray-500">Loading Flashcards...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcards;
