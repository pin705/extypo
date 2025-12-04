<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check, FileCode, FileJson, Figma } from 'lucide-vue-next'

const props = defineProps<{
  data: any
}>()

const copied = ref<string | null>(null)

const copyToClipboard = (text: string, id: string) => {
  navigator.clipboard.writeText(text)
  copied.value = id
  setTimeout(() => {
    copied.value = null
  }, 2000)
}

const tailwindConfig = computed(() => {
  const colors = Array.isArray(props.data.colors?.palette) 
    ? props.data.colors.palette.reduce((acc: any, color: any, index: number) => {
        acc[`brand-${index + 1}`] = color.normalized
        return acc
      }, {})
    : {}

  const fontFamily = Array.isArray(props.data.typography?.styles)
    ? props.data.typography.styles.reduce((acc: any, style: any) => {
        if (!style.fontFamily) return acc
        const name = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
        if (!acc[name]) acc[name] = []
        acc[name].push(style.fontFamily)
        return acc
      }, {})
    : {}

  const spacing = Array.isArray(props.data.spacing)
    ? props.data.spacing.reduce((acc: any, space: any, index: number) => {
        acc[`${index + 1}`] = space
        return acc
      }, {})
    : {}

  const config = {
    theme: {
      extend: {
        colors,
        fontFamily,
        spacing
      }
    }
  }

  return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)}`
})

const cssVariables = computed(() => {
  let css = ':root {\n'
  
  // Colors
  if (Array.isArray(props.data.colors?.palette)) {
    props.data.colors.palette.forEach((color: any, index: number) => {
      css += `  --color-brand-${index + 1}: ${color.normalized};\n`
    })
  }

  // Spacing
  if (Array.isArray(props.data.spacing)) {
    props.data.spacing.forEach((space: any, index: number) => {
      css += `  --spacing-${index + 1}: ${space};\n`
    })
  }

  // Fonts
  if (Array.isArray(props.data.typography?.styles)) {
    const fonts = new Set(props.data.typography.styles.map((s: any) => s.fontFamily).filter(Boolean))
    Array.from(fonts).forEach((font: any, index: number) => {
      css += `  --font-family-${index + 1}: ${font};\n`
    })
  }

  css += '}'
  return css
})

const figmaTokens = computed(() => {
  const tokens = {
    colors: Array.isArray(props.data.colors?.palette)
      ? props.data.colors.palette.reduce((acc: any, color: any, index: number) => {
          acc[`brand-${index + 1}`] = { value: color.normalized, type: 'color' }
          return acc
        }, {})
      : {},
    spacing: Array.isArray(props.data.spacing)
      ? props.data.spacing.reduce((acc: any, space: any, index: number) => {
          acc[`spacing-${index + 1}`] = { value: space, type: 'spacing' }
          return acc
        }, {})
      : {},
    typography: Array.isArray(props.data.typography?.styles)
      ? props.data.typography.styles.reduce((acc: any, style: any, index: number) => {
          acc[`text-${index + 1}`] = {
            fontFamily: { value: style.fontFamily },
            fontSize: { value: style.fontSize },
            fontWeight: { value: style.fontWeight },
            type: 'typography'
          }
          return acc
        }, {})
      : {}
  }
  return JSON.stringify(tokens, null, 2)
})
</script>

<template>
  <div class="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Export Design System</CardTitle>
        <CardDescription>Generate code and tokens for your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs default-value="tailwind" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="tailwind">Tailwind CSS</TabsTrigger>
            <TabsTrigger value="css">CSS Variables</TabsTrigger>
            <TabsTrigger value="figma">Figma Tokens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tailwind" class="space-y-4 mt-4">
            <div class="relative">
              <pre class="p-4 rounded-lg bg-muted overflow-x-auto text-sm"><code>{{ tailwindConfig }}</code></pre>
              <Button 
                size="sm" 
                variant="secondary" 
                class="absolute top-2 right-2"
                @click="copyToClipboard(tailwindConfig, 'tailwind')"
              >
                <Check v-if="copied === 'tailwind'" class="w-4 h-4 mr-2" />
                <Copy v-else class="w-4 h-4 mr-2" />
                {{ copied === 'tailwind' ? 'Copied' : 'Copy' }}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="css" class="space-y-4 mt-4">
            <div class="relative">
              <pre class="p-4 rounded-lg bg-muted overflow-x-auto text-sm"><code>{{ cssVariables }}</code></pre>
              <Button 
                size="sm" 
                variant="secondary" 
                class="absolute top-2 right-2"
                @click="copyToClipboard(cssVariables, 'css')"
              >
                <Check v-if="copied === 'css'" class="w-4 h-4 mr-2" />
                <Copy v-else class="w-4 h-4 mr-2" />
                {{ copied === 'css' ? 'Copied' : 'Copy' }}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="figma" class="space-y-4 mt-4">
            <div class="relative">
              <pre class="p-4 rounded-lg bg-muted overflow-x-auto text-sm"><code>{{ figmaTokens }}</code></pre>
              <Button 
                size="sm" 
                variant="secondary" 
                class="absolute top-2 right-2"
                @click="copyToClipboard(figmaTokens, 'figma')"
              >
                <Check v-if="copied === 'figma'" class="w-4 h-4 mr-2" />
                <Copy v-else class="w-4 h-4 mr-2" />
                {{ copied === 'figma' ? 'Copied' : 'Copy' }}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>
