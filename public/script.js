class ContentCreatorApp {
    constructor() {
        this.currentStep = 'input';
        this.sourceContent = '';
        this.generatedBlog = null;
        this.selectedPlatform = null;
        this.generatedContent = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Content textarea
        const textarea = document.getElementById('content-textarea');
        textarea.addEventListener('input', () => this.updateCharCount());
        textarea.addEventListener('input', () => this.validateInput());

        // Generate blog button
        document.getElementById('generate-blog-btn').addEventListener('click', () => this.generateBlog());

        // Blog actions
        document.getElementById('regenerate-blog-btn').addEventListener('click', () => this.generateBlog());
        document.getElementById('create-content-btn').addEventListener('click', () => this.showPlatformSelection());

        // Platform selection
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectPlatform(e.currentTarget.dataset.platform));
        });

        // Content actions
        document.getElementById('back-to-platform-btn').addEventListener('click', () => this.showPlatformSelection());
        document.getElementById('start-over-btn').addEventListener('click', () => this.startOver());

        // Copy buttons (delegated event listener)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-button')) {
                this.copyToClipboard(e.target);
            }
        });
    }

    updateCharCount() {
        const textarea = document.getElementById('content-textarea');
        const charCount = document.querySelector('.char-count');
        charCount.textContent = `${textarea.value.length} characters`;
    }

    validateInput() {
        const generateBtn = document.getElementById('generate-blog-btn');
        const textarea = document.getElementById('content-textarea');
        
        const hasContent = textarea.value.trim().length > 50; // Minimum 50 characters
        this.sourceContent = textarea.value.trim();
        
        generateBtn.disabled = !hasContent;
    }

    async generateBlog() {
        if (!this.sourceContent) return;

        this.showLoading('Generating your blog post...', 'Our AI is crafting compelling content from your source material');

        try {
            const response = await fetch('/api/generate-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    content: this.sourceContent
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate blog');
            }

            this.generatedBlog = await response.json();
            this.showBlogPreview();
            this.hideLoading();
        } catch (error) {
            console.error('Blog generation error:', error);
            this.hideLoading();
            this.showError('Failed to generate blog content. Please try again.');
        }
    }

    showBlogPreview() {
        const blogPreview = document.getElementById('blog-preview');
        
        // Convert markdown-like content to HTML
        let htmlContent = this.generatedBlog.content
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|l])/gm, '<p>')
            .replace(/(?<![>])$/gm, '</p>');

        // Wrap consecutive list items in ul tags
        htmlContent = htmlContent.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, '<ul>$&</ul>');
        
        // Clean up extra p tags
        htmlContent = htmlContent.replace(/<p><\/p>/g, '').replace(/<p>(<[h|u])/g, '$1').replace(/(<\/[h|u][^>]*>)<\/p>/g, '$1');

        blogPreview.innerHTML = htmlContent;

        // Add citations if they exist
        if (this.generatedBlog.citations && this.generatedBlog.citations.length > 0) {
            const citationsHtml = `
                <div class="citations" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                    <h4>Sources:</h4>
                    <ul>
                        ${this.generatedBlog.citations.map(citation => 
                            `<li><a href="${citation.url}" target="_blank" rel="noopener">${citation.source}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            `;
            blogPreview.innerHTML += citationsHtml;
        }

        this.showStep('blog');
    }

    showPlatformSelection() {
        // Clear previous selection
        document.querySelectorAll('.platform-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.selectedPlatform = null;
        
        this.showStep('platform');
    }

    selectPlatform(platform) {
        // Update UI
        document.querySelectorAll('.platform-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-platform="${platform}"]`).classList.add('selected');
        
        this.selectedPlatform = platform;
        
        // Auto-generate content after a short delay
        setTimeout(() => {
            this.generateDerivativeContent();
        }, 500);
    }

    async generateDerivativeContent() {
        if (!this.selectedPlatform || !this.generatedBlog) return;

        this.showLoading(
            `Creating ${this.getPlatformDisplayName(this.selectedPlatform)} content...`, 
            'Crafting platform-optimized promotional content'
        );

        try {
            const response = await fetch('/api/generate-derivative', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blogContent: this.generatedBlog.content,
                    platform: this.selectedPlatform,
                    blogTitle: this.generatedBlog.title
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate derivative content');
            }

            this.generatedContent = await response.json();
            this.showGeneratedContent();
            this.hideLoading();
        } catch (error) {
            console.error('Derivative content generation error:', error);
            this.hideLoading();
            this.showError('Failed to generate promotional content. Please try again.');
        }
    }

    getPlatformDisplayName(platform) {
        const names = {
            linkedin: 'LinkedIn',
            twitter: 'Twitter/X',
            email: 'Email'
        };
        return names[platform] || platform;
    }

    showGeneratedContent() {
        const contentContainer = document.getElementById('generated-content');
        const platform = this.generatedContent.platform;
        const content = this.generatedContent.content;

        let contentHtml = '';

        content.forEach((piece, index) => {
            if (platform === 'email') {
                contentHtml += `
                    <div class="content-piece fade-in">
                        <div class="content-header">
                            <span class="content-type">${piece.type}</span>
                            <button class="copy-button" data-content="${this.escapeHtml(`Subject: ${piece.subject}\nPreview: ${piece.preview}`)}">
                                Copy
                            </button>
                        </div>
                        <div class="content-text email-content">
                            <div class="subject-line"><strong>Subject:</strong> ${piece.subject}</div>
                            <div class="preview-text"><strong>Preview:</strong> ${piece.preview}</div>
                        </div>
                    </div>
                `;
            } else {
                contentHtml += `
                    <div class="content-piece fade-in">
                        <div class="content-header">
                            <span class="content-type">${piece.type}</span>
                            <button class="copy-button" data-content="${this.escapeHtml(piece.content)}">
                                Copy
                            </button>
                        </div>
                        <div class="content-text">${piece.content}</div>
                    </div>
                `;
            }
        });

        contentContainer.innerHTML = contentHtml;
        this.showStep('content');
    }

    startOver() {
        // Reset all state
        this.currentStep = 'input';
        this.sourceContent = '';
        this.generatedBlog = null;
        this.selectedPlatform = null;
        this.generatedContent = null;

        // Reset UI
        document.getElementById('content-textarea').value = '';
        
        // Show input step
        this.showStep('input');
        this.updateCharCount();
        this.validateInput();
    }

    showStep(stepName) {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('hidden');
        });

        // Show target step
        document.getElementById(`step-${stepName}`).classList.remove('hidden');
        this.currentStep = stepName;

        // Scroll to top of content creator
        document.querySelector('.content-creator').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    showLoading(title, subtitle) {
        const overlay = document.getElementById('loading-overlay');
        const titleEl = document.getElementById('loading-title');
        const subtitleEl = document.getElementById('loading-subtitle');
        
        titleEl.textContent = title;
        subtitleEl.textContent = subtitle;
        overlay.classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    showError(message) {
        alert(message);
    }

    async copyToClipboard(button) {
        const content = button.dataset.content;
        
        try {
            await navigator.clipboard.writeText(content);
            
            // Update button state
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentCreatorApp();
});
