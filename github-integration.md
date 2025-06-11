# GitHub Integration Code for Daily News Website

## Enhanced app.js with GitHub API Integration

Replace the sample data section in `app.js` with this code to automatically fetch and parse your markdown files:

```javascript
class GitHubNewsParser {
    constructor(username, repoName) {
        this.username = username;
        this.repoName = repoName;
        this.apiBase = `https://api.github.com/repos/${username}/${repoName}`;
        this.articles = [];
    }

    async fetchMarkdownFiles() {
        try {
            const response = await fetch(`${this.apiBase}/contents/`);
            if (!response.ok) throw new Error('Failed to fetch repository contents');
            
            const files = await response.json();
            const markdownFiles = files.filter(file => 
                file.name.endsWith('.md') && 
                file.name.match(/^\d{4}_\d{2}_\d{2}\.md$/)
            );

            const articles = [];
            for (const file of markdownFiles) {
                const content = await this.fetchFileContent(file.download_url);
                const parsedArticles = this.parseMarkdownContent(content, file.name);
                articles.push(...parsedArticles);
            }

            return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error fetching markdown files:', error);
            return [];
        }
    }

    async fetchFileContent(url) {
        try {
            const response = await fetch(url);
            return await response.text();
        } catch (error) {
            console.error('Error fetching file content:', error);
            return '';
        }
    }

    parseMarkdownContent(content, filename) {
        const articles = [];
        const lines = content.split('\n');
        
        let currentArticle = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for article title (bold text)
            const titleMatch = line.match(/^\*\*(.*?)\*\*\s*$/);
            if (titleMatch) {
                // Save previous article if exists
                if (currentArticle && currentArticle.title && currentArticle.url) {
                    articles.push(this.finalizeArticle(currentArticle, filename));
                }
                
                // Start new article
                currentArticle = {
                    title: titleMatch[1].trim(),
                    dateText: '',
                    url: '',
                    source: '',
                    filename: filename
                };
                continue;
            }
            
            // Check for date line (next line after title)
            if (currentArticle && !currentArticle.dateText && line) {
                currentArticle.dateText = line;
                currentArticle.date = this.parseDate(line, filename);
                continue;
            }
            
            // Check for URL line
            const urlMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (urlMatch && currentArticle && !currentArticle.url) {
                currentArticle.url = urlMatch[2];
                currentArticle.source = this.extractSource(urlMatch[2]);
                continue;
            }
        }
        
        // Don't forget the last article
        if (currentArticle && currentArticle.title && currentArticle.url) {
            articles.push(this.finalizeArticle(currentArticle, filename));
        }
        
        return articles;
    }

    finalizeArticle(article, filename) {
        return {
            ...article,
            id: this.generateId(article.title, filename),
            category: this.categorizeBySource(article.source),
            tags: this.extractTags(article.title)
        };
    }

    parseDate(dateText, filename) {
        // Try to parse various date formats
        const now = new Date();
        
        // Extract date from filename as fallback
        const filenameMatch = filename.match(/(\d{4})_(\d{2})_(\d{2})/);
        let fallbackDate = now;
        if (filenameMatch) {
            fallbackDate = new Date(filenameMatch[1], filenameMatch[2] - 1, filenameMatch[3]);
        }
        
        // Parse "X hours ago", "X minutes ago", etc.
        const relativeMatch = dateText.match(/(\d+)\s+(hours?|minutes?|days?)\s+ago/i);
        if (relativeMatch) {
            const amount = parseInt(relativeMatch[1]);
            const unit = relativeMatch[2].toLowerCase();
            const date = new Date();
            
            if (unit.includes('hour')) {
                date.setHours(date.getHours() - amount);
            } else if (unit.includes('minute')) {
                date.setMinutes(date.getMinutes() - amount);
            } else if (unit.includes('day')) {
                date.setDate(date.getDate() - amount);
            }
            
            return date.toISOString();
        }
        
        // Parse standard date formats
        const dateFormats = [
            /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
            /(\d{4})-(\d{2})-(\d{2})/,
            /(\d{1,2})\/(\d{1,2})\/(\d{4})/
        ];
        
        for (const format of dateFormats) {
            const match = dateText.match(format);
            if (match) {
                const parsed = new Date(dateText);
                if (!isNaN(parsed.getTime())) {
                    return parsed.toISOString();
                }
            }
        }
        
        return fallbackDate.toISOString();
    }

    extractSource(url) {
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            
            const sourceMap = {
                'theinformation.com': 'The Information',
                'techcrunch.com': 'TechCrunch',
                'reuters.com': 'Reuters',
                'wsj.com': 'Wall Street Journal',
                'bloomberg.com': 'Bloomberg',
                'hbr.org': 'Harvard Business Review',
                'news.mit.edu': 'MIT News',
                'nature.com': 'Nature',
                'newscientist.com': 'New Scientist',
                'theguardian.com': 'The Guardian',
                'nytimes.com': 'New York Times',
                'economist.com': 'The Economist',
                'bbc.com': 'BBC',
                'theatlantic.com': 'The Atlantic',
                'ft.com': 'Financial Times',
                'wired.com': 'Wired',
                'ground.news': 'Ground News',
                'deeplearning.ai': 'DeepLearning.AI',
                'technologyreview.com': 'MIT Technology Review'
            };
            
            return sourceMap[domain] || this.capitalizeWords(domain.replace(/\.(com|org|net|edu)$/, ''));
        } catch (error) {
            return 'Unknown Source';
        }
    }

    categorizeBySource(source) {
        const categories = {
            'Tech News': ['TechCrunch', 'Wired', 'The Verge'],
            'Academic': ['Nature', 'MIT News', 'MIT Technology Review'],
            'Business': ['Wall Street Journal', 'Bloomberg', 'Harvard Business Review'],
            'General News': ['Reuters', 'The Guardian', 'New York Times', 'BBC'],
            'Specialized': ['The Information', 'DeepLearning.AI']
        };
        
        for (const [category, sources] of Object.entries(categories)) {
            if (sources.includes(source)) {
                return category;
            }
        }
        
        return 'Other';
    }

    extractTags(title) {
        const tags = [];
        const keywords = ['AI', 'OpenAI', 'Google', 'Meta', 'Apple', 'Microsoft', 'Tesla', 'AGI', 'LLM', 'GPT', 'Claude', 'Gemini'];
        
        keywords.forEach(keyword => {
            if (title.toLowerCase().includes(keyword.toLowerCase())) {
                tags.push(keyword);
            }
        });
        
        return tags;
    }

    generateId(title, filename) {
        const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const fileSlug = filename.replace('.md', '');
        return `${fileSlug}-${titleSlug}`;
    }

    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Usage in your main app
