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
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION
  
  if (isServerless) {
    try {
      console.log('Launching serverless browser...')
      const { chromium } = await import('playwright-core')
      const sparticuzChromium = await import('@sparticuz/chromium')
      const chromiumPack = sparticuzChromium.default || sparticuzChromium

      // Configure chromium for better compatibility
      chromiumPack.setHeadlessMode = true
      chromiumPack.setGraphicsMode = false

      const executablePath = await chromiumPack.executablePath()
      console.log('Chromium executable path:', executablePath)
      
      if (!executablePath) {
        throw new Error('Chromium executable not found')
      }

      browser = await chromium.launch({
        args: [
          ...chromiumPack.args,
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process',
          '--no-zygote',
        ],
        executablePath,
        headless: true,
      })
      console.log('Serverless browser launched successfully')
    } catch (e: any) {
      console.error('Failed to launch serverless browser:', e.message)
      // Don't throw here, let dembrandt try with its own browser
      browser = null
    }
  }

  try {
    const result = await extractBranding(url, spinner, browser)
    
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close()
      } catch (e) {
        console.error('Error closing browser:', e)
      }
    }
    
    return result
  } catch (error: any) {
    console.error('Extraction error:', error.message || error)
    
    // Ensure browser is closed on error
    if (browser) {
      try {
        await browser.close()
      } catch (e) {
        console.error('Error closing browser:', e)
      }
    }
    
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

