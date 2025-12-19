<template>
  <div class="min-h-screen bg-background">
    <div class="container max-w-3xl mx-auto px-4 py-16">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Home
      </NuxtLink>

      <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div class="prose prose-invert max-w-none space-y-6 text-muted-foreground">
        <p class="text-lg">
          Last updated: December 19, 2024
        </p>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Overview</h2>
          <p>
            Extypo ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome extension and web application handle your data.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Data We Collect</h2>
          <p><strong class="text-foreground">We do not collect any personal data.</strong></p>
          <p>Extypo operates entirely client-side and does not:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Collect personal information</li>
            <li>Track your browsing history</li>
            <li>Store data on external servers</li>
            <li>Share any data with third parties</li>
            <li>Use cookies for tracking</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">How Extypo Works</h2>
          <p>When you use Extypo to extract a design system:</p>
          <ol class="list-decimal pl-6 space-y-2">
            <li>The URL you provide is sent to our API server</li>
            <li>Our server fetches and analyzes the public webpage</li>
            <li>Design tokens (colors, fonts, components) are extracted</li>
            <li>Results are returned to your browser</li>
            <li>Results are cached locally on your device for 24 hours</li>
          </ol>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Local Storage</h2>
          <p>
            The Chrome extension uses <code class="bg-muted px-2 py-1 rounded">chrome.storage.local</code> to cache extracted design system data on your device. This data:
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Never leaves your device</li>
            <li>Is automatically cleared after 24 hours</li>
            <li>Can be manually cleared by removing the extension</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Permissions Used</h2>
          <p>Our Chrome extension requests the following permissions:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong class="text-foreground">activeTab:</strong> To read the URL of the current tab for extraction</li>
            <li><strong class="text-foreground">storage:</strong> To cache results locally for faster loading</li>
            <li><strong class="text-foreground">contextMenus:</strong> To add right-click menu option</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Services</h2>
          <p>
            Extypo does not integrate with any third-party analytics, advertising, or tracking services.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please open an issue on our 
            <a href="https://github.com/pin705/extypo/issues" target="_blank" class="text-primary hover:underline">GitHub repository</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy - Extypo',
  meta: [
    { name: 'description', content: 'Privacy Policy for Extypo Design System Extractor' }
  ]
})
</script>
