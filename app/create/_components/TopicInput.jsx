import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput({setTopic, setDifficultyLevel}) {
  return (
    <div className="mt-10 w-full flex-col">
      <h2>
        Enter topic or paste the content for which you want to generate the
        content
      </h2>
      <Textarea placeholder="Start writing here" className="mt-2 w-full" onChange={(event)=>setTopic(event.target.value)} />

      <h2 className="mt-5 mb-3">Select the difficulty level</h2>
      <Select onValueChange={(value)=>setDifficultyLevel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Difficulty Level"/>
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
