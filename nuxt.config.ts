// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Extypo - Design System Extractor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.' },
        { name: 'keywords', content: 'design system, extractor, colors, typography, CSS, web design, style guide, brand extraction, UI components' },
        { name: 'author', content: 'Extypo' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#3B82F6' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Extypo' },
        { property: 'og:title', content: 'Extypo - Extract Design Systems Instantly' },
        { property: 'og:description', content: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.' },
        { property: 'og:image', content: 'https://extypo.vercel.app/og-image.png' },
        { property: 'og:url', content: 'https://extypo.vercel.app' },
        { property: 'og:locale', content: 'en_US' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Extypo - Extract Design Systems Instantly' },
        { name: 'twitter:description', content: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.' },
        { name: 'twitter:image', content: 'https://extypo.vercel.app/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://extypo.vercel.app' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'Extypo',
            'description': 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.',
            'url': 'https://extypo.vercel.app',
            'applicationCategory': 'DesignApplication',
            'operatingSystem': 'All',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'author': {
              '@type': 'Organization',
              'name': 'Extypo'
            }
          })
        }
      ]
    }
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },

  nitro: {
    preset: 'vercel',
    // Externalize packages that don't work well in serverless
    externals: {
      external: ['playwright-core', '@sparticuz/chromium']
    },
    // Configure the extract endpoint with longer timeout
    routeRules: {
      '/api/extract': {
        // Increase timeout for Playwright operations
        headers: {
          'Vercel-CDN-Cache-Control': 'max-age=86400',
          'CDN-Cache-Control': 'max-age=86400',
          'Cache-Control': 'max-age=86400'
        }
      }
    }
  },

  // Vercel configuration
  $production: {
    nitro: {
      preset: 'vercel'
    }
  }
})