// Small backend for the voice Q&A agent.
// Its only real job: hold the Anthropic API key server-side (never in the
// browser) and forward the person's question to Claude, then send the
// answer back. Also serves the frontend (public/index.html) as static files.

const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-6';

if(!ANTHROPIC_API_KEY){
  console.warn('WARNING: ANTHROPIC_API_KEY is not set. Set it in your .env file or hosting provider\'s environment variables.');
}

const SYSTEM_PROMPT =
  "You are a spoken voice assistant. Answer any question the person asks, on any topic, worldwide. " +
  "Always reply in the same language the question was asked in (Urdu or English) — match their script too " +
  "(Urdu script for Urdu, not Roman Urdu). Keep answers short and conversational, the way you'd actually speak " +
  "out loud: 2-4 sentences for most questions, since this will be read aloud by text-to-speech. Avoid lists, " +
  "headers, or markdown — plain spoken sentences only.";

app.post('/api/ask', async (req, res) => {
  try{
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    if(!history.length){
      return res.status(400).json({ error: 'No message history provided.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: history
      })
    });

    const data = await response.json();
    if(!response.ok){
      console.error('Anthropic API error:', data);
      return res.status(502).json({ error: 'The AI service did not respond correctly.' });
    }

    const answerText = (data.content || [])
      .map(block => block.type === 'text' ? block.text : '')
      .filter(Boolean)
      .join(' ')
      .trim();

    res.json({ answer: answerText || "Sorry, I couldn't get an answer just now." });
  } catch(err){
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Voice agent server running on port ${PORT}`));
