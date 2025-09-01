import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, GenerateNotes, GenerateStudyTypeContent, helloWorld, generateCourseOutline, StoreNewMessage } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent, generateCourseOutline, StoreNewMessage 
  ],
});
