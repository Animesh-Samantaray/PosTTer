# AI Routes Documentation

## Overview
The AI module provides a set of endpoints that leverage **Google's Gemini AI API** to assist with blog content generation and management. These endpoints enable users to generate blog posts, ideas, comment replies, and summaries using advanced AI technology.

---

## Module Structure

### File: `aiRoute.js`
Defines all AI-related API endpoints and their routing.

### File: `aiController.js`
Contains the business logic for each AI endpoint, handling Gemini API calls and response processing.

---

## API Endpoints

### 1. **Generate Blog Post**
**Route:** `POST /api/ai/generate`  
**Access Level:** ⚠️ **PROTECTED** (requires authentication via `protect` middleware)

#### Purpose
Generates a complete, formatted blog post based on a title and desired tone.

#### Request Body
```json
{
  "title": "string (required) - The title of the blog post",
  "tone": "string (required) - The tone/style (e.g., 'professional', 'casual', 'humorous')"
}
```

#### Response
```json
{
  "content": "string - Full blog post in Markdown format"
}
```

#### How It Works
1. Validates that both `title` and `tone` are provided
2. Constructs a detailed prompt with formatting instructions
3. Sends the prompt to Gemini 2.5 Flash model
4. Returns the generated Markdown-formatted blog post

#### Response Format
- Uses Markdown formatting with `#` for headings, `##` for subheadings
- Includes bullet points, code blocks, and proper structure
- Contains an introduction, 1-3 main sections, and a conclusion

#### Error Handling
- **400 Bad Request:** If `title` or `tone` is missing
- **500 Internal Server Error:** If Gemini API fails

#### Example Usage
```javascript
// Request
{
  "title": "Getting Started with Node.js",
  "tone": "professional"
}

// Response
{
  "content": "# Getting Started with Node.js\n\n## Introduction\nNode.js is a JavaScript..."
}
```

---

### 2. **Generate Blog Post Ideas**
**Route:** `POST /api/ai/generate-ideas`  
**Access Level:** ⚠️ **PROTECTED** (requires authentication)

#### Purpose
Generates creative blog post ideas/titles based on provided topics.

#### Request Body
```json
{
  "topics": "string (required) - Topics or keywords to generate ideas from"
}
```

#### Response
```json
{
  "ideas": ["idea1", "idea2", "idea3", ...],
  // Additional structured data from API response
}
```

#### How It Works
1. Validates that `topics` field is provided
2. Uses the `blogPostIdeasPrompt()` utility function to create a structured prompt
3. Sends request to Gemini 2.5 Flash model
4. Parses the JSON response (removes markdown code block formatting)
5. Returns structured idea data

#### Response Format
- Returns parsed JSON with blog post ideas
- Automatically cleans up code block formatting from the AI response
- Processes raw text by removing ```json markers

#### Error Handling
- **400 Bad Request:** If `topics` is missing
- **500 Internal Server Error:** If API fails or JSON parsing fails

#### Example Usage
```javascript
// Request
{
  "topics": "JavaScript async programming"
}

// Response
{
  "ideas": [
    "Mastering Async/Await",
    "Promises vs Callbacks",
    "Event Loop Explained"
  ]
}
```

---

### 3. **Generate Comment Reply**
**Route:** `POST /api/ai/generate-reply`  
**Access Level:** ⚠️ **PROTECTED** (requires authentication)

#### Purpose
Generates an AI-powered reply to a blog comment, maintaining context about the comment author and content.

#### Request Body
```json
{
  "author": "string - Name of the comment author",
  "content": "string (required) - The comment text to reply to"
}
```

#### Response
```json
{
  // Returns the generated reply as raw text (not JSON)
  "text": "Thank you for your comment..."
}
```

#### How It Works
1. Validates that `content` field is provided (author is optional context)
2. Uses `generateReplyPrompt()` utility to create a contextual prompt
3. Sends the prompt to Gemini 2.5 Flash model
4. Returns the generated reply as plain text

#### Response Format
- Returns raw text response from the model
- Not parsed as JSON (unlike ideas and summary endpoints)
- Designed for direct display as a reply

#### Error Handling
- **400 Bad Request:** If required fields are missing
- **500 Internal Server Error:** If Gemini API fails

#### Example Usage
```javascript
// Request
{
  "author": "John Developer",
  "content": "How do I optimize my React components?"
}

