// Background script for Alarmy! Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Alarmy! Extension installed');
    
    // Clear any existing alarms on install
    chrome.alarms.clearAll();
});

// Listen for alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log('Alarm triggered:', alarm.name);
    
    // Get timer details from storage
    const result = await chrome.storage.local.get('timers');
    const timers = result.timers || [];
    const timer = timers.find(t => t.id === alarm.name);
    
    if (!timer) {
        console.log('Timer not found for alarm:', alarm.name);
        return;
    }

    // Get current active tab
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (activeTab) {
        const currentUrl = new URL(activeTab.url);
        const currentDomain = currentUrl.hostname;
        
        // Check if the timer is for the current domain or if it's a global timer
        if (timer.domain === currentDomain || timer.domain === 'global') {
            // Send message to content script to show alert
            try {
                await chrome.tabs.sendMessage(activeTab.id, {
                    action: 'showAlert',
                    alertType: timer.alertType,
                    message: timer.message,
                    domain: timer.domain
                });
            } catch (error) {
                console.log('Could not send message to content script:', error);
                // Fallback: show browser notification
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Alarmy! Time\'s Up!',
                    message: timer.message
                });
            }
        }
    }

    // Remove the timer from storage
    const updatedTimers = timers.filter(t => t.id !== alarm.name);
    await chrome.storage.local.set({ timers: updatedTimers });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'timerStarted') {
        console.log('Timer started:', request.timer);
        // Could add additional logic here for timer start
    } else if (request.action === 'alertDismissed') {
        console.log('Alert dismissed for timer:', request.timerId);
        // Could add analytics or logging here
    } else if (request.action === 'addMoreTime') {
        handleAddMoreTime(request.domain, request.additionalTime);
    }
    
    sendResponse({ success: true });
});

// Handle adding more time to current domain timers
async function handleAddMoreTime(domain, additionalMs) {
    console.log(`Adding ${additionalMs}ms to timers for domain: ${domain}`);
    
    // Create a new 5-minute timer for this domain
    const newTimer = {
        id: Date.now().toString(),
        domain: domain,
        endTime: Date.now() + additionalMs,
        alertType: 'corner', // Use less intrusive corner alert for extensions
        message: 'Your extended time is up! Time to take that break.',
        duration: additionalMs / 1000
    };
    
    // Save to storage
    const result = await chrome.storage.local.get('timers');
    const timers = result.timers || [];
    timers.push(newTimer);
    await chrome.storage.local.set({ timers });
    
    // Create chrome alarm
    await chrome.alarms.create(newTimer.id, { delayInMinutes: additionalMs / 60000 });
}

// Clean up expired timers periodically
setInterval(async () => {
    const result = await chrome.storage.local.get('timers');
    const timers = result.timers || [];
    const activeTimers = timers.filter(timer => timer.endTime > Date.now());
    
    if (activeTimers.length !== timers.length) {
        await chrome.storage.local.set({ timers: activeTimers });
    }
}, 60000); // Check every minute

// Handle tab updates to check if user is on a timed domain
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        try {
            const url = new URL(tab.url);
            const domain = url.hostname;
            
            // Get active timers for this domain
            const result = await chrome.storage.local.get('timers');
            const timers = result.timers || [];
            const domainTimers = timers.filter(timer => 
                timer.domain === domain && timer.endTime > Date.now()
            );
            
            if (domainTimers.length > 0) {
                // Content script is already declared in manifest, no need to inject
                console.log(`Active timers found for domain: ${domain}`);
            }
        } catch (error) {
            console.log('Error processing tab update:', error);
        }
    }
});
