// Content script for Alarmy! Chrome Extension
console.log('Alarmy! content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showAlert') {
        showAlert(request.alertType, request.message, request.domain);
        sendResponse({ success: true });
    }
});

function showAlert(alertType, message, domain) {
    if (alertType === 'fullscreen') {
        showFullscreenAlert(message, domain);
    } else if (alertType === 'corner') {
        showCornerAlert(message, domain);
    }
}

function showFullscreenAlert(message, domain) {
    // Remove any existing alerts
    removeExistingAlerts();

    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.id = 'alarmy-fullscreen-alert';
    overlay.innerHTML = `
        <div class="alarmy-fullscreen-container">
            <div class="alarmy-fullscreen-content">
                <div class="alarmy-icon">⏰</div>
                <h1 class="alarmy-title">Time's Up!</h1>
                <p class="alarmy-domain">You've been on ${domain} long enough</p>
                <p class="alarmy-message">${message}</p>
                <div class="alarmy-buttons">
                    <button class="alarmy-btn alarmy-btn-primary" onclick="this.closest('#alarmy-fullscreen-alert').remove()">
                        Got it!
                    </button>
                    <button class="alarmy-btn alarmy-btn-secondary" onclick="addMoreTime('${domain}', 300000); this.closest('#alarmy-fullscreen-alert').remove()">
                        5 more minutes
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners for dismiss
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            notifyAlertDismissed();
        }
    });

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
        if (document.getElementById('alarmy-fullscreen-alert')) {
            overlay.remove();
            notifyAlertDismissed();
        }
    }, 30000);
}

function showCornerAlert(message, domain) {
    // Remove any existing corner alerts
    const existingCorner = document.getElementById('alarmy-corner-alert');
    if (existingCorner) {
        existingCorner.remove();
    }

    // Create corner alert
    const cornerAlert = document.createElement('div');
    cornerAlert.id = 'alarmy-corner-alert';
    cornerAlert.innerHTML = `
        <div class="alarmy-corner-container">
            <div class="alarmy-corner-header">
                <div class="alarmy-corner-icon">⏰</div>
                <div class="alarmy-corner-title">Alarmy!</div>
                <button class="alarmy-corner-close" onclick="this.closest('#alarmy-corner-alert').remove()">×</button>
            </div>
            <div class="alarmy-corner-content">
                <p class="alarmy-corner-domain">${domain}</p>
                <p class="alarmy-corner-message">${message}</p>
            </div>
            <div class="alarmy-corner-actions">
                <button class="alarmy-corner-btn" onclick="this.closest('#alarmy-corner-alert').remove()">
                    Dismiss
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(cornerAlert);

    // Animate in
    setTimeout(() => {
        cornerAlert.style.transform = 'translateX(0)';
    }, 100);

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
        if (document.getElementById('alarmy-corner-alert')) {
            cornerAlert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                cornerAlert.remove();
                notifyAlertDismissed();
            }, 300);
        }
    }, 15000);
}

function removeExistingAlerts() {
    const existingFullscreen = document.getElementById('alarmy-fullscreen-alert');
    const existingCorner = document.getElementById('alarmy-corner-alert');
    
    if (existingFullscreen) existingFullscreen.remove();
    if (existingCorner) existingCorner.remove();
}

function notifyAlertDismissed() {
    chrome.runtime.sendMessage({
        action: 'alertDismissed',
        timestamp: Date.now()
    });
}

// Add more time function for "5 more minutes" button
function addMoreTime(domain, additionalMs) {
    chrome.runtime.sendMessage({
        action: 'addMoreTime',
        domain: domain,
        additionalTime: additionalMs
    });
}

// Make function available globally for onclick handlers
window.addMoreTime = addMoreTime;

// Inject CSS if not already injected
if (!document.getElementById('alarmy-styles')) {
    const style = document.createElement('style');
    style.id = 'alarmy-styles';
    style.textContent = `
        /* CSS content will be loaded from content.css */
    `;
    document.head.appendChild(style);
}
