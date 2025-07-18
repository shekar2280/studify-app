import React from "react";
import ReactCardFlip from "react-card-flip";

function FlashcardItem({ isFlipped, handleClick, flashcard }) {
  return (
    <div className="flex items-center justify-center p-10">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <div className="p-8 bg-cyan-600 shadow-lg text-white flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[250px] md:h-[350px] md:w-[250px]" onClick={handleClick}>
        <h2>{flashcard?.front}</h2>
      </div>

      <div className="p-8 bg-white shadow-xl text-cyan-600 flex items-center justify-center rounded-lg cursor-pointer h-[250px] w-[250px] md:h-[350px] md:w-[250px]" onClick={handleClick}>
        <h2>{flashcard.back}</h2>
      </div>
      </ReactCardFlip>
    </div>
  );
}

export default FlashcardItem;
