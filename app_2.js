// Article data
const articlesData = {
  "articles": [
    {
      "title": "ChatGPT Enterprise Launches Advanced Code Interpreter",
      "source": "TechCrunch",
      "date": "June 11, 2025",
      "time": "9:00am",
      "url": "https://techcrunch.com/2025/06/11/chatgpt-enterprise-launches-advanced-code-interpreter/",
      "isToday": true
    },
    {
      "title": "Stanford AI Lab Reveals Breakthrough in Multimodal Learning",
      "source": "Stanford HAI",
      "date": "June 11, 2025", 
      "time": "1 hour ago",
      "url": "https://hai.stanford.edu/news/breakthrough-multimodal-learning-2025",
      "isToday": true
    },
    {
      "title": "Still No AI-powered, 'More Personalized' Siri from Apple at WWDC 2025",
      "source": "TechCrunch",
      "date": "June 10, 2025",
      "time": "2 hours ago", 
      "url": "https://techcrunch.com/2025/06/09/still-no-ai-powered-more-personalized-siri-from-apple-at-wwdc-25/",
      "isToday": false
    },
    {
      "title": "Meta-Scale AI Deal Could Mean Cursor's Explosive Revenue",
      "source": "The Information",
      "date": "June 10, 2025",
      "time": "7:00am",
      "url": "https://www.theinformation.com/articles/meta-scale-ai-deal-mean-cursors-explosive-revenue",
      "isToday": false
    },
    {
      "title": "AI can 'level up' opportunities for dyslexic children, says UK tech secretary",
      "source": "The Guardian", 
      "date": "June 10, 2025",
      "time": "12:00am",
      "url": "https://www.theguardian.com/technology/2025/jun/10/ai-can-level-up-opportunities-for-dyslexic-children-says-uk-tech-secretary",
      "isToday": false
    },
    {
      "title": "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
      "source": "TechCrunch",
      "date": "June 4, 2025",
      "time": "9:30am",
      "url": "https://techcrunch.com/2025/06/04/openai-announces-gpt-5-revolutionary-reasoning/",
      "isToday": false
    },
    {
      "title": "Google DeepMind Achieves Breakthrough in Protein Folding Predictions", 
      "source": "Nature",
      "date": "June 5, 2025",
      "time": "11:00am",
      "url": "https://www.nature.com/articles/breakthrough-protein-folding-predictions-2025",
      "isToday": false
    },
    {
      "title": "NVIDIA Stock Soars as H200 Chips See Record Demand",
      "source": "Bloomberg",
      "date": "June 6, 2025", 
      "time": "8:45am",
      "url": "https://www.bloomberg.com/news/nvidia-stock-soars-h200-chips-record-demand",
      "isToday": false
    },
    {
      "title": "No news",
      "source": "Daily AI News",
      "date": "June 7, 2025",
      "time": "N/A",
      "url": "#",
      "isToday": false,
      "isNoNews": true
    }
  ],
  "sources": ["TechCrunch", "The Information", "The Guardian", "Nature", "Bloomberg", "Stanford HAI"],
  "dates": ["June 11, 2025", "June 10, 2025", "June 9, 2025", "June 8, 2025", "June 7, 2025", "June 6, 2025", "June 5, 2025", "June 4, 2025"]
};

// Global variables
let filteredArticles = [...articlesData.articles];
let currentSearchTerm = '';
let currentDateFilter = 'all';
let currentSourceFilter = 'all';

// DOM elements
const searchInput = document.getElementById('searchInput');
const dateFilter = document.getElementById('dateFilter');
const sourceFilter = document.getElementById('sourceFilter');
const todayHighlights = document.getElementById('todayHighlights');
const allNewsGrid = document.getElementById('allNewsGrid');
const articleCount = document.getElementById('articleCount');
const noResults = document.getElementById('noResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    renderArticles();
    setupEventListeners();
});

// Initialize filter dropdowns
function initializeFilters() {
    // Populate date filter
    articlesData.dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        dateFilter.appendChild(option);
    });

    // Populate source filter
    articlesData.sources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = source;
        sourceFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    dateFilter.addEventListener('change', handleDateFilter);
    sourceFilter.addEventListener('change', handleSourceFilter);
}

// Handle search functionality
function handleSearch(event) {
    currentSearchTerm = event.target.value.toLowerCase().trim();
    applyFilters();
}

// Handle date filter
function handleDateFilter(event) {
    currentDateFilter = event.target.value;
    applyFilters();
}

// Handle source filter
function handleSourceFilter(event) {
    currentSourceFilter = event.target.value;
    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredArticles = articlesData.articles.filter(article => {
        // Search filter
        const matchesSearch = currentSearchTerm === '' || 
            article.title.toLowerCase().includes(currentSearchTerm) ||
            article.source.toLowerCase().includes(currentSearchTerm);

        // Date filter
        const matchesDate = currentDateFilter === 'all' || 
            article.date === currentDateFilter;

        // Source filter
        const matchesSource = currentSourceFilter === 'all' || 
            article.source === currentSourceFilter;

        return matchesSearch && matchesDate && matchesSource;
    });

    renderArticles();
}

