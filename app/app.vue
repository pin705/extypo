<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Extypo` : 'Extypo - Design System Extractor'
  }
})
</script>

<template>
  <NuxtPage />
</template>
