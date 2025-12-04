<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, AlertTriangle, Download, ExternalLink } from 'lucide-vue-next'

const props = defineProps<{
  data: any
}>()

// --- A11y Logic ---

function getLuminance(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return r * 0.2126 + g * 0.7152 + b * 0.0722
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

function getContrastRatio(hex1: string, hex2: string) {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

const a11yAudit = computed(() => {
  if (!props.data.colors?.palette) return []

  return props.data.colors.palette.map((color: any) => {
    const onWhite = getContrastRatio(color.normalized, '#FFFFFF')
    const onBlack = getContrastRatio(color.normalized, '#000000')
    
    return {
      color: color.normalized,
      onWhite: {
        ratio: onWhite.toFixed(2),
        passAA: onWhite >= 4.5,
        passAAA: onWhite >= 7,
        score: onWhite >= 7 ? 'AAA' : (onWhite >= 4.5 ? 'AA' : 'Fail')
      },
      onBlack: {
        ratio: onBlack.toFixed(2),
        passAA: onBlack >= 4.5,
        passAAA: onBlack >= 7,
        score: onBlack >= 7 ? 'AAA' : (onBlack >= 4.5 ? 'AA' : 'Fail')
      }
    }
  })
})

// --- Tech Stack Logic ---
const frameworks = computed(() => props.data.frameworks || [])

// --- Assets Logic ---
const assets = computed(() => {
  const list = []
  if (props.data.logo) list.push({ type: 'Logo', ...props.data.logo })
  // Add more if available in data.assets
  return list
})

const downloadAsset = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    console.error('Download failed', e)
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Tech Stack -->
    <Card>
      <CardHeader>
        <CardTitle>Tech Stack Detection</CardTitle>
        <CardDescription>Technologies and frameworks detected on this website.</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="frameworks.length" class="flex flex-wrap gap-2">
          <Badge v-for="tech in frameworks" :key="tech.name" variant="secondary" class="text-sm py-1 px-3">
            {{ tech.name }} {{ tech.version ? `v${tech.version}` : '' }}
          </Badge>
        </div>
        <div v-else class="text-muted-foreground text-sm">
          No specific frameworks detected.
        </div>
      </CardContent>
    </Card>

    <!-- Accessibility Audit -->
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Audit (Contrast)</CardTitle>
        <CardDescription>WCAG 2.1 contrast checks for brand colors against white and black text.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in a11yAudit" :key="item.color" class="border rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full border shadow-sm" :style="{ backgroundColor: item.color }"></div>
              <code class="text-sm font-bold">{{ item.color }}</code>
            </div>
            
            <!-- On White -->
            <div class="flex items-center justify-between text-sm p-2 rounded bg-white border">
              <span class="text-black font-medium">Text on White</span>
              <div class="flex items-center gap-2">
                <span class="font-mono">{{ item.onWhite.ratio }}</span>
                <Badge :variant="item.onWhite.passAA ? 'default' : 'destructive'" class="text-[10px]">
                  {{ item.onWhite.score }}
                </Badge>
              </div>
            </div>

            <!-- On Black -->
            <div class="flex items-center justify-between text-sm p-2 rounded bg-black border">
              <span class="text-white font-medium">Text on Black</span>
              <div class="flex items-center gap-2">
                <span class="font-mono text-white">{{ item.onBlack.ratio }}</span>
                <Badge :variant="item.onBlack.passAA ? 'default' : 'destructive'" class="text-[10px]">
                  {{ item.onBlack.score }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Assets -->
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>Downloadable assets extracted from the site.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="(asset, index) in assets" :key="index" class="border rounded-lg p-4 flex flex-col items-center gap-4">
            <div class="h-24 w-full flex items-center justify-center bg-muted/20 rounded-md p-2">
              <img :src="asset.url" :alt="asset.alt || 'Asset'" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="w-full text-center">
              <p class="font-medium text-sm mb-1">{{ asset.type }}</p>
              <Button size="sm" variant="outline" class="w-full" @click="downloadAsset(asset.url, `asset-${index}.png`)">
                <Download class="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>
        <div v-if="assets.length === 0" class="text-muted-foreground text-sm">
          No downloadable assets found.
        </div>
      </CardContent>
    </Card>
  </div>
</template>
