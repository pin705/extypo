# Design System Extractor

This is a Nuxt 4 application that extracts design systems from websites using [dembrandt](https://github.com/thevangelist/dembrandt) and displays them using [shadcn-vue](https://shadcn-vue.com/).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install chromium
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser (usually http://localhost:3000).
2. Enter a website URL (e.g., `https://stripe.com`).
3. Click "Extract".
4. View the extracted colors, typography, spacing, and components.

## Tech Stack

- **Framework:** Nuxt 4
- **UI Library:** shadcn-vue (Radix Vue + Tailwind CSS)
- **Extraction:** dembrandt (Playwright)
- **Styling:** Tailwind CSS
