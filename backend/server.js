// backend/aiService.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create an AI-generated summary of the herbal supply chain.
 */
export async function generateTimelineSummary(batch) {
  const eventsFormatted = batch.events
    .map(
      (ev, i) =>
        `${i + 1}. ${ev.type} by ${ev.actorName} on ${ev.timestamp}. Details: ${ev.details}`
    )
    .join("\n");

  const prompt = `
You are an expert AYUSH supply-chain auditor.

Analyze this herbal batch lifecycle and produce:
- A clear traceability summary
- Notable quality checkpoints
- Any risks or missing steps
- Consumer-friendly explanation

Batch ID: ${batch.id}
Herb: ${batch.herbName}
Species: ${batch.species}

Events:
${eventsFormatted}

Write in simple, clear English.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
