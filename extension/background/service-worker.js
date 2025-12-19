// Extypo Extension - Background Service Worker

const WEB_APP_URL = 'https://extypo.vercel.app';

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Extypo] Extension installed');
  } else if (details.reason === 'update') {
    console.log('[Extypo] Extension updated to version', chrome.runtime.getManifest().version);
  }
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'extypo-extract',
    title: 'Extract Design System with Extypo',
    contexts: ['page'],
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openFullView') {
    chrome.tabs.create({ url: message.url });
    sendResponse({ success: true });
  }
  
  if (message.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title,
          favIconUrl: tabs[0].favIconUrl,
        });
      } else {
        sendResponse(null);
      }
    });
    return true;
  }
});

// Context menu click handler - open web app with URL
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'extypo-extract' && tab?.url) {
    const extractUrl = `${WEB_APP_URL}?url=${encodeURIComponent(tab.url)}`;
    chrome.tabs.create({ url: extractUrl });
  }
});

console.log('[Extypo] Service worker loaded');
