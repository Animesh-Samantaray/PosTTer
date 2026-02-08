const { GoogleGenAI } = require('@google/genai');

const {
    blogPostIdeasPrompt, generateReplyPrompt, blogSummaryPrompt
} = require('../utils/prompts');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// generate blog content
// post  /api/ai/generate
// access private
const generateBlogPost = async (req, res) => {
    try {
        const { title, tone } = req.body;

        if (!title || !tone) {
            return res.status(400).json({ message: 'title and tone are required' });
        }

        const prompt = `
Write a short blog post titled "${title}" in Markdown format using a "${tone}" tone.

Use:
- # for main headings, ## for subheadings
- Bullet points for lists
- Code blocks for examples if needed
- Short paragraphs

Include:
- A quick introduction
- 1-3 main sections
- Simple examples if needed
- A brief conclusion

Keep it clear, simple, and easy to read. Return the full post in Markdown.
`;


        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const blogText = response.text;

        res.status(200).json({ content: blogText });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};







// generate blog post ideas from title
// post  /api/ai/generate-ideas
// access private
const generateBlogPostIdeas = async (req, res) => {
    try {
        const { topics } = req.body;

        if (!topics) {
            return res.status(400).json({ message: 'Topics are required' });
        }
        const prompt = blogPostIdeasPrompt(topics);


        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        let rawText = response.text;


        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

        const data=JSON.parse(cleanedText);
        res.status(200).json(data)

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            message: error.message
        })
    }
}


// generate comment reply 
// post  /api/ai/generate-reply
// access private
const generateCommentReply = async (req, res) => {
    try {
        const {author , content} = req.body;

        if(!content){
            return res.status(400).json({message:'All fields are required'})
        };

        const prompt = generateReplyPrompt({author , content});

            const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        let rawText = response.text;
        res.status(200).json(rawText)

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            message: 'Internal server error'
        })
    }
}


// generate blog post summary
// post  /api/ai/generate-summary
// access public
const generatePostSummary = async (req, res) => {
    try {
        const  { content} = req.body;
        if(!content){
            return res.status(400).json({
                message:'Contents are required'
            })
        }

        const prompt = blogSummaryPrompt(content);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        let rawText = response.text;


        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

        const data=JSON.parse(cleanedText);
        res.status(200).json(data)

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            message: 'Internal server error'
        })
    }
}

module.exports = { generateBlogPost, generateBlogPostIdeas, generateCommentReply, generatePostSummary };
