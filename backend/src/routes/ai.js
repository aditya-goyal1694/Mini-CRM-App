const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/suggest-messages', async (req, res) => {
  const { objective } = req.body;

  if (!objective) {
    return res.status(400).json({ error: 'Objective is required.' });
  }

  try {
    const businessName = "Mini-CRM";
    const prompt = `
      Write 3 catchy, friendly SMS messages for this campaign goal: "${objective}".
      The app/service is called "${businessName}".
      Make them each 1-2 sentences. Avoid emojis. Return only the messages, numbered.
    `;

    // Get Gemini model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    // Extract AI suggestions (lines starting with a number)
    const suggestions = aiText
      .split('\n')
      .filter(line => /^\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);

    return res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch AI suggestions." });
  }
});

module.exports = router;