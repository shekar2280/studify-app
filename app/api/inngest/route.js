import { serve } from "inngest/next";
import { inngest } from "@/inngest/client"; 
import { CreateNewUser, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "@/inngest/functions";

export const { POST } = serve({
  client: inngest,
  functions: [helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent],
});

export { POST as GET }; // Allow GET requests too
