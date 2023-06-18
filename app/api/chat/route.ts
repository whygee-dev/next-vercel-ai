import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const runtime = "edge";

function buildPompt(messages: { content: string; role: "system" | "user" | "assistant" }[]) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === "user") {
          return `<|prompter|>${content}<|endoftext|>`;
        } else {
          return `<|assistant|>${content}<|endoftext|>`;
        }
      })
      .join("") + "<|assistant|>"
  );
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await Hf.textGenerationStream({
    model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    inputs: buildPompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  const stream = HuggingFaceStream(response);

  return new StreamingTextResponse(stream);
}
