# 📌 QR Forge Pro — Secure QR Code Generator

QR Forge Pro is an **enterprise-grade Chrome extension** designed to generate **secure, privacy-focused QR codes** with advanced access control — all without requiring a backend server.

Built with **Vanilla JavaScript (ES6+)**, the project focuses on **security, performance, and clean architecture** while remaining completely free and open-source.

---

## 🚀 Features

* 🔐 **Password-Protected QR Codes** with strength validation
* ⏱️ **Time-Based Expiration** (hours + minutes)
* 🔢 **Scan Limit Enforcement** to restrict reuse
* 🎨 **Custom QR Styling** (color, size, quality)
* 🌗 **Light / Dark Themes** with smooth animations
* 🌐 **Web-Based QR Validator** for controlled access
* ⚡ **Sub-second QR generation**
* 💻 **Offline-first & privacy-friendly**

---

## 🛠️ Tech Stack

**Frontend**

* JavaScript (ES6+)
* HTML5
* CSS3 (CSS Variables & Animations)

**Browser APIs**

* Chrome Extension API
* LocalStorage
* Clipboard API

**Libraries**

* QRCode.js

**Hosting**

* Netlify (Static Web Validator)

**Version Control**

* Git & GitHub

---

## 🧠 Architecture Overview

QR Forge Pro follows a **static, serverless architecture**:

* QR data is encoded using **Base64**
* Parameters are securely passed via URL
* Validator decodes and verifies access rules
* No backend → zero hosting cost & infinite scalability

This design ensures:

* No user tracking
* No database dependency
* No infrastructure overhead

---

## 🔐 Security Model

The project implements a **3-layer security system**:

1. **Password Protection** (with strength meter)
2. **Time-Based Expiration**
3. **Scan Limit Tracking**

All validation happens client-side, ensuring privacy while maintaining access control.

---

## 📦 Project Structure

```
qr-forge-pro/
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   └── qr-generator.js
│
├── validator/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## ⚙️ Installation (Local Development)

### Chrome Extension

1. Clone the repository

```bash
git clone https://github.com/your-username/qr-forge-pro.git
```

2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

### Web Validator

* Open `validator/index.html` locally
  OR
* Deploy the `validator/` folder to Netlify

---

## 🎯 Use Cases

* 🎟️ Event tickets (single-use QR codes)
* 📄 Secure document sharing
* 🏢 Corporate access control
* ⏳ Time-sensitive promotions

---

## 🔮 Future Enhancements

* Backend analytics dashboard
* Batch QR generation
* Admin access panel
* API for third-party integrations
* Chrome Web Store release

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository, open issues, or submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 👤 Author

**Prasad Limbekar**
Frontend Developer | Chrome Extensions | Web Security

🔗 LinkedIn: https://linkedin.com/in/limbekar-prasad
🔗 GitHub: https://github.com/prasadl18
