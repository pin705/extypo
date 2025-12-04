<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DesignSystemPreview from '@/components/DesignSystemPreview.vue'
import { Loader2, Download, Search, Sparkles } from 'lucide-vue-next'

const url = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)

const isValidUrl = (string: string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const extract = async () => {
  if (!url.value) return

  if (!isValidUrl(url.value)) {
    error.value = 'Please enter a valid URL (e.g., https://example.com)'
    return
  }
  
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

const downloadJson = () => {
  if (!result.value) return
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.value, null, 2))
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute("href", dataStr)
  downloadAnchorNode.setAttribute("download", `design-system-${new Date().toISOString()}.json`)
  document.body.appendChild(downloadAnchorNode)
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <div class="container mx-auto py-20 px-4">
      <div class="max-w-5xl mx-auto space-y-12">
        
        <!-- Hero Section -->
        <div class="text-center space-y-6">
          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <Sparkles class="w-3 h-3 mr-1" />
            AI-Powered Design Extraction
          </div>
          <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent pb-2">
            Design System Extractor
          </h1>
          <p class="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Instantly extract design tokens, colors, typography, and assets from any website. 
            Turn any URL into a comprehensive style guide.
          </p>
        </div>

        <!-- Input Section -->
        <Card class="border-2 shadow-lg">
          <CardHeader>
            <CardTitle class="text-xl">Analyze Website</CardTitle>
            <CardDescription>
              Enter the URL of the website you want to analyze. We'll handle the rest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <Search class="absolute left-3 top-3 h-6 w-4 text-muted-foreground" />
                <Input 
                  v-model="url" 
                  placeholder="https://example.com" 
                  class="pl-9 h-12 text-lg"
                  @keydown.enter="extract"
                />
              </div>
              <Button @click="extract" :disabled="loading" size="lg" class="h-12 px-8 text-base">
                <Loader2 v-if="loading" class="mr-2 h-5 w-5 animate-spin" />
                <span v-else>Extract Design System</span>
              </Button>
            </div>
            <p v-if="error" class="text-destructive mt-4 text-sm font-medium flex items-center">
              <span class="mr-2">⚠️</span> {{ error }}
            </p>
          </CardContent>
        </Card>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton class="h-32 rounded-xl" />
            <Skeleton class="h-32 rounded-xl" />
            <Skeleton class="h-32 rounded-xl" />
          </div>
          <Skeleton class="h-[500px] rounded-xl" />
        </div>

        <!-- Results Section -->
        <div v-if="result" class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div class="flex justify-between items-center border-b pb-6">
            <div class="space-y-1">
              <h2 class="text-3xl font-bold tracking-tight">Extraction Results</h2>
              <p class="text-muted-foreground">
                Found {{ result.colors?.palette?.length || 0 }} colors, 
                {{ result.typography?.styles?.length || 0 }} font styles
              </p>
            </div>
            <Button variant="outline" @click="downloadJson">
              <Download class="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>

          <DesignSystemPreview :data="result" />
        </div>
      </div>
    </div>
  </div>
</template>

