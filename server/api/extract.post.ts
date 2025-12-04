import { extractBranding } from 'dembrandt/lib/extractors.js'

export default defineCachedEventHandler(async (event) => {
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

  let browser = null
  // Configure browser for Vercel/Serverless environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    try {
      console.log('Launching serverless browser...')
      const { chromium } = await import('playwright-core')
      const sparticuzChromium = await import('@sparticuz/chromium')
      const chromiumPack = sparticuzChromium.default || sparticuzChromium

      browser = await chromium.launch({
        args: chromiumPack.args,
        executablePath: await chromiumPack.executablePath(),
        headless: true,
      })
      console.log('Serverless browser launched successfully')
    } catch (e) {
      console.error('Failed to launch serverless browser:', e)
    }
  }

  try {
    const result = await extractBranding(url, spinner, browser)
    return result
  } catch (error: any) {
    console.error('Extraction error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to extract design system',
    })
  }
}, {
  maxAge: 60 * 60 * 24, // 1 day
  name: 'extract',
  getKey: async (event) => {
    const body = await readBody(event)
    return `extract:${body.url}`
  },
  shouldBypassCache: async (event) => {
    const body = await readBody(event)
    return body.force
  }
})