// Response
{
  "text": "Great question John! There are several ways to optimize React components..."
}
```

---

### 4. **Generate Post Summary**
**Route:** `POST /api/ai/generate-summary`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Generates a concise summary of blog post content, extracting key points and metadata.

#### Request Body
```json
{
  "content": "string (required) - The blog post content to summarize"
}
```

#### Response
```json
{
  "summary": "string - Concise summary of the content",
  "keyPoints": ["point1", "point2", "point3"],
  // Additional structured data
}
```

#### How It Works
1. Validates that `content` is provided
2. Uses `blogSummaryPrompt()` utility to create summarization prompt
3. Sends the content to Gemini 2.5 Flash model
4. Parses the JSON response (removes markdown code block formatting)
5. Returns structured summary data

#### Response Format
- Returns parsed JSON with structured summary information
- Cleans the response by removing code block markers
- Provides key points extraction

#### Error Handling
- **400 Bad Request:** If `content` is missing
- **500 Internal Server Error:** If API fails or JSON parsing fails

#### Example Usage
```javascript
// Request
{
  "content": "Node.js is a JavaScript runtime... (full blog post)"
}

// Response
{
  "summary": "Node.js is a powerful JavaScript runtime for server-side development...",
  "keyPoints": [
    "Asynchronous programming model",
    "Event-driven architecture",
    "Large ecosystem with npm"
  ]
}
```

---

## Security & Authentication

### Middleware Used
- **`protect` middleware** (from `authMiddlewares.js`)
  - Applied to: `/generate`, `/generate-ideas`, `/generate-reply`
  - Verifies user authentication before allowing access
  - Ensures only logged-in users can access these resources

### Public Endpoint
- **`/generate-summary`** - Does NOT use `protect` middleware
  - Allows public access for summarizing content
  - No authentication token required
  - Useful for previews and public-facing features

---

## Gemini AI Integration

### Model Used
**Gemini 2.5 Flash**
- Latest, fastest Gemini model
- Optimized for quick responses
- Handles both text and code generation

### Configuration
```javascript
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```
- Requires `GEMINI_API_KEY` environment variable
- Initialized at module load time

### Prompt Utilities (from `utils/prompts.js`)
- `blogPostIdeasPrompt()` - Creates structured prompt for idea generation
- `generateReplyPrompt()` - Creates contextual prompt for replies
- `blogSummaryPrompt()` - Creates prompt for content summarization

---

## Request & Response Flow

### Typical Flow for Protected Endpoint
```
Client Request
    ↓
Express Router (aiRoute.js)
    ↓
Authentication Middleware (protect)
    ↓
Controller Function (aiController.js)
    ↓
Validate Input
    ↓
Create Prompt
    ↓
Call Gemini API
    ↓
Parse Response (if JSON)
    ↓
Return to Client
```

---

## Error Handling

### Common Error Responses

**400 - Bad Request**
```json
{
  "message": "title and tone are required"
}
```
Occurs when required fields are missing from the request body.

**500 - Internal Server Error**
```json
{
  "message": "API error details or parsing error"
}
```
Occurs when:
- Gemini API fails or is unreachable
- JSON parsing fails (for ideas/summary endpoints)
- Server-side processing error

---

## Usage Tips

### For Blog Post Generation
- Keep titles specific and descriptive
- Choose tone that matches your blog's voice
- Preview the generated content before publishing

### For Idea Generation
- Use broad topics for diverse suggestions
- Combine multiple topic generations for better results
- Edit and refine AI-generated ideas

### For Comment Replies
- The system maintains context about who commented
- Replies are personalized based on comment content
- Always review AI replies for accuracy and tone

### For Content Summarization
- Works with any blog content length
- Public endpoint means it can be used in frontends
- Great for generating meta descriptions and previews

---

## Environment Variables Required
```
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## Related Files
- Route Definition: `aiRoute.js`
- Controller Logic: `aiController.js`
- Prompt Templates: `utils/prompts.js`
- Authentication Middleware: `middlewares/authMiddlewares.js`

---

## Summary

The AI module provides four powerful endpoints that integrate Google's Gemini AI to enhance the blog platform with:

✅ **Content Generation** - Blog posts with specific styles  
✅ **Idea Generation** - Creative topic suggestions  
✅ **Comment Management** - Intelligent reply generation  
✅ **Content Analysis** - Quick summary extraction  

Most endpoints require authentication for security, except the public summary endpoint which enables frontend features like preview generation.