// Render all articles
function renderArticles() {
    renderTodayHighlights();
    renderAllNews();
    updateArticleCount();
}

// Render today's highlights
function renderTodayHighlights() {
    const todayArticles = filteredArticles.filter(article => article.isToday && !article.isNoNews);
    
    if (todayArticles.length === 0) {
        todayHighlights.innerHTML = '<p class="no-highlights">No highlights for today</p>';
        return;
    }

    todayHighlights.innerHTML = todayArticles.map(article => `
        <div class="highlight-card">
            <div class="highlight-card__source">
                <i class="fas fa-bolt"></i>
                ${article.source}
            </div>
            <h3 class="highlight-card__title">
                <a href="${article.url}" target="_blank">${article.title}</a>
            </h3>
            <div class="highlight-card__meta">
                <div class="highlight-card__time">
                    <i class="fas fa-clock"></i>
                    ${article.time}
                </div>
                <a href="${article.url}" target="_blank" class="highlight-card__link">
                    Read more <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Render all news
function renderAllNews() {
    // First check if we have any articles to display
    if (filteredArticles.length === 0) {
        allNewsGrid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    // We have articles, so hide the "no results" message
    noResults.classList.add('hidden');
    
    // Render all the articles
    allNewsGrid.innerHTML = filteredArticles.map(article => {
        if (article.isNoNews) {
            return createNoNewsCard(article);
        }
        return createNewsCard(article);
    }).join('');
}

// Create a regular news card
function createNewsCard(article) {
    const sourceClass = getSourceClass(article.source);
    
    return `
        <div class="news-card">
            <div class="news-card__header">
                <div class="news-card__date">${article.date}</div>
                <div class="news-card__source ${sourceClass}">${article.source}</div>
            </div>
            <h3 class="news-card__title">
                <a href="${article.url}" target="_blank">${article.title}</a>
            </h3>
            <div class="news-card__meta">
                <div class="news-card__time">
                    <i class="fas fa-clock"></i>
                    ${article.time}
                </div>
                <a href="${article.url}" target="_blank" class="news-card__link">
                    Read more <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

// Create a "no news" card
function createNoNewsCard(article) {
    return `
        <div class="no-news-card">
            <div class="no-news-card__icon">
                <i class="fas fa-calendar-times"></i>
            </div>
            <h3 class="no-news-card__title">${article.date}</h3>
            <p class="no-news-card__message">No AI news reported on this day</p>
        </div>
    `;
}

// Get CSS class for source badge
function getSourceClass(source) {
    const sourceMap = {
        'TechCrunch': 'source-techcrunch',
        'The Information': 'source-theinformation',
        'The Guardian': 'source-theguardian',
        'Nature': 'source-nature',
        'Bloomberg': 'source-bloomberg',
        'Stanford HAI': 'source-stanfordhai',
        'Daily AI News': 'source-dailyainews'
    };
    
    return sourceMap[source] || 'source-default';
}

// Update article count display
function updateArticleCount() {
    const count = filteredArticles.length;
    const regularArticles = filteredArticles.filter(article => !article.isNoNews).length;
    const noNewsCount = filteredArticles.filter(article => article.isNoNews).length;
    
    let countText = '';
    if (regularArticles > 0 && noNewsCount > 0) {
        countText = `${regularArticles} articles, ${noNewsCount} no-news days`;
    } else if (regularArticles > 0) {
        countText = `${regularArticles} articles`;
    } else if (noNewsCount > 0) {
        countText = `${noNewsCount} no-news days`;
    } else {
        countText = '0 articles';
    }
    
    articleCount.textContent = countText;
}

// Add markdown file loading functionality
function loadMarkdownFiles() {
    // This is a placeholder function to demonstrate how markdown files would be loaded
    // In a real implementation, this would use fetch() to load .md files from the server
    
    console.log("In a real implementation, this function would load markdown files with names like 2025_06_11.md");
    
    // The .md files would be structured like:
    // **Title of the Article**  
    // Published: time  
    // [URL](url)
    
    // After loading these files, they would be parsed to extract the title, time, and URL
    // Then the articles array would be populated with this data
}

// Add support for toggling between light and dark mode
function setupThemeToggle() {
    // This function would normally add a theme toggle button
    // For this demo, we'll just respect the user's system preference
    
    // Check if the user has a preference for dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the appropriate theme
    document.documentElement.setAttribute('data-color-scheme', prefersDarkMode ? 'dark' : 'light');
    
    // Listen for changes in the user's preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        document.documentElement.setAttribute('data-color-scheme', e.matches ? 'dark' : 'light');
    });
}

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state for search
    let searchTimeout;
    const originalHandleSearch = handleSearch;
    
    handleSearch = function(event) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            originalHandleSearch(event);
        }, 300); // Debounce search
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Focus search on Ctrl+F or Cmd+F
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            searchInput.focus();
        }
        
        // Clear search on Escape
        if (event.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            currentSearchTerm = '';
            applyFilters();
        }
    });
    
    // Set up theme toggle
    setupThemeToggle();
    
    // Initialize markdown file loading functionality
    // Note: this is just a placeholder to show where this would happen
    // loadMarkdownFiles();
});