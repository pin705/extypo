<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Extypo` : 'Extypo - Design System Extractor'
  },
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
  ]
})

useSeoMeta({
  title: 'Extypo - Extract Design Systems Instantly',
  ogTitle: 'Extypo - Extract Design Systems Instantly',
  description: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.',
  ogDescription: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.',
  ogImage: 'https://extypo.vercel.app/og-image.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Extypo - Extract Design Systems Instantly',
  twitterDescription: 'Extract, visualize, and export design systems from any website. Get colors, typography, spacing, and components in seconds.',
})
</script>

<template>
  <NuxtPage />
</template>
