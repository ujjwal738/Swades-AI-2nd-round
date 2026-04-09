import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function maybeGenerateText(input: {
  system: string
  prompt: string
  fallback: string
}) {
  if (!process.env.OPENAI_API_KEY) return input.fallback

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: input.system,
    prompt: input.prompt,
  })

  const cleaned = text.trim()
  return cleaned.length > 0 ? cleaned : input.fallback
}

