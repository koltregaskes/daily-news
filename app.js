// Daily AI News Application
class DailyNewsApp {
    constructor() {
        // Sample articles data (in production, this would come from parsing MD files)
        this.articles = [
            {
                title: "Meta-Scale AI Deal Could Mean Cursor's Explosive Revenue",
                date: "2025-06-09T07:00:00Z",
                dateText: "09 June 2025, 7:00am",
                url: "https://www.theinformation.com/articles/meta-scale-ai-deal-mean-cursors-explosive-revenue",
                source: "The Information",
                filename: "2025_06_09.md"
            },
            {
                title: "Still No AI-powered, 'More Personalized' Siri from Apple at WWDC 2025",
                date: "2025-06-09T14:00:00Z",
                dateText: "Published: 2 hours ago",
                url: "https://techcrunch.com/2025/06/09/still-no-ai-powered-more-personalized-siri-from-apple-at-wwdc-25/",
                source: "TechCrunch",
                filename: "2025_06_09.md"
            },
            {
                title: "AI can 'level up' opportunities for dyslexic children, says UK tech secretary",
                date: "2025-06-10T00:00:00Z",
                dateText: "10 June 2025, 12:00am",
                url: "https://www.theguardian.com/technology/2025/jun/10/ai-can-level-up-opportunities-for-dyslexic-children-says-uk-tech-secretary",
                source: "The Guardian",
                filename: "2025_06_10.md"
            },
            {
                title: "OpenAI's New Model Shows Promise in Reasoning Tasks",
                date: "2025-06-11T09:30:00Z",
                dateText: "11 June 2025, 9:30am",
                url: "https://techcrunch.com/2025/06/11/openai-new-model-reasoning-tasks",
                source: "TechCrunch",
                filename: "2025_06_11.md"
            },
            {
                title: "Google Announces Breakthrough in Quantum Computing",
                date: "2025-06-11T14:15:00Z",
                dateText: "11 June 2025, 2:15pm",
                url: "https://www.nature.com/articles/quantum-computing-breakthrough-2025",
                source: "Nature",
                filename: "2025_06_11.md"
            },
            {
                title: "EU Proposes New Regulations for AI Development",
                date: "2025-06-10T16:45:00Z",
                dateText: "10 June 2025, 4:45pm",
                url: "https://www.reuters.com/technology/artificial-intelligence/eu-ai-regulations-2025",
                source: "Reuters",
                filename: "2025_06_10.md"
            },
            {
                title: "Microsoft Copilot Gets Major Update with Enhanced Reasoning",
                date: "2025-06-11T11:20:00Z",
                dateText: "11 June 2025, 11:20am",
                url: "https://techcrunch.com/2025/06/11/microsoft-copilot-enhanced-reasoning",
                source: "TechCrunch",
                filename: "2025_06_11.md"
            },
            {
                title: "Stanford Research Reveals New Insights into AI Safety",
                date: "2025-06-10T13:30:00Z",
                dateText: "10 June 2025, 1:30pm",
                url: "https://news.mit.edu/2025/stanford-ai-safety-research",
                source: "MIT News",
                filename: "2025_06_10.md"
            }
        ];

        this.filteredArticles = [...this.articles];
        this.searchInstance = null;
        this.activeFilters = {
            search: '',
            dateRange: { start: null, end: null },
            sources: new Set(),
            quickFilter: 'all'
        };

        this.init();
    }

    init() {
        this.setupSearch();
        this.setupEventListeners();
        this.setupSourceFilters();
        this.setupArchiveLinks();
        this.renderArticles();
        this.renderHeroArticles();
        this.updateResultsCount();
    }

    setupSearch() {
        const options = {
            keys: ['title', 'source'],
            threshold: 0.4,
            includeScore: true
        };
        this.searchInstance = new Fuse(this.articles, options);
    }

