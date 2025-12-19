# Extypo Chrome Extension

Chrome Extension version of Extypo - Design System Extractor. Instantly extract design tokens, colors, typography, and assets from any website directly from your browser.

🌐 **Web App**: [extypo.vercel.app](https://extypo.vercel.app)

## Features

- 🎨 **Instant Extraction**: One-click to extract design system from current page
- 👁️ **Visual Preview**: See colors, typography, and components in a clean popup
- 📋 **Copy to Clipboard**: Quickly copy extracted data as JSON
- 📤 **Export**: Download full design system as JSON file
- 🔗 **Open Full View**: Deep link to web app for advanced analysis

## Installation

### From Source (Development)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd extypo/extension
   ```

2. Generate icons (optional, if you have ImageMagick):
   ```bash
   # Generate PNG icons from SVG
   convert icons/icon.svg -resize 16x16 icons/icon16.png
   convert icons/icon.svg -resize 48x48 icons/icon48.png
   convert icons/icon.svg -resize 128x128 icons/icon128.png
   ```

   Or manually create 16x16, 48x48, and 128x128 PNG icons.

3. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder

### From Chrome Web Store

*Coming soon*

## Usage

1. Navigate to any website you want to analyze
2. Click the Extypo extension icon in your toolbar
3. Click "Extract Design System"
4. View extracted colors, typography, and components
5. Copy JSON or download the full design system

## Extracted Data

The extension extracts:

- **Colors**
  - Primary/brand colors
  - All detected colors (background, text, border)
  
- **Typography**
  - Font families
  - Font sizes
  - Line heights

- **Components**
  - Button styles
  - Input styles

- **Other**
  - Border radius values
  - Box shadows
  - Spacing values

## Permissions

- `activeTab`: Required to access the current tab for extraction
- `scripting`: Required to inject extraction script into pages
- `storage`: Required to cache extracted data

## Development

### Structure

```
extension/
├── manifest.json          # Extension manifest (MV3)
├── popup/
│   ├── popup.html        # Popup UI
│   ├── popup.css         # Popup styles
│   └── popup.js          # Popup logic
├── content/
│   ├── content.js        # Content script (injected into pages)
│   └── content.css       # Content script styles
├── background/
│   └── service-worker.js # Background service worker
└── icons/
    ├── icon.svg          # Source icon
    ├── icon16.png        # 16x16 icon
    ├── icon48.png        # 48x48 icon
    └── icon128.png       # 128x128 icon
```

### Building

No build step required - this is a vanilla JS extension.

## License

MIT License - Same as main Extypo project
