# Daily News Website - GitHub Pages Setup Guide

## Overview
This guide will help you deploy your beautiful daily news website to GitHub Pages. The website features modern design, responsive layout, search functionality, date filtering, and automatic source categorization.

## Files to Upload to Your Repository

### Required Files
1. `index.html` - Main HTML file
2. `style.css` - CSS styling
3. `app.js` - JavaScript functionality
4. `README.md` - Documentation (optional but recommended)

## Setup Instructions

### Step 1: Prepare Your Repository
1. Go to your `daily-news` repository on GitHub
2. Create a new branch called `gh-pages` (recommended) or use `main` branch
3. Upload the three files (`index.html`, `style.css`, `app.js`) to the root directory

### Step 2: Enable GitHub Pages
1. Go to your repository settings
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Choose your branch (`gh-pages` or `main`)
5. Select "/ (root)" as the folder
6. Click "Save"

### Step 3: Access Your Website
Your website will be available at:
`https://koltregaskes.github.io/daily-news/`

## How the Website Works

### Automatic Markdown Parsing
The website is designed to automatically parse your markdown files. Currently, it includes sample data, but you can modify the `app.js` file to:

1. **Fetch Real Data**: Add code to fetch your actual `.md` files from the repository
2. **Parse Markdown**: Extract article titles, dates, and URLs from your markdown format
3. **Auto-categorize**: Automatically categorize articles by source domain

### Key Features
- **Today's Highlights**: Automatically highlights today's news at the top
- **Search**: Real-time search through all articles
- **Date Filtering**: Filter articles by date range
- **Source Categories**: Automatically extracted from URLs
- **Responsive Design**: Works perfectly on mobile and desktop
- **Archive**: Browse articles by date

## Customization Options

### Adding Real Data Integration
To make the website automatically read from your markdown files, you'll need to:

1. **GitHub API Integration**: Use GitHub's API to fetch markdown files
2. **Markdown Parser**: Parse the markdown content to extract articles
3. **Automatic Updates**: Set up to refresh data periodically

### Modifying the Design
- **Colors**: Edit CSS variables in `style.css`
- **Typography**: Change font families and sizes
- **Layout**: Modify grid layouts and spacing
- **Add Features**: Additional filters, bookmarking, etc.

## Advanced Features to Add

### 1. Automatic GitHub Integration
```javascript
// Example: Fetch markdown files from GitHub API
async function fetchMarkdownFiles() {
    const response = await fetch('https://api.github.com/repos/koltregaskes/daily-news/contents/');
    const files = await response.json();
    const markdownFiles = files.filter(file => file.name.endsWith('.md'));
    // Process files...
}
```

### 2. Enhanced Search
- Add tags support
- Full-text search
- Search history
- Search suggestions

### 3. User Preferences
- Dark/light mode toggle
- Preferred sources
- Reading list/bookmarks
- Notification settings

### 4. Social Features
- Share articles
- Comment system (using GitHub issues)
- Newsletter signup
- Social media integration

## Maintenance

### Adding New Articles
1. Continue adding dated `.md` files to your repository
2. The website will automatically parse and display them (once integrated)
3. Articles are automatically categorized by source

### Updating Design
1. Modify `style.css` for styling changes
2. Update `app.js` for functionality changes
3. Changes will be live within minutes on GitHub Pages

## Technical Notes

### Performance
- The website is optimized for fast loading
- Uses modern CSS Grid and Flexbox
- Minimal dependencies (only Font Awesome for icons)
- Client-side rendering for instant filtering

### SEO Optimization
- Semantic HTML structure
- Meta tags for better search indexing
- Structured data for news articles
- Mobile-friendly responsive design

### Browser Compatibility
- Works in all modern browsers
- Progressive enhancement approach
- Fallbacks for older browsers

## Troubleshooting

### Common Issues
1. **Site not loading**: Check if files are in the root directory
2. **Styling issues**: Ensure `style.css` is in the same folder as `index.html`
3. **JavaScript not working**: Check browser console for errors
4. **GitHub Pages not updating**: It can take a few minutes to deploy changes

### Support
For issues or questions:
1. Check GitHub Pages documentation
2. Review browser console for errors
3. Test locally by opening `index.html` in your browser
4. Ensure all file paths are correct

## Next Steps

1. **Deploy the basic version** using the provided files
2. **Test the functionality** to ensure everything works
3. **Customize the design** to match your preferences
4. **Integrate with your actual markdown files** for automatic updates
5. **Add advanced features** as needed

Your news website will be a professional, fast, and beautiful way to showcase your daily AI news curation!