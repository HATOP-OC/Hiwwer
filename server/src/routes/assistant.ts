import { Router } from 'express';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '../db';
import { config } from '../config/config';

const router = Router();

// Simple in-memory per-session rate limiter to avoid loops and protect the external AI API.
// Note: This is a simple approach for debugging; in prod you may use Redis or a proper rate-limit solution.
const sessionRequests: Map<string, number[]> = new Map();
const MAX_REQUESTS_PER_MINUTE = 20; // e.g., 20 requests per minute per session
const REQUEST_WINDOW_MS = 60 * 1000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: `You are a helpful assistant for a website named Hiwwer. Your goal is to assist users with their questions about the platform, help them find services, and guide them through the process of placing orders. Be friendly, concise, and always focus on providing information relevant to the Hiwwer platform. Do not engage in conversations outside of this scope.`,
});

router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Message and sessionId are required' });
  }

    try {
      // Write initial request info to temporary debug file for reproducing loops
      try {
        fs.appendFileSync('/tmp/assistant_debug.log', JSON.stringify({ time: new Date().toISOString(), sessionId, message, source: 'incoming' }) + '\n');
      } catch (e) { /* ignore */ }
    // Rate-limit per session
    const now = Date.now();
    const times = sessionRequests.get(sessionId) || [];
    // keep only recent timestamps
    const windowed = times.filter(ts => ts > (now - REQUEST_WINDOW_MS));
    windowed.push(now);
    sessionRequests.set(sessionId, windowed);
    if (windowed.length > MAX_REQUESTS_PER_MINUTE) {
      console.warn(`Rate limit exceeded for assistant session ${sessionId}: ${windowed.length} req/min`);
      return res.status(429).json({ error: 'Rate limit exceeded for your session. Try again later.' });
    }

    // Prevent duplicate consecutive messages being sent continuously
    const lastUserResult = await query('SELECT message, created_at FROM ai_chat_history WHERE session_id = $1 AND sender = $2 ORDER BY created_at DESC LIMIT 1', [sessionId, 'user']);
    if (lastUserResult.rows.length > 0) {
      const last = lastUserResult.rows[0];
      const lastMsg = String(last.message);
      const lastTime = new Date(last.created_at).getTime();
      // If same message was sent in last 60 seconds, reject to prevent loops
      if (lastMsg === message && (now - lastTime) < REQUEST_WINDOW_MS) {
        console.warn(`Duplicate user message detected for session ${sessionId}, rejecting to avoid loop`);
        return res.status(429).json({ error: 'Duplicate requests detected. Please wait a bit before trying again.' });
      }
    }
    // 1. Fetch chat history
    const historyResult = await query(
      'SELECT sender, message FROM ai_chat_history WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    const history = historyResult.rows.map(row => ({
      role: row.sender === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }],
    }));

    // 2. Start a new chat session with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // 3. Send the new message to Gemini with retry/backoff on 429
    let assistantMessage: string | null = null;
    let attempt = 0;
    let lastErr: any = null;
    const maxAttempts = 3;
      while (attempt < maxAttempts) {
      try {
        const result = await chat.sendMessage(message);
        const response = result.response;
        assistantMessage = response.text();
          try { fs.appendFileSync('/tmp/assistant_debug.log', JSON.stringify({ time: new Date().toISOString(), sessionId, reply: assistantMessage, attempt }) + '\n'); } catch (e) {}
        break;
      } catch (err: any) {
        console.error(`Generative AI error on attempt ${attempt + 1}:`, err);
        try { fs.appendFileSync('/tmp/assistant_error.log', JSON.stringify({ time: new Date().toISOString(), sessionId, attempt, err: { message: err?.message, status: err?.status || err?.code, details: err?.errorDetails || '' } }) + '\n'); } catch (e) {}
        lastErr = err;
        // If rate limited, try to extract retry delay and wait
        if ((err?.status === 429 || err?.code === 429) && err?.errorDetails) {
          const retryInfo = err.errorDetails.find((d: any) => d['@type'] && d['@type'].includes('RetryInfo'));
          let retryDelayMs = 5000; // default 5s
          try {
            if (retryInfo?.retryDelay) {
              // retryDelay may be like '51s' or number of seconds
              const val = String(retryInfo.retryDelay);
              const secondsMatch = val.match(/(\\d+)/);
              if (secondsMatch) retryDelayMs = parseInt(secondsMatch[1], 10) * 1000;
            }
          } catch (e) {
            // ignore parse errors
          }
          // small delay before retry
          await new Promise(resolve => setTimeout(resolve, retryDelayMs));
          attempt += 1;
          continue;
        }
        // For other errors, rethrow
        throw err;
      }
    }
    if (!assistantMessage) {
      if (lastErr && (lastErr?.status === 429 || lastErr?.code === 429)) {
        const errToThrow: any = new Error('Rate limit from AI');
        errToThrow.status = 429;
        errToThrow.errorDetails = lastErr?.errorDetails || lastErr?.details || '';
        throw errToThrow;
      }
      throw new Error('Failed to get assistant response after retries');
    }

    // 4. Save user message and assistant response to the database
    await query(
      'INSERT INTO ai_chat_history (session_id, sender, message) VALUES ($1, $2, $3)',
      [sessionId, 'user', message]
    );
    await query(
      'INSERT INTO ai_chat_history (session_id, sender, message) VALUES ($1, $2, $3)',
      [sessionId, 'assistant', assistantMessage]
    );

    // 5. Send the response to the client
    res.json({ reply: assistantMessage });
    } catch (error: any) {
    // Log more details to file
    try {
      fs.appendFileSync('/tmp/assistant_error.log', JSON.stringify({ time: new Date().toISOString(), sessionId, message, error: { message: error?.message, status: error?.status || error?.code, details: error?.errorDetails || '' } }) + '\n');
    } catch (e) {}
    console.error('Error with Gemini API:', error);
    // Handle 429 more explicitly
    if (error?.status === 429 || error?.code === 429) {
      const retryInfo = error?.errorDetails?.find((d: any) => d['@type'] && d['@type'].includes('RetryInfo'));
      let retryDelaySec = 5;
      try {
        if (retryInfo?.retryDelay) {
          const secondsMatch = String(retryInfo.retryDelay).match(/(\d+)/);
          if (secondsMatch) retryDelaySec = parseInt(secondsMatch[1], 10);
        }
      } catch (e) {
        // ignore parse issues
      }
      return res.status(429).json({ error: `Rate limit exceeded. Retry after ${retryDelaySec} seconds.`, retryAfter: retryDelaySec });
    }
    res.status(500).json({ error: 'Failed to get a response from the assistant' });
  }
});

// GET /v1/assistant/history/:sessionId - отримати історію чату
router.get('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'SessionId is required' });
  }

  try {
    const historyResult = await query(
      'SELECT sender, message, created_at FROM ai_chat_history WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    const messages = historyResult.rows.map(row => ({
      sender: row.sender,
      text: row.message,
      timestamp: row.created_at,
    }));

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// DELETE /v1/assistant/history/:sessionId - очистити історію чату
router.delete('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'SessionId is required' });
  }

  try {
    await query(
      'DELETE FROM ai_chat_history WHERE session_id = $1',
      [sessionId]
    );

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

export default router;