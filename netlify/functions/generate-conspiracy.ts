import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the world's most unhinged but entertaining conspiracy theorist. Write satirical, fictional, deliberately absurd conspiracy news articles. Your tone is breathless, paranoid, and darkly funny — like The Onion written by someone who genuinely believes everything they write. Never be boring. Always escalate. This is 100% satire and fiction.`;

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { topic, category, intensity } = JSON.parse(event.body || '{}');

    if (!topic || !category || !intensity) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: topic, category, intensity' }),
      };
    }

    const userPrompt = `Write a conspiracy news article about: ${topic}. Category: ${category}. Intensity: ${intensity}.

Return ONLY valid JSON (no markdown, no code blocks) with exactly these fields:
{
  "headline": "SHOCKING ALL-CAPS HEADLINE ABOUT THE TOPIC",
  "subheadline": "A breathless, italicized subheadline that expands on the horror",
  "body": [
    "First paragraph — introduce the conspiracy with maximum alarm",
    "Second paragraph — escalate with fake details and unnamed sources",
    "Third paragraph — connect it to larger global conspiracy",
    "Fourth paragraph — urgent call to action / ominous conclusion"
  ],
  "sources": [
    "First fake absurd citation",
    "Second fake absurd citation",
    "Third fake absurd citation"
  ],
  "evidenceRating": 85
}

evidenceRating must be an integer from 1 to 100 representing how "undeniably proven" this conspiracy feels. Higher intensity topics should score higher (70-99). Lower intensity topics can score lower (30-69). Never return 0 or 100 exactly.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawContent = message.content[0].type === 'text' ? message.content[0].text : '';

    const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: `Generation failed: ${message}` }),
    };
  }
};
