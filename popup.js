document.addEventListener('DOMContentLoaded', async () => {
    const currentDomainEl = document.getElementById('current-domain');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.getElementById('message');
    const startBtn = document.getElementById('start-timer');
    const timerListEl = document.getElementById('timer-list');

    // Get current tab domain
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = new URL(tab.url);
        currentDomainEl.textContent = url.hostname;
        currentDomainEl.dataset.domain = url.hostname;
    } catch (error) {
        currentDomainEl.textContent = 'Unknown domain';
    }

    // Load and display active timers
    loadActiveTimers();

    // Start timer button click handler
    startBtn.addEventListener('click', async () => {
        const hours = parseInt(hoursEl.value) || 0;
        const minutes = parseInt(minutesEl.value) || 0;
        const seconds = parseInt(secondsEl.value) || 0;
        
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 0) {
            alert('Please set a valid time!');
            return;
        }

        const alertType = document.querySelector('input[name="alertType"]:checked').value;
        const customMessage = messageEl.value.trim() || 'Time to take a break!';
        const domain = currentDomainEl.dataset.domain;

        // Create timer object
        const timer = {
            id: Date.now().toString(),
            domain: domain,
            endTime: Date.now() + (totalSeconds * 1000),
            alertType: alertType,
            message: customMessage,
            duration: totalSeconds
        };

        // Save timer to storage
        const result = await chrome.storage.local.get('timers');
        const timers = result.timers || [];
        timers.push(timer);
        await chrome.storage.local.set({ timers });

        // Create chrome alarm
        await chrome.alarms.create(timer.id, { delayInMinutes: totalSeconds / 60 });

        // Send message to background script
        chrome.runtime.sendMessage({
            action: 'timerStarted',
            timer: timer
        });

        // Reset form
        hoursEl.value = 0;
        minutesEl.value = 30;
        secondsEl.value = 0;
        messageEl.value = '';

        // Refresh timer list
        loadActiveTimers();

        // Show success message
        showNotification('Timer started successfully!', 'success');
    });

    async function loadActiveTimers() {
        const result = await chrome.storage.local.get('timers');
        const timers = result.timers || [];
        const activeTimers = timers.filter(timer => timer.endTime > Date.now());

        if (activeTimers.length === 0) {
            timerListEl.innerHTML = '<p class="no-timers">No active timers</p>';
            return;
        }

        timerListEl.innerHTML = activeTimers.map(timer => {
            const remaining = timer.endTime - Date.now();
            const remainingFormatted = formatTime(Math.ceil(remaining / 1000));
            
            return `
                <div class="timer-item">
                    <div class="timer-info">
                        <div class="timer-domain">${timer.domain}</div>
                        <div class="timer-remaining">${remainingFormatted} remaining</div>
                    </div>
                    <button class="cancel-btn" data-timer-id="${timer.id}">Cancel</button>
                </div>
            `;
        }).join('');

        // Add cancel button listeners
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', cancelTimer);
        });
    }

    async function cancelTimer(event) {
        const timerId = event.target.dataset.timerId;
        
        // Remove from storage
        const result = await chrome.storage.local.get('timers');
        const timers = result.timers || [];
        const updatedTimers = timers.filter(timer => timer.id !== timerId);
        await chrome.storage.local.set({ timers: updatedTimers });

        // Cancel chrome alarm
        await chrome.alarms.clear(timerId);

        // Refresh timer list
        loadActiveTimers();

        showNotification('Timer cancelled', 'info');
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #48bb78;' : 
              type === 'error' ? 'background: #f56565;' : 
              'background: #4299e1;'}
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Update timer display every second
    setInterval(loadActiveTimers, 1000);
});
