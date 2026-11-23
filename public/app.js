/**
 * Echidna Frontend - Real-time Dashboard
 */

class EchidnaUI {
  constructor() {
    this.ws = null;
    this.updateInterval = null;
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.startPolling();
  }

  bindElements() {
    this.startBtn = document.getElementById('start-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.terminal = document.getElementById('terminal');
    this.statusIndicator = document.getElementById('status-indicator');
    this.statusText = document.getElementById('status-text');
    this.notificationBar = document.getElementById('notification-bar');
    this.notificationText = document.getElementById('notification-text');
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.stopBtn.addEventListener('click', () => this.stop());
  }

  async start() {
    try {
      const res = await fetch('/api/start', { method: 'POST' });
      const data = await res.json();
      this.updateButtons(true, false, false);
      this.addTerminalLine('System started', 'success');
    } catch (error) {
      this.addTerminalLine(`Error: ${error.message}`, 'error');
    }
  }

  async pause() {
    try {
      const res = await fetch('/api/pause', { method: 'POST' });
      this.updateButtons(false, true, false);
      this.addTerminalLine('System paused', 'warn');
    } catch (error) {
      this.addTerminalLine(`Error: ${error.message}`, 'error');
    }
  }

  async stop() {
    try {
      const res = await fetch('/api/stop', { method: 'POST' });
      this.updateButtons(false, false, false);
      this.addTerminalLine('System stopped', 'warn');
    } catch (error) {
      this.addTerminalLine(`Error: ${error.message}`, 'error');
    }
  }

  updateButtons(running, paused, stopped) {
    this.startBtn.disabled = running;
    this.pauseBtn.disabled = !running || paused;
    this.stopBtn.disabled = !running;
  }

  startPolling() {
    this.updateInterval = setInterval(() => this.updateStatus(), 1000);
  }

  async updateStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      this.updateUI(data);
    } catch (error) {
      // Silent fail - don't spam console
    }
  }

  updateUI(data) {
    // Update stats
    document.getElementById('total-wallets').textContent = 
      data.stats.totalWallets.toLocaleString();
    document.getElementById('total-hits').textContent = 
      data.stats.totalHits.toLocaleString();
    document.getElementById('checks-per-second').textContent = 
      data.stats.checksPerSecond || '0';
    document.getElementById('runtime').textContent = 
      data.stats.runtimeFormatted || '0s';
    document.getElementById('probability').textContent = 
      data.probability.oddsPerAttempt || '1 in 10^30';

    // Update status indicator
    if (data.isRunning && !data.isPaused) {
      this.statusIndicator.className = 'indicator running';
      this.statusText.textContent = 'RUNNING';
      this.updateButtons(true, false, false);
    } else if (data.isPaused) {
      this.statusIndicator.className = 'indicator paused';
      this.statusText.textContent = 'PAUSED';
      this.updateButtons(false, true, false);
    } else {
      this.statusIndicator.className = 'indicator';
      this.statusText.textContent = 'IDLE';
      this.updateButtons(false, false, false);
    }

    // Update terminal with new logs
    if (data.logs && data.logs.length > 0) {
      const lastLog = data.logs[0];
      if (!this.lastLogId || this.lastLogId !== lastLog.id) {
        this.addTerminalLine(lastLog.message, lastLog.type);
        this.lastLogId = lastLog.id;

        // Show notification for hits
        if (lastLog.type === 'hit') {
          this.showNotification('WALLET WITH BALANCE FOUND! 🎉');
        }
      }
    }
  }

  addTerminalLine(message, type = 'info') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = '>';
    
    const text = document.createElement('span');
    text.className = `terminal-text ${type}`;
    text.textContent = message;
    
    line.appendChild(prompt);
    line.appendChild(text);
    
    // Add to top for speed
    this.terminal.insertBefore(line, this.terminal.firstChild);
    
    // Keep only last 50 lines for performance at high speed
    while (this.terminal.children.length > 50) {
      this.terminal.removeChild(this.terminal.lastChild);
    }
  }

  showNotification(message) {
    this.notificationText.textContent = message;
    this.notificationBar.classList.remove('hidden');
    this.notificationBar.classList.add('show');

    setTimeout(() => {
      this.notificationBar.classList.remove('show');
      setTimeout(() => {
        this.notificationBar.classList.add('hidden');
      }, 300);
    }, 5000);
  }
}

// Initialize
const ui = new EchidnaUI();

// PWA Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Could show install button here
  console.log('PWA install available');
});
