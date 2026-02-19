// aiController.js
require('dotenv').config();

const { Ollama } = require('ollama');

const {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  blogSummaryPrompt,
} = require('../utils/prompts');

// ✅ Ollama Cloud client (API key from .env)
const ai = new Ollama({
  host: 'https://ollama.com',
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
});

// choose cloud model once
const MODEL = process.env.AI_MODEL || 'gpt-oss:120b';

// --------------------------
// Generate blog post content
// POST /api/ai/generate
// --------------------------
const generateBlogPost = async (req, res) => {
  try {
    const { title, tone } = req.body;

    if (!title || !tone) {
      return res.status(400).json({ message: 'title and tone are required' });
    }

const prompt = `
You are an expert blog writer.

Write a high-quality, engaging blog post.

TITLE: "${title}"
TONE: "${tone}"

OUTPUT FORMAT:
- Use Markdown formatting for headings, lists, quotes, and code
- Write naturally like a real blog article — not notes
- Do NOT include meta commentary
- Do NOT mention AI
- Do NOT wrap the entire output in code fences

CONTENT REQUIREMENTS:

# ${title}

## Introduction
- Strong hook
- Explain why this topic matters
- Preview what reader will gain

## Main Sections
- 2–4 well-developed sections
- Each with clear subheadings
- Short readable paragraphs
- Add insights, not generic filler
- Include practical explanations

## Examples / Practical Use
Include at least one of:
- real-world scenario
- mini case example
- step-by-step breakdown
- best-practice checklist

## Deep Value Add
Add one:
- pro tips
- common mistakes
- optimization advice
- comparison
- tradeoffs

## Key Takeaways
- Bullet summary of important points

## Conclusion
- Crisp wrap-up
- Forward-looking or action-oriented

STYLE RULES:
- Clear, concrete, not vague
- Avoid repetition
- Avoid buzzword stuffing
- Vary sentence length
- Keep it readable and professional
- Match the requested tone strictly

Return only the final article content.
`;


    const response = await ai.generate({
      model: MODEL,
      prompt,
    });

    res.status(200).json({ content: response.response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// --------------------------
// Generate blog post ideas
// POST /api/ai/generate-ideas
// --------------------------
const generateBlogPostIdeas = async (req, res) => {
  try {
    const { topics } = req.body;
    if (!topics) {
      return res.status(400).json({ message: 'Topics are required' });
    }

    const prompt = blogPostIdeasPrompt(topics);

    const response = await ai.generate({
      model: MODEL,
      prompt,
    });

    let rawText = response.response;

    const cleanedText = rawText
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// --------------------------
// Generate comment reply
// POST /api/ai/generate-reply
// --------------------------
const generateCommentReply = async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content required' });
    }

    const prompt = generateReplyPrompt({ author, content });

    const response = await ai.generate({
      model: MODEL,
      prompt,
    });

    res.status(200).json({ reply: response.response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --------------------------
// Generate blog summary
// POST /api/ai/generate-summary
// --------------------------
const generatePostSummary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content required' });
    }

    const prompt = blogSummaryPrompt(content);

    const response = await ai.generate({
      model: MODEL,
      prompt,
    });

    let rawText = response.response;

    const cleanedText = rawText
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  generateBlogPost,
  generateBlogPostIdeas,
  generateCommentReply,
  generatePostSummary,
};
