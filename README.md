# ConvertMD

ConvertMD is a real-time Markdown editor and conversion tool designed to help developers write, learn, and generate clean README files with live preview.

---

## 🌐 Live Demo

🔗 **Live Site:** https://convertmd.netlify.app  
(convertMD.netlify)

---

## 🚀 Features

- Real-time Markdown editing with live preview  
- Rich text to Markdown conversion  
- One-click auto-format cleanup  
- Built-in formatting toolbar  
- README template starter  
- File import support (.txt, .md, .docx, code files)  
- Copy to clipboard and download as `README.md`  
- Flexible layout modes  
- Fully client-side processing  
- Responsive design

---

## 🛠 Tech Stack

- React  
- TypeScript  
- Vite  
- Tailwind CSS  
- Lucide Icons  
- Turndown (HTML → Markdown)  
- Mammoth.js (DOCX parsing)  
- Netlify (Deployment)

---

## 📸 Screenshots (Optional)

![ConvertMD Demo 1](demo/markup2text.gif)
![ConvertMD Demo 2](demo/redmeTemplate.gif)

---

## 📦 Installation

```bash
git clone https://github.com/egpennington/convertMD.git
cd convertMD
npm install
npm run dev
```
---

## 🧑‍💻 Usage

1. **Start Writing Markdown**
   - Open the app and begin typing Markdown in the left editor.
   - A live preview of the formatted output appears instantly on the right.

2. **Use the Formatting Toolbar**
   - Apply headers, bold, italics, lists, quotes, code blocks, links, and images using the toolbar buttons.

3. **Load the README Template**
   - Click the **README Template** button to instantly load a professional starter README.
   - Customize the sections for your project.

4. **Auto-Format Markdown**
   - Click **Auto-Format** to clean up spacing, alignment, and syntax.

5. **Convert Rich Text to Markdown**
   - Switch to **Rich Text to MD** mode.
   - Type or paste formatted text and watch it convert to Markdown in real time.

6. **Import Files**
   - Use **Import** to load `.txt`, `.md`, `.docx`, or code files for editing and conversion.

7. **Copy or Download**
   - Click **Copy** to send the output to your clipboard.
   - Click **Download** to save the file directly as `README.md`.
---

## 🔌 API / Data (If Applicable)

ConvertMD runs entirely in the browser and does **not require any external APIs or backend services**.

- **HTML → Markdown Conversion:** Powered locally using **Turndown**
- **DOCX Parsing:** Handled client-side via **Mammoth.js**
- **Data Privacy:** No files or content are uploaded to a server

- No API keys required  
- No authentication setup  
- Works fully offline after load

---

## 🚀 Deployment

ConvertMD is deployed using **Netlify** for fast, global hosting and automatic updates from GitHub.

---

## 🗺 Roadmap

- [ ] Multiple README Templates  
  (App, Library, API, Open Source, Portfolio)

- [ ] Export to Additional Formats  
  (PDF, HTML, TXT)

- [ ] Drag-and-Drop File Import  
  (Drop files directly into the editor)

- [ ] Section-Based README Builder  
  (Guided form to auto-generate sections)

- [ ] Custom Theme Support  
  (Light mode, syntax themes, preview styles)

- [ ] GitHub Repo Metadata Import  
  (Auto-fill name, description, tech stack from a repo)

- [ ] Offline-First Enhancements  
  (Improved caching for full offline use)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project  
2. Create your feature branch  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch  
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

Your Name  
GitHub: https://github.com/egpennington
Live Project: https://convertmd.netlify.app  