class DailyNewsApp {
    constructor() {
        this.parser = new GitHubNewsParser('koltregaskes', 'daily-news');
        this.articles = [];
        this.filteredArticles = [];
        this.init();
    }

    async init() {
        this.showLoading();
        
        // Try to fetch real data, fallback to sample data
        try {
            this.articles = await this.parser.fetchMarkdownFiles();
            if (this.articles.length === 0) {
                this.articles = this.getSampleData();
            }
        } catch (error) {
            console.error('Failed to fetch articles, using sample data:', error);
            this.articles = this.getSampleData();
        }
        
        this.filteredArticles = [...this.articles];
        this.hideLoading();
        this.render();
        this.bindEvents();
    }

    showLoading() {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading articles...</p>
            </div>
        `;
    }

    hideLoading() {
        // Loading will be replaced by article rendering
    }

    getSampleData() {
        // Your existing sample data here
        return [
            // ... sample articles
        ];
    }

    // Rest of your existing methods...
}
```

## CSS for Loading States

Add this CSS to your `style.css`:

```css
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: var(--color-text-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    background: rgba(var(--color-error-rgb), 0.1);
    border: 1px solid rgba(var(--color-error-rgb), 0.2);
    color: var(--color-error);
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: center;
}
```

## Implementation Notes

1. **Rate Limiting**: GitHub API has rate limits (60 requests per hour for unauthenticated requests)
2. **Caching**: Consider implementing local storage caching to reduce API calls
3. **Error Handling**: The code includes fallbacks to sample data if GitHub API fails
4. **Date Parsing**: Handles various date formats including relative dates
5. **Source Extraction**: Automatically categorizes sources based on domain mapping

## Advanced Features

You can extend this further by adding:
- **Webhook Integration**: Auto-update when new files are pushed
- **GitHub Actions**: Process markdown files server-side
- **Progressive Web App**: Offline reading capabilities
- **Real-time Updates**: Check for new articles periodically