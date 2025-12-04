<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{
  data: any
}>()

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // Could add a toast notification here
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-4 mb-6">
      <img v-if="data.logo?.url" :src="data.logo.url" :alt="data.logo.alt" class="h-12 object-contain bg-gray-100 p-2 rounded" />
      <div>
        <h2 class="text-2xl font-bold">{{ data.url }}</h2>
        <p class="text-muted-foreground text-sm">Extracted at {{ new Date(data.extractedAt).toLocaleString() }}</p>
      </div>
    </div>

    <Tabs default-value="colors" class="w-full">
      <TabsList class="grid w-full grid-cols-6">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="typography">Typography</TabsTrigger>
        <TabsTrigger value="spacing">Spacing</TabsTrigger>
        <TabsTrigger value="borders">Borders</TabsTrigger>
        <TabsTrigger value="shadows">Shadows</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
      </TabsList>

      <TabsContent value="colors" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Dominant colors extracted from the website.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div v-for="(color, index) in data.colors.palette" :key="index" class="space-y-2">
                <div 
                  class="h-24 w-full rounded-md border shadow-sm cursor-pointer transition-transform hover:scale-105"
                  :style="{ backgroundColor: color.normalized }"
                  @click="copyToClipboard(color.normalized)"
                ></div>
                <div class="text-xs space-y-1">
                  <p class="font-mono font-medium">{{ color.normalized }}</p>
                  <p class="text-muted-foreground">{{ color.color }}</p>
                  <Badge variant="secondary" class="text-[10px]">{{ color.confidence }}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="typography" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Font styles and hierarchies.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-8">
            <div v-for="(style, index) in data.typography.styles" :key="index" class="border-b pb-4 last:border-0">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div class="col-span-2">
                  <p 
                    :style="{ 
                      fontFamily: style.family, 
                      fontSize: style.size, 
                      fontWeight: style.weight, 
                      lineHeight: style.lineHeight,
                      letterSpacing: style.spacing,
                      textTransform: style.transform
                    }"
                    class="truncate"
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                <div class="text-xs text-muted-foreground space-y-1 font-mono">
                  <p>Family: {{ style.family }}</p>
                  <p>Size: {{ style.size }}</p>
                  <p>Weight: {{ style.weight }}</p>
                  <p>Line Height: {{ style.lineHeight }}</p>
                  <Badge variant="outline" class="mt-1">{{ style.context }}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="spacing" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
            <CardDescription>Common spacing values used.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="(space, index) in data.spacing.commonValues" :key="index" class="flex items-center gap-4">
                <div class="w-16 text-sm font-mono text-right">{{ space.px }}</div>
                <div class="flex-1 bg-muted rounded-sm h-6 relative">
                  <div class="bg-primary h-full rounded-sm" :style="{ width: space.px }"></div>
                </div>
                <div class="w-16 text-xs text-muted-foreground">{{ space.rem }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="borders" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
            </CardHeader>
            <CardContent class="grid grid-cols-2 gap-4">
              <div v-for="(radius, index) in data.borderRadius.values" :key="index" class="flex flex-col items-center gap-2">
                <div class="w-16 h-16 border-2 border-primary bg-muted" :style="{ borderRadius: radius.value }"></div>
                <span class="text-xs font-mono">{{ radius.value }}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Border Widths</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-for="(width, index) in data.borders.widths" :key="index" class="space-y-1">
                <div class="w-full border-primary bg-muted h-8" :style="{ borderWidth: width.value, borderStyle: 'solid' }"></div>
                <p class="text-xs font-mono text-center">{{ width.value }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="shadows" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Shadows</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="(shadow, index) in data.shadows" :key="index" class="space-y-2">
              <div class="h-24 bg-white rounded-md border" :style="{ boxShadow: shadow.shadow }"></div>
              <p class="text-xs font-mono text-muted-foreground break-all">{{ shadow.shadow }}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="components" class="space-y-4">
        <Card v-if="data.components.buttons">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-wrap gap-4">
            <button 
              v-for="(btn, index) in data.components.buttons" 
              :key="index"
              :style="{
                backgroundColor: btn.backgroundColor,
                color: btn.color,
                padding: btn.padding,
                borderRadius: btn.borderRadius,
                border: btn.border,
                fontWeight: btn.fontWeight,
                fontSize: btn.fontSize
              }"
            >
              Button Sample
            </button>
          </CardContent>
        </Card>

        <Card v-if="data.components.inputs">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(input, index) in data.components.inputs" :key="index">
              <input 
                type="text" 
                placeholder="Input Sample"
                :style="{
                  border: input.border,
                  borderRadius: input.borderRadius,
                  padding: input.padding,
                  backgroundColor: input.backgroundColor
                }"
                class="w-full max-w-xs"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
