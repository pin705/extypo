<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DesignSystemPreview from '@/components/DesignSystemPreview.vue'

const url = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)

const extract = async () => {
  if (!url.value) return
  
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const data = await $fetch('/api/extract', {
      method: 'POST',
      body: { url: url.value }
    })
    result.value = data
  } catch (e: any) {
    error.value = e.message || 'Failed to extract design system'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold tracking-tight">Design System Extractor</h1>
        <p class="text-muted-foreground text-lg">
          Extract design tokens and assets from any website instantly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Website URL</CardTitle>
          <CardDescription>
            We'll analyze the site and extract colors, typography, spacing, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4">
            <Input 
              v-model="url" 
              placeholder="https://example.com" 
              class="flex-1"
              @keydown.enter="extract"
            />
            <Button @click="extract" :disabled="loading">
              <span v-if="loading">Extracting...</span>
              <span v-else>Extract</span>
            </Button>
          </div>
          <p v-if="error" class="text-destructive mt-2 text-sm">{{ error }}</p>
        </CardContent>
      </Card>

      <div v-if="result" class="space-y-8">
        <DesignSystemPreview :data="result" />
      </div>
    </div>
  </div>
</template>
