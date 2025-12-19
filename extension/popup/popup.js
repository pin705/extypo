// State
let extractedData = null;
let currentTab = 'colors';
let currentTabInfo = null;
let isFromCache = false;

// Web App URL
const WEB_APP_URL = 'https://extypo.vercel.app';

// Cache settings
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// DOM Elements
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
  pageTitle: $('pageTitle'),
  pageUrl: $('pageUrl'),
  pageFavicon: $('pageFavicon'),
  status: $('status'),
  extractBtn: $('extractBtn'),
  extractBtnText: $('extractBtnText'),
  loadingState: $('loadingState'),
  resultsSummary: $('resultsSummary'),
  quickPreview: $('quickPreview'),
  actions: $('actions'),
  errorState: $('errorState'),
  errorMessage: $('errorMessage'),
  retryBtn: $('retryBtn'),
  copyBtn: $('copyBtn'),
  downloadBtn: $('downloadBtn'),
  openFullBtn: $('openFullBtn'),
  tabs: $$('.tab'),
  colorPalette: $('colorPalette'),
  fontList: $('fontList'),
  componentList: $('componentList'),
  colorCount: $('colorCount'),
  fontCount: $('fontCount'),
  componentCount: $('componentCount'),
  step1: $('step1'),
  step2: $('step2'),
  step3: $('step3'),
};

// Initialize popup
async function init() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      currentTabInfo = tab;
      elements.pageTitle.textContent = tab.title || 'Untitled Page';
      
      try {
        elements.pageUrl.textContent = new URL(tab.url).hostname;
      } catch {
        elements.pageUrl.textContent = tab.url;
      }
      
      // Set favicon
      if (tab.favIconUrl) {
        elements.pageFavicon.innerHTML = `<img src="${tab.favIconUrl}" alt="">`;
      }

      // Check for cached data
      const cacheKey = `cache:${tab.url}`;
      const cached = await chrome.storage.local.get(cacheKey);
      if (cached[cacheKey]) {
        const { data, timestamp } = cached[cacheKey];
        const age = Date.now() - timestamp;
        
        if (age < CACHE_DURATION) {
          extractedData = data;
          isFromCache = true;
          showResults(age);
        } else {
          // Cache expired, remove it
          await chrome.storage.local.remove(cacheKey);
        }
      }

      // Check if page can be analyzed
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:')) {
        elements.status.textContent = 'Not available';
        elements.status.classList.add('error');
        elements.extractBtn.disabled = true;
        elements.extractBtn.querySelector('.btn-subtitle').textContent = 'Cannot analyze this page';
      }
    }
  } catch (error) {
    console.error('Init error:', error);
    elements.pageTitle.textContent = 'Error loading page info';
  }
}

