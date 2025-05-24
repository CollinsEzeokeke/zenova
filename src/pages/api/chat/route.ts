import { google } from "@ai-sdk/google";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export default async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
    toolCallStreaming: true,
    system,
    tools: {
      ...frontendTools(tools),
      // add backend tools here
    },
  });

  return result.toDataStreamResponse();
}
