import React, { useState } from 'react'
import axios from 'axios'

import './index.css'
const App = () => {

   const [answer, setAnswer] = useState('');
function cleanQuestion(text) {
  if (!text || typeof text !== 'string') return ''

  // Remove common system/instruction prompts (best-effort)
  let out = text.replace(/You are a [\s\S]*?(?:Do you understand\?|Please confirm\.?|Please respond\.?)(?:\s*)/gi, '')
  out = out.replace(/You are ChatGPT[\s\S]*?(?:Do you understand\?)?(?:\s*)/gi, '')
  out = out.replace(/Assistant is a large language model[\s\S]*?(?:Do you understand\?)?(?:\s*)/gi, '')

  // Remove code fences and surrounding backticks
  out = out.replace(/```/g, '')

  // Remove leading Q:/Question: or trailing A:/Answer: labels
  out = out.replace(/^\s*(?:Q:|Question:|Question-)\s*/i, '')
  out = out.replace(/\s*(?:A:|Answer:|Answer-)\s*$/i, '')

  // Normalize lines: trim each line and join with single spaces to form a clean single-line question
  out = out
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(' ')

  // Collapse multiple spaces and trim
  out = out.replace(/\s{2,}/g, ' ').trim()

  return out
}

async function handleSubmit(e) {
  e.preventDefault()

  const form = e.target
  const rawQuestion = form.question.value
 
  
  const cleanedQuestion = cleanQuestion(rawQuestion)
 console.log(cleanedQuestion);
 
  
  const response = await axios.post(import.meta.env.VITE_BACKEND_API, {
    question: cleanedQuestion,
  })

  setAnswer(response.data.answer)
  form.reset()
  }

  return (
    <div>
  <section className="w-full h-screen flex flex-col items-center justify-center p-4
  bg-gradient-to-r from-slate-900 to-slate-700">

    <div><h1 className='text-white custom-font text-5xl lg:text-8xl'>Answerly</h1></div>
   <div
  className="
    w-full lg:w-[700px] lg:h-[400px]
    rounded-3xl p-6
    bg-white/20
    backdrop-blur-xl
    border border-white/30
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
  "
>

    <form
  onSubmit={handleSubmit}
  className="flex justify-around flex-col gap-5 h-full"
>

        <div>
          <label htmlFor="questionInput" className='block mb-2 text-white'>Enter Your Question</label>
   <textarea
  id="questionInput"
  className="
    w-full h-[200px]
    rounded-2xl
    bg-white/20
    backdrop-blur-lg
    border border-white/30
    p-4
    text-white placeholder-white/60
    resize-none
    focus:outline-none
    focus:ring-2 focus:ring-white/40
  "
  placeholder="Ask anything..."
  name='question'
></textarea>


        </div>
      <button
  type="submit"
  className="
    rounded-2xl px-6 py-3 text-white font-semibold
    bg-white/20
    backdrop-blur-lg
    border border-white/30
    shadow-lg
    hover:bg-white/30
    hover:shadow-xl
    transition-all duration-300
  "
>
  GET ANSWER
</button>

      </form>
      </div>
      <div className="w-full lg:w-[700px] lg:h-[400px] rounded-3xl p-6 bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mt-6">
        <label htmlFor="answerInput" className='text-white mb-3'>Answer</label>
        <textarea name="answer" id="answerInput" value={answer} className="w-full h-[200px] mt-4 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 p-4 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-white/40"></textarea>
      </div>
   </section>
    </div>
  )
}

export default App