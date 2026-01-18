// QR FORGE PRO - URL-BASED SECURITY (NO BACKEND NEEDED)
class QRForgePro {
  constructor() {
    this.qrCode = null;
    this.VALIDATOR_URL = 'elaborate-swan-f8f28b.netlify.app'; // CHANGE THIS TO YOUR URL!
    this.HISTORY_KEY = 'qr_forge_history';
    this.init();
  }

  init() {
    this.initElements();
    this.setupEventListeners();
    this.loadSettings();
    this.loadTheme();
  }

  initElements() {
    this.urlInput = document.getElementById('urlInput');
    this.pasteBtn = document.getElementById('pasteBtn');
    this.themeToggle = document.getElementById('themeToggle');
    this.qrDisplay = document.getElementById('qrDisplay');
    this.qrcode = document.getElementById('qrcode');
    this.placeholder = document.getElementById('placeholder');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.tabPanels = document.querySelectorAll('.tab-panel');
    this.fgColor = document.getElementById('fgColor');
    this.bgColor = document.getElementById('bgColor');
    this.sizeSlider = document.getElementById('sizeSlider');
    this.sizeValue = document.getElementById('sizeValue');
    this.errorLevel = document.getElementById('errorLevel');
    this.passwordCard = document.getElementById('passwordCard');
    this.expirationCard = document.getElementById('expirationCard');
    this.scanLimitCard = document.getElementById('scanLimitCard');
    this.password1 = document.getElementById('password1');
    this.password2 = document.getElementById('password2');
    this.expirationHours = document.getElementById('expirationHours');
    this.expirationMinutes = document.getElementById('expirationMinutes');
    this.maxScans = document.getElementById('maxScans');
    this.generateBtn = document.getElementById('generateBtn');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.copyBtn = document.getElementById('copyBtn');
    this.captureBtn = document.getElementById('captureBtn');
    this.historyBtn = document.getElementById('historyBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.toast = document.getElementById('toast');
    this.toastText = document.getElementById('toastText');
    this.toastIcon = document.getElementById('toastIcon');
  }

  setupEventListeners() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.tabBtns.forEach(btn => btn.addEventListener('click', () => this.switchTab(btn)));
    this.generateBtn.addEventListener('click', () => this.generateQR());
    this.urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.generateQR(); });
    this.downloadBtn.addEventListener('click', () => this.downloadQR());
    this.copyBtn.addEventListener('click', () => this.copyQR());
    this.pasteBtn.addEventListener('click', () => this.paste());
    this.captureBtn.addEventListener('click', () => this.captureTab());
    this.historyBtn.addEventListener('click', () => this.showHistoryModal());
    this.clearBtn.addEventListener('click', () => this.clear());
    this.sizeSlider.addEventListener('input', (e) => { this.sizeValue.textContent = e.target.value + 'px'; });
    
    this.passwordCard.querySelector('.security-header').addEventListener('click', () => this.toggleSecurity('password'));
    this.expirationCard.querySelector('.security-header').addEventListener('click', () => this.toggleSecurity('expiration'));
    this.scanLimitCard.querySelector('.security-header').addEventListener('click', () => this.toggleSecurity('scanLimit'));
    
    const allCards = [this.passwordCard, this.expirationCard, this.scanLimitCard];
    allCards.forEach(card => {
      const inputs = card.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('click', (e) => e.stopPropagation());
        input.addEventListener('focus', (e) => e.stopPropagation());
      });
    });
    
    this.password1.addEventListener('input', () => this.checkPasswordStrength());
    this.password2.addEventListener('input', () => this.checkPasswordStrength());
  }

  switchTab(clickedBtn) {
    this.tabBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    const targetTab = clickedBtn.dataset.tab;
    this.tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === targetTab) {
        panel.classList.add('active');
      }
    });
  }

  toggleSecurity(type) {
    const cards = { password: this.passwordCard, expiration: this.expirationCard, scanLimit: this.scanLimitCard };
    const card = cards[type];
    card.classList.toggle('active');
    const toggle = card.querySelector('.security-toggle');
    toggle.style.transform = 'scale(1.1)';
    setTimeout(() => toggle.style.transform = 'scale(1)', 200);
  }

  checkPasswordStrength() {
    const password = this.password1.value;
    const bars = document.querySelectorAll('.password-strength .strength-bar');
    
    bars.forEach(bar => {
      bar.classList.remove('active', 'medium', 'strong');
    });
    
    if (!password) {
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) {
      strength = strength + 1;
    }
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength = strength + 1;
    }
    if (/\d/.test(password)) {
      strength = strength + 1;
    }
    if (/[^a-zA-Z\d]/.test(password)) {
      strength = strength + 1;
    }
    if (password.length >= 12) {
      strength = strength + 1;
    }
    
    let className = '';
    if (strength >= 4) {
      className = 'strong';
    } else if (strength >= 2) {
      className = 'medium';
    }
    
    for (let i = 0; i < strength; i = i + 1) {
      if (bars[i]) {
        bars[i].classList.add('active');
        if (className) {
          bars[i].classList.add(className);
        }
      }
    }
  }

  async generateQR() {
    const url = this.urlInput.value.trim();
    if (!url) {
      this.showToast('⚠️ Enter URL', 'error');
      return;
    }
    
    const hasPassword = this.passwordCard.classList.contains('active');
    const hasExpiration = this.expirationCard.classList.contains('active');
    const hasScanLimit = this.scanLimitCard.classList.contains('active');
    
    // Validate password
    if (hasPassword) {
      if (!this.password1.value || !this.password2.value) {
        this.showToast('⚠️ Enter password', 'error');
        return;
      }
      if (this.password1.value !== this.password2.value) {
        this.showToast('⚠️ Passwords don\'t match', 'error');
        return;
      }
      if (this.password1.value.length < 8) {
        this.showToast('⚠️ Password min 8 chars', 'error');
        return;
      }
    }
    
    // Validate expiration
    let expiryTime = null;
    if (hasExpiration) {
      const hours = parseInt(this.expirationHours.value) || 0;
      const minutes = parseInt(this.expirationMinutes.value) || 0;
      if (hours === 0 && minutes === 0) {
        this.showToast('⚠️ Set time', 'error');
        return;
      }
      expiryTime = Date.now() + ((hours * 60 + minutes) * 60 * 1000);
    }
    
    // Validate scan limit
    let scanLimit = null;
    if (hasScanLimit) {
      scanLimit = parseInt(this.maxScans.value);
      if (!scanLimit || scanLimit < 1) {
        this.showToast('⚠️ Limit min 1', 'error');
        return;
      }
    }
    
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = '<div class="spinner"></div><span>Generating...</span>';
    
    try {
      // Create compact data object
      const qrId = 'qr_' + Date.now().toString(36);
      const qrData = {
        id: qrId,
        url: url
      };
      
      if (hasPassword) {
        qrData.pwd = this.password1.value;
      }
      if (expiryTime) {
        qrData.exp = expiryTime;
      }
      if (scanLimit) {
        qrData.lim = scanLimit;
      }
      
      // Encode to Base64
      const jsonStr = JSON.stringify(qrData);
      const base64 = btoa(jsonStr);
      
      // Create validator URL
      const validatorUrl = `${this.VALIDATOR_URL}?d=${base64}`;
      
      // Check URL length
      if (validatorUrl.length > 800) {
        this.showToast('⚠️ URL too long! Shorten your URL or disable security.', 'error');
        throw new Error('URL too long');
      }
      
      // Generate QR
      this.qrcode.innerHTML = '';
      this.qrcode.classList.remove('active');
      
      const size = parseInt(this.sizeSlider.value);
      const colorDark = this.fgColor.value;
      const colorLight = this.bgColor.value;
      const correctLevel = this.errorLevel.value;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.qrCode = new QRCode(this.qrcode, {
        text: validatorUrl,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel[correctLevel]
      });
      
      setTimeout(() => {
        this.placeholder.style.display = 'none';
        this.qrcode.classList.add('active');
        this.qrDisplay.classList.add('has-qr');
        this.downloadBtn.disabled = false;
        this.copyBtn.disabled = false;
        
        let secInfo = [];
        if (hasPassword) {
          secInfo.push('🔒 Password');
        }
        if (hasExpiration) {
          secInfo.push('⏰ Expiring');
        }
        if (hasScanLimit) {
          secInfo.push(`📊 ${scanLimit}x`);
        }
        
        const msg = secInfo.length > 0 ? `✨ ${secInfo.join(', ')}` : '✨ QR Generated!';
        this.showToast(msg, 'success');
        
        this.saveToHistory({
          url: url,
          validatorUrl: validatorUrl,
          hasPassword: hasPassword,
          hasExpiration: hasExpiration,
          hasScanLimit: hasScanLimit,
          created: Date.now()
        });
      }, 100);
      
    } catch (error) {
      this.showToast('❌ Failed: ' + error.message, 'error');
    } finally {
      this.generateBtn.disabled = false;
      this.generateBtn.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/></svg><span>Generate QR Code</span>';
    }
  }

  showHistoryModal() {
    const history = this.getHistory();
    if (history.length === 0) {
      this.showToast('📜 No history', 'error');
      return;
    }
    alert(`History: ${history.length} QR codes\nCheck console (F12)`);
    console.log('QR History:', history);
  }

  downloadQR() {
    const canvas = this.qrcode.querySelector('canvas');
    if (!canvas) {
      this.showToast('❌ No QR', 'error');
      return;
    }
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showToast('📥 Downloaded!', 'success');
  }

  async copyQR() {
    const canvas = this.qrcode.querySelector('canvas');
    if (!canvas) {
      this.showToast('❌ No QR', 'error');
      return;
    }
    try {
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        this.showToast('📋 Copied!', 'success');
      });
    } catch (error) {
      this.showToast('❌ Copy failed', 'error');
    }
  }

  async paste() {
    try {
      const text = await navigator.clipboard.readText();
      this.urlInput.value = text;
      this.showToast('📋 Pasted!', 'success');
    } catch (error) {
      this.showToast('❌ Grant permission', 'error');
    }
  }

  async captureTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        this.urlInput.value = tab.url;
        this.showToast('🔗 Captured!', 'success');
      }
    } catch (error) {
      this.showToast('❌ Failed', 'error');
    }
  }

  clear() {
    this.urlInput.value = '';
    this.qrcode.innerHTML = '';
    this.qrcode.classList.remove('active');
    this.placeholder.style.display = 'block';
    this.qrDisplay.classList.remove('has-qr');
    this.downloadBtn.disabled = true;
    this.copyBtn.disabled = true;
    this.showToast('🧹 Cleared!', 'success');
  }

  saveToHistory(item) {
    try {
      let history = this.getHistory();
      history.push(item);
      if (history.length > 50) {
        history.shift();
      }
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('History save failed');
    }
  }

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('qr_settings', JSON.stringify({
        fgColor: this.fgColor.value,
        bgColor: this.bgColor.value,
        size: this.sizeSlider.value,
        errorLevel: this.errorLevel.value
      }));
    } catch (e) {}
  }

  loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('qr_settings') || '{}');
      if (settings.fgColor) {
        this.fgColor.value = settings.fgColor;
      }
      if (settings.bgColor) {
        this.bgColor.value = settings.bgColor;
      }
      if (settings.size) {
        this.sizeSlider.value = settings.size;
        this.sizeValue.textContent = settings.size + 'px';
      }
      if (settings.errorLevel) {
        this.errorLevel.value = settings.errorLevel;
      }
    } catch (e) {}
    
    const elements = [this.fgColor, this.bgColor, this.sizeSlider, this.errorLevel];
    elements.forEach(el => {
      el.addEventListener('change', () => this.saveSettings());
    });
  }

  toggleTheme() {
    const current = document.body.dataset.theme || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    this.showToast(`🎨 ${newTheme === 'dark' ? 'Dark' : 'Light'}`, 'success');
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = theme;
  }

  showToast(message, type = 'success') {
    this.toastText.textContent = message;
    this.toast.className = 'toast show ' + type;
    
    if (type === 'error') {
      this.toastIcon.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
    } else {
      this.toastIcon.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
    }
    
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.qrApp = new QRForgePro();
});
