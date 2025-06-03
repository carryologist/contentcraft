# ContentCraft 🚀

> AI-Powered Marketing Content Creator

Transform source content into compelling blog posts and platform-optimized promotional content for marketers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

## ✨ Features

- **AI Blog Generation**: Transform source material into engaging, conversational blog posts
- **Multi-Platform Content**: Generate optimized content for LinkedIn, Twitter/X, and Email
- **Context-Aware Generation**: Add custom instructions for targeted content creation
- **File Upload Support**: Upload TXT, DOC, DOCX, PDF files or paste text directly
- **Sophisticated UI**: Modern, responsive interface with step-by-step workflow
- **Copy-to-Clipboard**: One-click copying of generated content

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/carryologist/contentcraft.git
   cd contentcraft
   npm install
Set up environment

cp .env.example .env
# Edit .env with your configuration
Start the application

npm start
Open your browser Navigate to http://localhost:3000

🎯 How It Works
Add Source Content: Upload a file or paste your content
Generate Blog: AI creates a compelling blog post with optional context
Choose Platform: Select LinkedIn, Twitter/X, or Email
Get Content: Receive 3 optimized promotional pieces ready to publish
🔧 Configuration
Create a .env file:

PORT=3000
NODE_ENV=development

# AI Integration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
📡 API Endpoints
GET /api/health - Health check
POST /api/upload - File upload
POST /api/generate-blog - Generate blog with optional context
POST /api/generate-derivative - Generate platform content with context
🤝 Contributing
Contributions welcome! Please read our contributing guidelines and submit pull requests.

📄 License
MIT License - see LICENSE file for details.

🙏 Acknowledgments
Built for the marketing community with modern web technologies and AI integration.