    setupEventListeners() {
        // Search input with debouncing
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.activeFilters.search = e.target.value.trim();
                this.applyFilters();
            }, 300);
        });

        // Date filters
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        startDate.addEventListener('change', (e) => {
            this.activeFilters.dateRange.start = e.target.value ? new Date(e.target.value) : null;
            this.applyFilters();
        });

        endDate.addEventListener('change', (e) => {
            this.activeFilters.dateRange.end = e.target.value ? new Date(e.target.value + 'T23:59:59') : null;
            this.applyFilters();
        });

        // Quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeFilters.quickFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('toggleTheme');
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
    }

    setupSourceFilters() {
        const sources = [...new Set(this.articles.map(article => article.source))].sort();
        const sourceFiltersContainer = document.getElementById('sourceFilters');
        
        sourceFiltersContainer.innerHTML = sources.map(source => `
            <label class="source-filter">
                <input type="checkbox" value="${source}" class="source-checkbox">
                <span>${source}</span>
            </label>
        `).join('');

        // Add event listeners to source checkboxes
        document.querySelectorAll('.source-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.activeFilters.sources.add(e.target.value);
                } else {
                    this.activeFilters.sources.delete(e.target.value);
                }
                this.applyFilters();
            });
        });
    }

    setupArchiveLinks() {
        const dates = [...new Set(this.articles.map(article => {
            const date = new Date(article.date);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }))].sort().reverse();

        const archiveLinksContainer = document.getElementById('archiveLinks');
        archiveLinksContainer.innerHTML = dates.map(date => {
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return `
                <a href="#" class="archive-link" data-date="${date}">
                    ${formattedDate}
                </a>
            `;
        }).join('');

        // Add event listeners to archive links
        document.querySelectorAll('.archive-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedDate = e.target.dataset.date;
                document.getElementById('startDate').value = selectedDate;
                document.getElementById('endDate').value = selectedDate;
                this.activeFilters.dateRange.start = new Date(selectedDate);
                this.activeFilters.dateRange.end = new Date(selectedDate + 'T23:59:59');
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        let filtered = [...this.articles];

        // Search filter
        if (this.activeFilters.search) {
            const searchResults = this.searchInstance.search(this.activeFilters.search);
            filtered = searchResults.map(result => result.item);
        }

        // Date range filter
        if (this.activeFilters.dateRange.start || this.activeFilters.dateRange.end) {
            filtered = filtered.filter(article => {
                const articleDate = new Date(article.date);
                const start = this.activeFilters.dateRange.start;
                const end = this.activeFilters.dateRange.end;
                
                if (start && end) {
                    return articleDate >= start && articleDate <= end;
                } else if (start) {
                    return articleDate >= start;
                } else if (end) {
                    return articleDate <= end;
                }
                return true;
            });
        }

        // Source filter
        if (this.activeFilters.sources.size > 0) {
            filtered = filtered.filter(article => 
                this.activeFilters.sources.has(article.source)
            );
        }

        // Quick filters
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const threeDaysAgo = new Date(todayStart);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        switch (this.activeFilters.quickFilter) {
            case 'today':
                filtered = filtered.filter(article => {
                    const articleDate = new Date(article.date);
                    return articleDate >= todayStart;
                });
                break;
            case 'recent':
                filtered = filtered.filter(article => {
                    const articleDate = new Date(article.date);
                    return articleDate >= threeDaysAgo;
                });
                break;
            // 'all' doesn't filter anything
        }

        this.filteredArticles = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.renderArticles();
        this.updateResultsCount();
        this.showFilterStatus();
    }

    showFilterStatus() {
        // Show visual feedback when filters are active
        const activeFilterCount = 
            (this.activeFilters.search ? 1 : 0) +
            (this.activeFilters.dateRange.start || this.activeFilters.dateRange.end ? 1 : 0) +
            (this.activeFilters.sources.size > 0 ? 1 : 0) +
            (this.activeFilters.quickFilter !== 'all' ? 1 : 0);

        const searchInput = document.getElementById('searchInput');
        if (activeFilterCount > 0) {
            searchInput.style.borderColor = 'var(--color-primary)';
        } else {
            searchInput.style.borderColor = '';
        }
    }

    renderHeroArticles() {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayArticles = this.articles
            .filter(article => new Date(article.date) >= todayStart)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2);

        const heroContainer = document.getElementById('heroArticles');
        
        if (todayArticles.length === 0) {
            // Show recent articles instead if no today articles
            const recentArticles = this.articles
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 2);
            
            heroContainer.innerHTML = recentArticles.map(article => 
                this.createArticleCard(article, true)
            ).join('');
        } else {
            heroContainer.innerHTML = todayArticles.map(article => 
                this.createArticleCard(article, true)
            ).join('');
        }
    }

    renderArticles() {
        const articlesContainer = document.getElementById('articlesGrid');
        
        if (this.filteredArticles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search terms or filters.</p>
                    <button class="btn btn--primary" onclick="window.app.clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }

        articlesContainer.innerHTML = this.filteredArticles.map(article => 
            this.createArticleCard(article, false)
        ).join('');
    }

    clearFilters() {
        // Reset all filters
        this.activeFilters = {
            search: '',
            dateRange: { start: null, end: null },
            sources: new Set(),
            quickFilter: 'all'
        };

        // Reset UI elements
        document.getElementById('searchInput').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.querySelectorAll('.source-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        this.applyFilters();
    }

    createArticleCard(article, isHero = false) {
        const relativeTime = this.getRelativeTime(new Date(article.date));
        const heroClass = isHero ? 'article-card--hero' : '';
        
        return `
            <article class="article-card ${heroClass}">
                <h3 class="article-card__title">${article.title}</h3>
                <div class="article-card__meta">
                    <time class="article-card__date" datetime="${article.date}">
                        <i class="fas fa-clock"></i>
                        ${relativeTime}
                    </time>
                    <span class="article-card__source">${article.source}</span>
                </div>
                <a href="${article.url}" target="_blank" class="article-card__link" rel="noopener noreferrer">
                    Read full article
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </article>
        `;
    }

    getRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        const count = this.filteredArticles.length;
        const total = this.articles.length;
        
        if (count === total) {
            resultsCount.textContent = `Showing all ${total} articles`;
        } else {
            resultsCount.textContent = `Showing ${count} of ${total} articles`;
        }
    }

    toggleTheme() {
        const currentScheme = document.documentElement.getAttribute('data-color-scheme');
        const newScheme = currentScheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newScheme);
        localStorage.setItem('color-scheme', newScheme);
    }

    initTheme() {
        const savedScheme = localStorage.getItem('color-scheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const scheme = savedScheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-color-scheme', scheme);
    }
}

