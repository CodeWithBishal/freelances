// background.js - Service worker

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AUTH_STATE_CHANGED') {
        // We could store some state here if needed, but for now Supabase's
        // custom storage implementation (using chrome.storage.local) will handle persistence.
        console.log('Auth state changed', message.payload);
    }
    return true; // Keep the message channel open for async responses if needed
});

// Optional: Run some code when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Movie Watchlist extension installed/updated.');
});
