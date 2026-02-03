# <img src="public/icons/logo192.png" width="45" /> Daraz Label Printing & PDF Optimizer

![GitHub release (latest by date)](https://img.shields.io/github/v/release/SyedJamal030/daraz-label-printing?color=orange)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

### 📉 Cut your printing costs by up to 60% with smart label nesting.

**Daraz-Label-Printing** is a specialized desktop automation tool built to solve a major pain point for E-commerce sellers: paper waste. By restructuring standard Daraz PDF exports, this app intelligently fits 2 to 3 labels per A4 sheet while maintaining perfect barcode scan-ability.

---

## 🚀 Why Use This Tool?

The standard Daraz seller platform generates one shipping label per page. For high-volume stores, this is a logistics bottleneck and a financial drain. 

* **Cost Efficiency:** Save up to 60% on paper and ink/toner.
* **Time Savings:** Convert hours of manual PDF "cutting and pasting" into a two-click process.
* **Data Privacy:** All processing happens locally on your machine. No invoices or customer data ever leave your computer.
* **High Fidelity:** Uses a PDF-to-Image pipeline to ensure labels remain crisp and barcodes stay scannable.

## 🛠️ Technical Stack

* **Frontend:** React.js + Bootstrap (Responsive & Intuitive UI)
* **Desktop Wrapper:** Electron.js (Cross-platform compatibility)
* **Backend Logic:** Node.js File System (Local file handling)

---

## 💻 Installation & Usage

### For Users (Download)
1.  Go to the **[Latest Releases](https://github.com/SyedJamal030/daraz-label-printing/releases/latest)** page.
2.  Download the `.exe` installer for **Windows**.
3.  Run the application and start optimizing!

### For Developers (Build from Source)
If you want to modify the code or build it yourself:

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/](https://github.com/)[Your-Username]/daraz-label-printing.git
   cd daraz-label-printing
   npm install
   ```

2. **Run Development Mode:**
   ```bash
   npm run electron:serve
   ```


3. **Build Portable Executable:**
   ```bash
   npm run electron:build
   ```

---

## 📖 How It Works (3-Step Flow)

1. **Upload:** Drop your bulk Daraz PDF exports into the app.
2. **Select:** Preview and select specific pages (ensuring only shipping labels are processed while skipping unnecessary invoices or instructions).
3. **Auto-Adjust:** The Smart Layout Engine converts pages to layers and realigns them.
4. **Print:** Export a single, optimized PDF ready for your printer.

---

## 🗺️ Roadmap & Recent Updates

* [x] **Bulk Processing:** Enhanced the PDF engine to handle long lists of pages without lag.
* [x] **UI Polish:** Improved splash screen transitions and workflow.
* [ ] **Cross-Platform:** Generate and test portable builds for **macOS** and **Linux**.
* [ ] **Multi-Platform Support:** Expand nesting logic for other regional E-commerce sites (Shopee, Lazada).
* [ ] **Direct Thermal Printing:** Support for 4x6 thermal label dimensions.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

*Developed with ❤️ for the E-commerce Community.*