// Utility functions for parsing markdown files (for future implementation)
class MarkdownParser {
    static parseNewsFile(content) {
        const articles = [];
        const lines = content.split('\n');
        let currentArticle = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for article title (bold text)
            if (line.startsWith('**') && line.endsWith('**')) {
                if (currentArticle) {
                    articles.push(currentArticle);
                }
                currentArticle = {
                    title: line.slice(2, -2).trim(),
                    date: null,
                    dateText: '',
                    url: '',
                    source: ''
                };
            }
            // Check for date line
            else if (currentArticle && line && !line.startsWith('[') && !line.startsWith('http')) {
                currentArticle.dateText = line;
                currentArticle.date = this.parseDate(line);
            }
            // Check for URL line
            else if (currentArticle && line.startsWith('[') && line.includes('](')) {
                const urlMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (urlMatch) {
                    currentArticle.url = urlMatch[2];
                    currentArticle.source = this.extractSource(urlMatch[2]);
                }
            }
        }
        
        if (currentArticle) {
            articles.push(currentArticle);
        }
        
        return articles;
    }
    
    static parseDate(dateString) {
        // Handle various date formats
        const patterns = [
            /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4}),?\s*(\d{1,2}):(\d{2})(am|pm)?/i,
            /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4}),?\s*(\d{1,2}):(\d{2})(am|pm)?/i,
            /Published:\s*(\d+)\s*(hour|minute)s?\s*ago/i,
            /(\d+)\s*(hour|minute)s?\s*ago/i
        ];
        
        for (const pattern of patterns) {
            const match = dateString.match(pattern);
            if (match) {
                if (match[0].includes('ago')) {
                    const value = parseInt(match[1]);
                    const unit = match[2];
                    const now = new Date();
                    if (unit.startsWith('hour')) {
                        now.setHours(now.getHours() - value);
                    } else if (unit.startsWith('minute')) {
                        now.setMinutes(now.getMinutes() - value);
                    }
                    return now.toISOString();
                } else {
                    // Try to parse the date normally
                    try {
                        return new Date(dateString).toISOString();
                    } catch {
                        return new Date().toISOString(); // fallback to now
                    }
                }
            }
        }
        
        return new Date().toISOString(); // fallback to now
    }
    
    static extractSource(url) {
        const domain = new URL(url).hostname.replace('www.', '');
        const sourceMap = {
            'theinformation.com': 'The Information',
            'techcrunch.com': 'TechCrunch',
            'reuters.com': 'Reuters',
            'wsj.com': 'Wall Street Journal',
            'bloomberg.com': 'Bloomberg',
            'theguardian.com': 'The Guardian',
            'nytimes.com': 'New York Times',
            'nature.com': 'Nature',
            'mit.edu': 'MIT News',
            'economist.com': 'The Economist',
            'bbc.com': 'BBC',
            'theatlantic.com': 'The Atlantic',
            'ft.com': 'Financial Times',
            'wired.com': 'Wired',
            'hbr.org': 'Harvard Business Review',
            'newscientist.com': 'New Scientist'
        };
        
        return sourceMap[domain] || domain.charAt(0).toUpperCase() + domain.slice(1);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DailyNewsApp();
    window.app.initTheme();
});

// Handle theme changes from system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
        document.documentElement.setAttribute('data-color-scheme', e.matches ? 'dark' : 'light');
    }
});