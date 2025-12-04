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

  try {
    new URL(url)
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL provided',
    })
  }

  const spinner = {
    text: '',
    start: () => spinner,
    stop: () => spinner,
    succeed: () => spinner,
    fail: () => spinner,
    warn: () => spinner,
    info: () => spinner,
    stopAndPersist: () => spinner,
    clear: () => spinner,
    render: () => spinner,
    frame: () => spinner,
  }
  try {
    const result = await extractBranding(url, spinner)

    return result
  } catch (error: any) {
    console.error('Extraction error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to extract design system',
    })
  }
})

