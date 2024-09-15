const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

// CORS configuration
app.use(cors({
    origin: ['https://main.dhneriygykmo0.amplifyapp.com', 'http://localhost:3000'], // frontend URLs
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.post('/get-powerlifting-plan', async (req, res) => {
    const { liftType, weight } = req.body;
    console.log('Received request:', { liftType, weight });

    if (!liftType || !weight || isNaN(weight) || weight <= 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a valid lift type and weight.' });
    }

    try {
        const prompt = `
        Create a structured weekly powerlifting plan to help someone achieve a one-rep max of ${weight} pounds for ${liftType}. Format the response as follows:
        
        **Introduction:**
        Provide a brief introduction about the plan.
        
        **Monday:**:
        [Exercise details bulleted]

        **Tuesday:**:
        [Exercise details bulleted]

        **Wednesday:**:
        [Exercise details bulleted]

        **Thursday:**:
        [Exercise details bulleted]

        **Friday:**:
        [Exercise details bulleted]

        **Saturday:**:
        [Exercise details bulleted]

        **Sunday:**:
        [Exercise details bulleted]
        
        **Conclusion:**
        Provide a brief conclusion about the plan.
        Include some helpful websites for form
        Ensure the response is well-organized with clear headings and bullet points for each day.`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });
        
        const powerliftingPlan = completion.choices[0].message.content.trim();

        console.log('Generated plan:', powerliftingPlan);
        res.json({ plan: powerliftingPlan });
    } catch (error) {
        console.error('Error generating powerlifting plan:', error);
        let errorMessage = 'Failed to generate powerlifting plan.';
        if (error.response) {
            errorMessage += ` Status: ${error.response.status}. ${error.response.data.error.message}`;
        } else {
            errorMessage += ` ${error.message}`;
        }
        res.status(500).json({ error: errorMessage });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});