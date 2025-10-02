import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '../db';
import { config } from '../config/config';

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: `You are a helpful assistant for a website named Hiwwer. Your goal is to assist users with their questions about the platform, help them find services, and guide them through the process of placing orders. Be friendly, concise, and always focus on providing information relevant to the Hiwwer platform. Do not engage in conversations outside of this scope.`,
});

router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Message and sessionId are required' });
  }

  try {
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

    // 3. Send the new message to Gemini
    const result = await chat.sendMessage(message);
    const response = result.response;
    const assistantMessage = response.text();

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
  } catch (error) {
    console.error('Error with Gemini API:', error);
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