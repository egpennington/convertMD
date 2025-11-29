# ConvertMD

ConvertMD is a powerful, dual-mode Markdown editor and converter built with React and Tailwind CSS. It allows users to write in Markdown with a live preview or use a rich text editor to generate Markdown syntax in real-time.

## Features

- **Dual Modes**:
  - **Write Markdown**: Write Markdown with a live HTML preview.
  - **Rich Text to MD**: Type in a WYSIWYG editor and see the generated Markdown code instantly.
- **Rich Text Editing**: Format text with bold, italics, headings, lists, and more without knowing Markdown syntax.
- **Real-time Conversion**: Changes in the rich text editor are immediately reflected as Markdown code.
- **File Import**: Upload `.txt`, `.md`, or `.docx` files.
  - Automatically converts DOCX formatting to HTML/Markdown.
- **Export**: Copy to clipboard or download as a `.md` file.
- **Split View**: Toggle between side-by-side or top-bottom layouts.
- **Auto-Format**: Use AI (Gemini) to clean up and structure raw text in the Markdown editor.

## Live Demo

[Live Site on Netlify](https://convertmd-demo.netlify.app)

## Repository

[GitHub Repository](https://github.com/username/convertmd)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown, Remark GFM
- **Conversion Tools**: Turndown (HTML to MD), Mammoth (.docx to HTML/Text)
- **AI**: Google Gemini API

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
