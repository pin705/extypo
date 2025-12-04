import { extractBranding } from 'dembrandt/lib/extractors.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required',
    })
  }

  const spinner = { text: '' }
  try {
    const result = await extractBranding(url, spinner)
    return result
  } catch (error) {
    console.error('Extraction error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to extract design system',
    })
  }
})
