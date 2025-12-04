<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, Palette, Type, MoveHorizontal, Box, Layers, Component } from 'lucide-vue-next'

defineProps<{
  data: any
}>()

const copied = ref<string | null>(null)

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = text
  setTimeout(() => {
    copied.value = null
  }, 2000)
}
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Header Info -->
    <div class="flex items-center gap-6 p-6 bg-card rounded-xl border shadow-sm">
      <div v-if="data.logo?.url" class="h-20 w-20 flex items-center justify-center bg-white p-4 rounded-lg border">
        <img :src="data.logo.url" :alt="data.logo.alt" class="max-h-full max-w-full object-contain" />
      </div>
      <div class="space-y-1">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          {{ data.url }}
          <a :href="data.url" target="_blank" class="text-muted-foreground hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </h2>
        <div class="flex gap-2 text-sm text-muted-foreground">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            Extracted {{ new Date(data.extractedAt).toLocaleDateString() }}
          </span>
          <span>•</span>
          <span>{{ data.colors?.palette?.length || 0 }} Colors</span>
          <span>•</span>
          <span>{{ data.typography?.styles?.length || 0 }} Fonts</span>
        </div>
      </div>
    </div>

    <Tabs default-value="colors" class="w-full">
      <TabsList class="w-full justify-start h-auto p-1 bg-muted/50 rounded-lg mb-6 overflow-x-auto flex-nowrap">
        <TabsTrigger value="colors" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Palette class="w-4 h-4" /> Colors
        </TabsTrigger>
        <TabsTrigger value="typography" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Type class="w-4 h-4" /> Typography
        </TabsTrigger>
        <TabsTrigger value="spacing" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <MoveHorizontal class="w-4 h-4" /> Spacing
        </TabsTrigger>
        <TabsTrigger value="borders" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Box class="w-4 h-4" /> Borders
        </TabsTrigger>
        <TabsTrigger value="shadows" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Layers class="w-4 h-4" /> Shadows
        </TabsTrigger>
        <TabsTrigger value="components" class="flex gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Component class="w-4 h-4" /> Components
        </TabsTrigger>
      </TabsList>

      <TabsContent value="colors" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="(color, index) in data.colors.palette" 
            :key="index" 
            class="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div 
              class="h-32 w-full cursor-pointer transition-transform active:scale-95"
              :style="{ backgroundColor: color.normalized }"
              @click="copyToClipboard(color.normalized)"
            >
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <Button variant="secondary" size="sm" class="shadow-lg">
                  <Copy v-if="copied !== color.normalized" class="w-4 h-4 mr-2" />
                  <Check v-else class="w-4 h-4 mr-2 text-green-600" />
                  {{ copied === color.normalized ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>
            <div class="p-4 space-y-2">
              <div class="flex justify-between items-center">
                <code class="text-sm font-semibold">{{ color.normalized }}</code>
                <Badge variant="outline" class="text-[10px] uppercase">{{ color.confidence }}</Badge>
              </div>
              <div class="text-xs text-muted-foreground">
                <p>RGB: {{ color.color }}</p>
                <p class="mt-1 truncate" v-if="color.sources?.length">
                  Used in: {{ color.sources.slice(0, 2).join(', ') }}
                  <span v-if="color.sources.length > 2">+{{ color.sources.length - 2 }} more</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="typography" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="grid gap-6">
          <Card v-for="(style, index) in data.typography.styles" :key="index" class="overflow-hidden hover:border-primary/50 transition-colors">
            <CardContent class="p-6">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-8 space-y-4">
                  <p 
                    :style="{ 
                      fontFamily: style.family, 
                      fontSize: style.size, 
                      fontWeight: style.weight, 
                      lineHeight: style.lineHeight,
                      letterSpacing: style.spacing,
                      textTransform: style.transform
                    }"
                    class="break-words"
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p 
                    :style="{ 
                      fontFamily: style.family, 
                      fontSize: style.size, 
                      fontWeight: style.weight, 
                      lineHeight: style.lineHeight,
                      letterSpacing: style.spacing,
                      textTransform: style.transform
                    }"
                    class="text-muted-foreground opacity-60 truncate"
                  >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                  </p>
                </div>
                <div class="lg:col-span-4 space-y-3 text-sm border-l pl-6">
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Family</span>
                    <span class="font-medium text-right">{{ style.family }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Size</span>
                    <span class="font-medium">{{ style.size }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Weight</span>
                    <span class="font-medium">{{ style.weight }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-muted-foreground">Line Height</span>
                    <span class="font-medium">{{ style.lineHeight }}</span>
                  </div>
                  <div class="pt-2">
                    <Badge variant="secondary">{{ style.context }}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="spacing" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
            <CardDescription>Consistent spacing values found across the site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div v-for="(space, index) in data.spacing.commonValues" :key="index" class="group flex items-center gap-6">
                <div class="w-24 text-sm font-mono text-right shrink-0">
                  <span class="font-bold">{{ space.px }}</span>
                  <span class="text-muted-foreground ml-2">({{ space.rem }})</span>
                </div>
                <div class="flex-1 bg-muted/50 rounded-md h-8 relative overflow-hidden">
                  <div 
                    class="bg-primary/80 h-full rounded-md transition-all group-hover:bg-primary" 
                    :style="{ width: space.px }"
                  ></div>
                </div>
                <div class="w-24 text-xs text-muted-foreground shrink-0 text-right">
                  {{ space.count }} uses
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="borders" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
              <CardDescription>Corner rounding values.</CardDescription>
            </CardHeader>
            <CardContent class="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div v-for="(radius, index) in data.borderRadius.values" :key="index" class="flex flex-col items-center gap-3 group">
                <div 
                  class="w-20 h-20 border-2 border-primary/20 bg-muted/30 group-hover:border-primary group-hover:bg-muted transition-all" 
                  :style="{ borderRadius: radius.value }"
                ></div>
                <code class="text-xs bg-muted px-2 py-1 rounded">{{ radius.value }}</code>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Border Widths</CardTitle>
              <CardDescription>Stroke thickness values.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div v-for="(width, index) in data.borders.widths" :key="index" class="space-y-2">
                <div 
                  class="w-full border-primary bg-transparent h-12 flex items-center justify-center bg-muted/10" 
                  :style="{ borderWidth: width.value, borderStyle: 'solid' }"
                >
                  <span class="text-[10px] text-muted-foreground">Content</span>
                </div>
                <p class="text-xs font-mono text-center text-muted-foreground">{{ width.value }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="shadows" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="(shadow, index) in data.shadows" :key="index" class="group space-y-3">
            <div 
              class="h-32 bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 group-hover:-translate-y-1" 
              :style="{ boxShadow: shadow.shadow }"
            ></div>
            <div class="relative">
              <pre class="text-[10px] text-muted-foreground bg-muted p-3 rounded-lg overflow-x-auto font-mono border">{{ shadow.shadow }}</pre>
              <Button 
                variant="ghost" 
                size="icon" 
                class="absolute top-1 right-1 h-6 w-6"
                @click="copyToClipboard(shadow.shadow)"
              >
                <Copy class="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="components" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="grid gap-8">
          <Card v-if="data.components.buttons?.length">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Extracted button styles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-6 items-center">
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
                  class="transition-transform hover:scale-105 active:scale-95"
                >
                  Button {{ index + 1 }}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card v-if="data.components.inputs?.length">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Extracted input field styles.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div v-for="(input, index) in data.components.inputs" :key="index" class="max-w-md">
                <label class="text-sm text-muted-foreground mb-2 block">Input Style {{ index + 1 }}</label>
                <input 
                  type="text" 
                  placeholder="Type something..."
                  :style="{
                    border: input.border,
                    borderRadius: input.borderRadius,
                    padding: input.padding,
                    backgroundColor: input.backgroundColor
                  }"
                  class="w-full transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
