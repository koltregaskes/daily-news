# Create the JavaScript file
js_content = """class DailyNewsApp {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.sources = new Set();
        this.dates = new Set();
        
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.displayArticles();
    }

    async loadArticles() {
        // Generate file list based on date range
        const fileList = this.generateFileList();
        
        for (const filename of fileList) {
            try {
                const response = await fetch(filename);
                if (response.ok) {
                    const content = await response.text();
                    const articles = this.parseMarkdown(content, filename);
                    this.articles.push(...articles);
                }
            } catch (error) {
                console.log(`Could not load ${filename}:`, error);
            }
        }

        // Sort articles by date (newest first)
        this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.filteredArticles = [...this.articles];
        
        // Populate filter options
        this.populateFilters();
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
    }

    generateFileList() {
        // Generate list of potential markdown files
        const files = [];
        const today = new Date();
        
        // Generate files for the last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            files.push(`${year}_${month}_${day}.md`);
        }
        
        return files;
    }

    parseMarkdown(content, filename) {
        // Extract date from filename
        const dateMatch = filename.match(/(\\d{4})_(\\d{2})_(\\d{2})\\.md/);
        if (!dateMatch) return [];
        
        const [, year, month, day] = dateMatch;
        const fileDate = new Date(year, month - 1, day);
        const dateString = fileDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Handle "No news" case
        if (content.trim().toLowerCase() === 'no news') {
            return [{
                title: 'No news',
                date: fileDate,
                dateString: dateString,
                filename: filename,
                isNoNews: true
            }];
        }

        // Parse individual articles
        const articles = [];
        const sections = content.split('\\n\\n').filter(section => section.trim());
        
        for (const section of sections) {
            const lines = section.split('\\n').filter(line => line.trim());
            if (lines.length >= 3) {
                // Extract title (remove ** markdown)
                const titleMatch = lines[0].match(/\\*\\*(.+?)\\*\\*/);
                const title = titleMatch ? titleMatch[1] : lines[0];
                
                // Extract time
                const time = lines[1].trim();
                
                // Extract URL
                const urlMatch = lines[2].match(/\\[(.+?)\\]\\((.+?)\\)/);
                const url = urlMatch ? urlMatch[2] : '';
                const urlText = urlMatch ? urlMatch[1] : url;
                
                // Extract source from URL
                const source = this.extractSource(url);
                
                articles.push({
                    title,
                    time,
                    url,
                    urlText,
                    source,
                    date: fileDate,
                    dateString: dateString,
                    filename: filename,
                    isNoNews: false
                });
                
                this.sources.add(source);
            }
        }
        
        this.dates.add(dateString);
        return articles;
    }

    extractSource(url) {
        if (!url) return 'Unknown';
        
        try {
            const hostname = new URL(url).hostname.toLowerCase();
            
            const sourceMap = {
                'techcrunch.com': 'TechCrunch',
                'theinformation.com': 'The Information',
                'reuters.com': 'Reuters',
                'wsj.com': 'Wall Street Journal',
                'bloomberg.com': 'Bloomberg',
                'theguardian.com': 'The Guardian',
                'nytimes.com': 'New York Times',
                'bbc.com': 'BBC',
                'nature.com': 'Nature',
                'mit.edu': 'MIT News',
                'stanford.edu': 'Stanford HAI',
                'wired.com': 'Wired',
                'economist.com': 'The Economist',
                'ft.com': 'Financial Times',
                'theatlantic.com': 'The Atlantic',
                'technologyreview.com': 'MIT Technology Review',
                'hbr.org': 'Harvard Business Review',
                'newscientist.com': 'New Scientist'
            };
            
            for (const [domain, name] of Object.entries(sourceMap)) {
                if (hostname.includes(domain)) {
                    return name;
                }
            }
            
            // Extract domain name as fallback
            return hostname.replace('www.', '').split('.')[0];
        } catch {
            return 'Unknown';
        }
    }

    populateFilters() {
        const dateFilter = document.getElementById('dateFilter');
        const sourceFilter = document.getElementById('sourceFilter');
        
        // Populate date filter
        const sortedDates = Array.from(this.dates).sort((a, b) => new Date(b) - new Date(a));
        sortedDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });
        
        // Populate source filter
        const sortedSources = Array.from(this.sources).sort();
        sortedSources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            sourceFilter.appendChild(option);
        });
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const dateFilter = document.getElementById('dateFilter');
        const sourceFilter = document.getElementById('sourceFilter');

        searchInput.addEventListener('input', () => this.filterArticles());
        dateFilter.addEventListener('change', () => this.filterArticles());
        sourceFilter.addEventListener('change', () => this.filterArticles());
    }

    filterArticles() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedDate = document.getElementById('dateFilter').value;
        const selectedSource = document.getElementById('sourceFilter').value;

        this.filteredArticles = this.articles.filter(article => {
            const matchesSearch = !searchTerm || 
                article.title.toLowerCase().includes(searchTerm);
            
            const matchesDate = !selectedDate || 
                article.dateString === selectedDate;
            
            const matchesSource = !selectedSource || 
                article.source === selectedSource;

            return matchesSearch && matchesDate && matchesSource;
        });

        this.displayArticles();
    }

    displayArticles() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaysArticles = this.filteredArticles.filter(article => {
            const articleDate = new Date(article.date);
            articleDate.setHours(0, 0, 0, 0);
            return articleDate.getTime() === today.getTime();
        });
        
        const otherArticles = this.filteredArticles.filter(article => {
            const articleDate = new Date(article.date);
            articleDate.setHours(0, 0, 0, 0);
            return articleDate.getTime() !== today.getTime();
        });

        // Display today's news
        const todaysSection = document.getElementById('todaysNews');
        const todaysGrid = document.getElementById('todaysGrid');
        
        if (todaysArticles.length > 0) {
            todaysSection.style.display = 'block';
            todaysGrid.innerHTML = '';
            todaysArticles.forEach(article => {
                todaysGrid.appendChild(this.createArticleCard(article, true));
            });
        } else {
            todaysSection.style.display = 'none';
        }

        // Display all news
        const allSection = document.getElementById('allNews');
        const allGrid = document.getElementById('allGrid');
        const noResults = document.getElementById('noResults');
        
        if (this.filteredArticles.length > 0) {
            allSection.style.display = 'block';
            noResults.style.display = 'none';
            
            allGrid.innerHTML = '';
            this.filteredArticles.forEach(article => {
                allGrid.appendChild(this.createArticleCard(article, false));
            });
        } else {
            allSection.style.display = 'none';
            noResults.style.display = 'block';
        }
    }

    createArticleCard(article, isToday) {
        const card = document.createElement('div');
        card.className = `news-card ${isToday ? 'today' : ''} ${article.isNoNews ? 'no-news' : ''}`;

        if (article.isNoNews) {
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-date">${article.dateString}</span>
                </div>
                <h3 class="card-title">No news today</h3>
                <p style="color: var(--text-secondary); font-style: italic;">
                    No significant AI news stories were curated for this date.
                </p>
            `;
        } else {
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-date">${article.dateString}</span>
                    <span class="card-source">${article.source}</span>
                </div>
                <h3 class="card-title">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h3>
                <div class="card-meta">
                    <span class="card-time">
                        <i class="fas fa-clock"></i>
                        ${article.time}
                    </span>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="external-link">
                        Read more <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
        }

        return card;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyNewsApp();
});"""

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Created app.js")