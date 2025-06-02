# ⏰ Alarmy! By: Hyperforge Studios

A modern Chrome extension for setting web-based alarms to help you manage your time on websites like YouTube, Facebook, and more.

![Alarmy! Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🎯 Domain-Specific Timers**: Set timers for specific websites
- **⚡ Two Alert Types**: Choose between full-screen alerts or discrete corner popups
- **🎨 Modern UI**: Clean, gradient-based design with smooth animations
- **📱 Responsive**: Works great on all screen sizes
- **⏱️ Real-time Updates**: Live countdown display in the popup
- **🔔 Custom Messages**: Personalize your alert messages
- **🚀 Lightweight**: Minimal resource usage

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Development)

1. Clone or download this repository
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The Alarmy! extension should now appear in your extensions list

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon!

## 📖 How to Use

1. **Click the Alarmy! icon** in your Chrome toolbar
2. **Set your timer** using the hours, minutes, and seconds inputs
3. **Choose alert type**:
   - **Full Screen Alert**: Takes over the entire screen
   - **Corner Popup**: Shows a discrete notification in the corner
4. **Add custom message** (optional) for personalized alerts
5. **Click "Start Timer"** to begin countdown
6. **Manage active timers** in the "Active Timers" section

## 🎮 Alert Types

### Full Screen Alert
- Completely covers the webpage
- Impossible to ignore
- Perfect for strict time management
- Auto-dismisses after 30 seconds

### Corner Popup
- Appears in the top-right corner
- Less intrusive but still noticeable
- Auto-dismisses after 15 seconds
- Can be manually closed

## 🛠️ Technical Details

### File Structure
```
Alarmy!/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── content.js             # Content script for alerts
├── content.css            # Alert styling
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Permissions Used
- `activeTab`: Access current tab information
- `storage`: Store timer data locally
- `alarms`: Create and manage Chrome alarms
- `tabs`: Query tab information
- `host_permissions`: Access all websites for content injection

## 🎨 Design Philosophy

Alarmy! features a modern, gradient-based design with:
- **Purple gradient theme** (#667eea to #764ba2)
- **Clean typography** using Segoe UI font family
- **Smooth animations** for better user experience
- **Accessible design** with high contrast support
- **Responsive layout** that works on all screen sizes

## 🔧 Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Testing
1. Load the extension in developer mode
2. Test on various websites (YouTube, Facebook, etc.)
3. Verify both alert types work correctly
4. Check timer persistence across browser sessions

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Hyperforge Studios

Hyperforge Studios is dedicated to creating innovative web tools and browser extensions that enhance productivity and user experience.

## 🐛 Bug Reports & Feature Requests

Please use the GitHub Issues tab to report bugs or request new features.

## 📋 Changelog

### Version 1.0.0
- Initial release
- Domain-specific timer functionality
- Full-screen and corner alert options
- Modern UI with gradient design
- Real-time timer management

---

Made with ❤️ by Hyperforge Studios