// Extract design system via API
async function extract(forceRefresh = false) {
  try {
    showLoading();
    isFromCache = false;
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('No active tab found');
    }

    const cacheKey = `cache:${tab.url}`;

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = await chrome.storage.local.get(cacheKey);
      if (cached[cacheKey]) {
        const { data, timestamp } = cached[cacheKey];
        const age = Date.now() - timestamp;
        
        if (age < CACHE_DURATION) {
          extractedData = data;
          isFromCache = true;
          showResults(age);
          return;
        }
      }
    }

    // Update loading steps
    updateLoadingStep(1, 'active');
    
    // Call API to extract design system
    const response = await fetch(`${WEB_APP_URL}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: tab.url, force: forceRefresh }),
    });

    updateLoadingStep(1, 'done');
    updateLoadingStep(2, 'active');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.statusMessage || `API error: ${response.status}`);
    }

    updateLoadingStep(2, 'done');
    updateLoadingStep(3, 'active');

    const data = await response.json();
    
    if (data) {
      extractedData = data;
      
      // Cache the result with timestamp
      await chrome.storage.local.set({ 
        [cacheKey]: {
          data: extractedData,
          timestamp: Date.now()
        }
      });
      
      updateLoadingStep(3, 'done');
      setTimeout(() => showResults(), 300);
    } else {
      throw new Error('No data returned from API');
    }
  } catch (error) {
    console.error('Extract error:', error);
    showError(error.message);
  }
}

// Update loading step UI
function updateLoadingStep(step, state) {
  const stepEl = elements[`step${step}`];
  if (!stepEl) return;
  
  stepEl.classList.remove('active', 'done');
  if (state) {
    stepEl.classList.add(state);
  }
}

// UI State functions
function showLoading() {
  elements.extractBtn.disabled = true;
  elements.extractBtnText.textContent = 'Extracting...';
  elements.extractBtn.querySelector('.btn-subtitle').textContent = 'Calling API...';
  elements.status.textContent = 'Extracting';
  elements.status.className = 'status extracting';
  
  // Reset steps
  elements.step1.className = 'step';
  elements.step2.className = 'step';
  elements.step3.className = 'step';
  
  elements.loadingState.classList.remove('hidden');
  elements.resultsSummary.classList.add('hidden');
  elements.quickPreview.classList.add('hidden');
  elements.actions.classList.add('hidden');
  elements.errorState.classList.add('hidden');
}

function showResults(cacheAge = null) {
  elements.extractBtn.disabled = false;
  elements.extractBtnText.textContent = 'Re-extract';
  elements.extractBtn.querySelector('.btn-subtitle').textContent = 'Update design tokens';
  
  if (isFromCache && cacheAge !== null) {
    const ageText = formatCacheAge(cacheAge);
    elements.status.textContent = `Cached ${ageText}`;
    elements.status.className = 'status cached';
    elements.extractBtn.querySelector('.btn-subtitle').textContent = 'Click to refresh';
  } else {
    elements.status.textContent = 'Extracted';
    elements.status.className = 'status';
  }
  
  elements.loadingState.classList.add('hidden');
  elements.resultsSummary.classList.remove('hidden');
  elements.quickPreview.classList.remove('hidden');
  elements.actions.classList.remove('hidden');
  elements.errorState.classList.add('hidden');
  
  renderResults();
}

function showError(message) {
  elements.extractBtn.disabled = false;
  elements.extractBtnText.textContent = 'Extract Design System';
  elements.extractBtn.querySelector('.btn-subtitle').textContent = 'Analyze colors, fonts & components';
  elements.status.textContent = 'Error';
  elements.status.className = 'status error';
  
  elements.loadingState.classList.add('hidden');
  elements.resultsSummary.classList.add('hidden');
  elements.quickPreview.classList.add('hidden');
  elements.actions.classList.add('hidden');
  elements.errorState.classList.remove('hidden');
  elements.errorMessage.textContent = message || 'Unable to extract design system from this page';
}

// Render results
function renderResults() {
  if (!extractedData) return;

  // Update stats - handle both API format and old format
  const colors = extractedData.colors?.palette || extractedData.colors?.all || [];
  const fonts = extractedData.typography?.styles || extractedData.typography?.fontFamilies || [];
  const buttons = extractedData.components?.buttons || [];
  const inputs = extractedData.components?.inputs || [];
  
  elements.colorCount.textContent = colors.length;
  elements.fontCount.textContent = fonts.length;
  elements.componentCount.textContent = buttons.length + inputs.length;

  // Render colors
  renderColors();

  // Render typography
  renderFonts();

  // Render components
  renderComponents();
}

function renderColors() {
  // Handle API format (palette with normalized) or old format (all array)
  const palette = extractedData.colors?.palette || [];
  const allColors = extractedData.colors?.all || [];
  
  // Normalize colors to simple hex strings
  let colors = [];
  if (palette.length > 0) {
    colors = palette.map(c => c.normalized || c.hex || c).filter(Boolean);
  } else if (allColors.length > 0) {
    colors = allColors;
  }
  
  if (colors.length === 0) {
    elements.colorPalette.innerHTML = '<div class="empty-state">No colors detected</div>';
    return;
  }
  
  elements.colorPalette.innerHTML = colors.slice(0, 18).map(color => `
    <div class="color-swatch" style="background-color: ${color}" data-color="${color}" title="${color}"></div>
  `).join('');

  // Add click to copy
  elements.colorPalette.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      navigator.clipboard.writeText(swatch.dataset.color);
      showToast(`Copied ${swatch.dataset.color}`);
    });
  });
}

function renderFonts() {
  // Handle API format (styles array) or old format (fontFamilies array)
  const styles = extractedData.typography?.styles || [];
  const fontFamilies = extractedData.typography?.fontFamilies || [];
  
  let fonts = [];
  if (styles.length > 0) {
    // Extract unique font families from styles
    const fontSet = new Set();
    styles.forEach(style => {
      if (style.fontFamily) {
        const family = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        if (family) fontSet.add(family);
      }
    });
    fonts = [...fontSet];
  } else if (fontFamilies.length > 0) {
    fonts = fontFamilies;
  }
  
  if (fonts.length === 0) {
    elements.fontList.innerHTML = '<div class="empty-state">No fonts detected</div>';
    return;
  }
  
  elements.fontList.innerHTML = fonts.slice(0, 5).map(font => `
    <div class="font-item">
      <span class="font-name">${font}</span>
      <span class="font-preview" style="font-family: '${font}', sans-serif">Aa</span>
    </div>
  `).join('');
}

function renderComponents() {
  const buttons = extractedData.components?.buttons || [];
  const inputs = extractedData.components?.inputs || [];
  
  let html = '';
  
  if (buttons.length > 0) {
    html += buttons.slice(0, 2).map((btn, i) => `
      <div class="component-item">
        <div class="component-label">Button ${i + 1}</div>
        <div class="component-preview-box">
          <button style="
            background: ${btn.backgroundColor || btn.background || '#3b82f6'};
            color: ${btn.color || btn.textColor || '#fff'};
            border-radius: ${btn.borderRadius || '6px'};
            padding: ${btn.padding || '8px 16px'};
            font-size: ${btn.fontSize || '14px'};
            border: none;
            cursor: pointer;
          ">Button</button>
        </div>
      </div>
    `).join('');
  }
  
  if (inputs.length > 0) {
    html += inputs.slice(0, 1).map((input, i) => `
      <div class="component-item">
        <div class="component-label">Input</div>
        <div class="component-preview-box">
          <input type="text" placeholder="Input field" style="
            background: ${input.backgroundColor || input.background || '#fff'};
            border: 1px solid ${input.borderColor || '#ccc'};
            border-radius: ${input.borderRadius || '6px'};
            padding: ${input.padding || '8px 12px'};
            font-size: ${input.fontSize || '14px'};
            width: 100%;
            box-sizing: border-box;
            color: #333;
          ">
        </div>
      </div>
    `).join('');
  }
  
  if (html === '') {
    html = '<div class="empty-state">No UI components detected</div>';
  }
  
  elements.componentList.innerHTML = html;
}

// Tab switching
function switchTab(tabName) {
  currentTab = tabName;
  
  elements.tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });
}

// Toast notification
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 2000);
}

// Format cache age to human readable
function formatCacheAge(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// Copy JSON
async function copyJson() {
  if (!extractedData) return;
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    showToast('Copied to clipboard!');
  } catch (error) {
    console.error('Copy error:', error);
    showToast('Failed to copy');
  }
}

// Download JSON
function downloadJson() {
  if (!extractedData) return;
  
  const blob = new Blob([JSON.stringify(extractedData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `extypo-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('File downloaded!');
}

// Open full view (web app with URL parameter)
async function openFullView() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const webAppUrl = `${WEB_APP_URL}?url=${encodeURIComponent(tab.url)}`;
  chrome.tabs.create({ url: webAppUrl });
}

// Event Listeners
elements.extractBtn.addEventListener('click', () => {
  // If showing cached data, force refresh on click
  extract(isFromCache);
});
elements.retryBtn.addEventListener('click', () => extract(false));
elements.copyBtn.addEventListener('click', copyJson);
elements.downloadBtn.addEventListener('click', downloadJson);
elements.openFullBtn.addEventListener('click', openFullView);

elements.tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// Initialize
init();
