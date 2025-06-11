class DailyNewsApp {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.sources = new Set();
        this.dates = new Set();
        this.tags = new Set();

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
        const dateMatch = filename.match(/(\d{4})_(\d{2})_(\d{2})\.md/);
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
        const cleaned = content.split('\n').filter(line => {
            return !line.includes('```hrp-text') && !line.toLowerCase().includes('thinking');
        }).join('\n');

        const sections = cleaned.split('\n\n').filter(section => section.trim());

        for (const section of sections) {
            const lines = section.split('\n').filter(line => line.trim());
            if (lines.length >= 3) {
                // Extract title (remove ** markdown)
                const titleMatch = lines[0].match(/\*\*(.+?)\*\*/);
                const title = titleMatch ? titleMatch[1] : lines[0];

                // Extract time
                const time = lines[1].trim();

                // Extract URL
                const urlMatch = lines[2].match(/\[(.+?)\]\((.+?)\)/);
                const url = urlMatch ? urlMatch[2] : '';
                const urlText = urlMatch ? urlMatch[1] : url;

                // Extract source from URL
                const source = this.extractSource(url);

                const tags = Array.from(new Set(title.toLowerCase()
                    .replace(/[^a-z0-9 ]/g, '')
                    .split(' ') 
                    .filter(Boolean))).slice(0,5);
                tags.forEach(t => this.tags.add(t));

                articles.push({
                    title,
                    time,
                    url,
                    urlText,
                    source,
                    date: fileDate,
                    dateString: dateString,
                    filename: filename,
                    tags,
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
        const sourceContainer = document.getElementById('sourceCheckboxes');
        const archivePicker = document.getElementById('archivePicker');

        const sortedSources = Array.from(this.sources).sort();
        sourceContainer.innerHTML = '';
        sortedSources.forEach(source => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${source}" checked> ${source}`;
            sourceContainer.appendChild(label);
        });

        const months = new Set(Array.from(this.dates).map(d => {
            const dt = new Date(d);
            return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
        }));

        archivePicker.innerHTML = '<option value="">All Months</option>';
        Array.from(months).sort().forEach(m => {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m;
            archivePicker.appendChild(option);
        });
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');
        const sourceContainer = document.getElementById('sourceCheckboxes');
        const archivePicker = document.getElementById('archivePicker');
        const quickToday = document.getElementById('quickToday');
        const quickLastWeek = document.getElementById('quickLastWeek');
        const quickAll = document.getElementById('quickAll');

        searchInput.addEventListener('input', () => this.filterArticles());
        fromDate.addEventListener('change', () => this.filterArticles());
        toDate.addEventListener('change', () => this.filterArticles());
        sourceContainer.addEventListener('change', () => this.filterArticles());
        archivePicker.addEventListener('change', () => this.filterArticles());

        quickToday.addEventListener('click', () => {
            const today = new Date().toISOString().split('T')[0];
            fromDate.value = today;
            toDate.value = today;
            archivePicker.value = '';
            this.filterArticles();
        });

        quickLastWeek.addEventListener('click', () => {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            fromDate.value = lastWeek.toISOString().split('T')[0];
            toDate.value = today.toISOString().split('T')[0];
            archivePicker.value = '';
            this.filterArticles();
        });

        quickAll.addEventListener('click', () => {
            fromDate.value = '';
            toDate.value = '';
            archivePicker.value = '';
            this.filterArticles();
        });
    }

    filterArticles() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const archive = document.getElementById('archivePicker').value;
        const selectedSources = Array.from(document.querySelectorAll('#sourceCheckboxes input:checked')).map(i => i.value);

        this.filteredArticles = this.articles.filter(article => {
            const articleDate = new Date(article.date);

            const matchesSearch = !searchTerm ||
                article.title.toLowerCase().includes(searchTerm);

            let matchesRange = true;
            if (fromDate) matchesRange = matchesRange && articleDate >= new Date(fromDate);
            if (toDate) matchesRange = matchesRange && articleDate <= new Date(toDate);

            let matchesArchive = true;
            if (archive) {
                const [year, month] = archive.split('-');
                matchesArchive = articleDate.getFullYear() === parseInt(year) && (articleDate.getMonth()+1) === parseInt(month);
            }

            const matchesSource = selectedSources.length === 0 || selectedSources.includes(article.source);

            return matchesSearch && matchesRange && matchesArchive && matchesSource;
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
                <div class="tag-list">
                    ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            `;
        }

        return card;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyNewsApp();
});