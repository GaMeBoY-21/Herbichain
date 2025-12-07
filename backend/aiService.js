// backend/aiService.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in Render / env
});

/**
 * Generate a natural-language explanation of a batch's lifecycle.
 */
export async function generateTimelineSummary(batch) {
  if (!batch) {
    throw new Error("Batch is required for AI summary");
  }

  // Keep payload reasonable
  const trimmedBatch = {
    id: batch.id,
    herbName: batch.herbName,
    species: batch.species,
    farmerName: batch.farmerName,
    location: batch.location || batch.locationName,
    status: batch.status,
    events: (batch.events || []).map((ev) => ({
      type: ev.type,
      by: ev.by,
      actorName: ev.actorName,
      timestamp: ev.timestamp,
      details: ev.details,
      locationName: ev.locationName,
      geo: ev.geo,
      labReportIpfsHash: ev.labReportIpfsHash,
    })),
  };

  const prompt = `
You are an assistant helping non-technical users understand an Ayurvedic herb supply chain.

Given this batch JSON, explain the lifecycle in **simple, clear paragraphs**:
- What herb is this?
- Where and by whom was it harvested?
- What tests were done at lab stage? (Mention IPFS hash if present)
- What did the manufacturer do?
- How did the distributor move it?
- Any red flags (e.g., missing lab test)?

Keep it under 250 words. Use friendly tone. Do NOT invent events that aren't in the JSON.

Batch JSON:
${JSON.stringify(trimmedBatch, null, 2)}
  `.trim();

  const response = await client.responses.create({
    model: "gpt-4.1-mini", // good balance of quality + cost
    input: prompt,
  });

  // Modern SDK exposes helper `output_text`
  const text = response.output_text || "No AI summary available.";
  return text.trim();
}
