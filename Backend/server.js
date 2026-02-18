const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY,
  baseURL: 'https://api.a4f.co/v1',
})

app.post('/answer', async (req, res) => {
  try {
    const { question } = req.body

    const completion = await client.chat.completions.create({
      model: 'provider-2/gemma-3-27b-it',
      messages: [
        {
          role: 'system',
          content:
            'You are an answer-only assistant. Respond with only the final answer. Do not explain. Do not add context. Do not add extra text.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    })

    res.json({
      answer: completion.choices[0].message.content.trim(),
    })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
