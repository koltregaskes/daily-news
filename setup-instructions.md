# Daily AI News Website - Complete Setup Guide

## 🎯 What You're Getting

I've created a complete, professional Daily AI News website that automatically reads your `yyyy_mm_dd.md` files and displays them beautifully. The website includes all the features you requested plus additional enhancements.

## 📁 Files Created

### Website Files (Upload these to your GitHub repo):
- **`index.html`** - Main website structure
- **`style.css`** - Complete styling and responsive design  
- **`app.js`** - JavaScript that automatically fetches and parses your markdown files

### Dummy Content (For testing only):
- **`2025_06_04.md`** through **`2025_06_11.md`** - 8 dummy markdown files with realistic AI news stories
- Includes examples of regular news days and "No news" days

## ✨ Features Implemented

### Core Features (As Requested):
- ✅ **Automatic MD File Reading** - Fetches all `yyyy_mm_dd.md` files automatically
- ✅ **Today's News Highlighting** - Today's stories prominently displayed at top
- ✅ **Search Functionality** - Real-time search through all articles
- ✅ **Date Filtering** - Filter by specific dates
- ✅ **Source Categorization** - Automatically extracts and categorizes news sources
- ✅ **"No News" Day Handling** - Special styling for days with no news
- ✅ **Responsive Design** - Works perfectly on mobile and desktop

### Additional Features Added:
- 🔍 **Advanced Search** - Search by title, source, or content
- 📱 **Mobile-First Design** - Optimized for all screen sizes
- 🏷️ **Source Badges** - Color-coded tags for each news source
- ⏰ **Flexible Time Parsing** - Handles various date/time formats
- 🎨 **Modern UI/UX** - Clean, professional design
- 🔗 **External Links** - All articles open in new tabs
- ⚡ **Fast Performance** - Client-side processing for instant filtering

## 🚀 Deployment Instructions

1. **Upload Files to GitHub**:
   - Upload `index.html`, `style.css`, and `app.js` to your repo root
   - Commit and push the changes

2. **Enable GitHub Pages**:
   - Go to your repo Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save

3. **Access Your Site**:
   - Your website will be available at: `https://koltregaskes.github.io/daily-news/`
   - It may take a few minutes to deploy

## 📝 How It Works

### Automatic File Discovery:
The JavaScript automatically looks for markdown files with the `yyyy_mm_dd.md` naming pattern. It:
- Generates a list of potential filenames for the last 30 days
- Attempts to fetch each file
- Parses successful downloads
- Handles missing files gracefully

### Markdown Parsing:
For each markdown file, the system:
- Extracts the date from the filename
- Parses news stories in your format:
  ```markdown
  **Story Title**  
  Publication time  
  [URL](URL)
  ```
- Handles "No news" entries
- Automatically categorizes sources from URLs

### Source Recognition:
The system recognizes these major sources and many more:
- TechCrunch, The Information, Reuters
- Wall Street Journal, Bloomberg, The Guardian  
- Nature, MIT News, Stanford HAI
- Wired, BBC, New York Times
- And 40+ other sources from your list

## 🎨 Design Features

### Today's Highlights:
- Special green-bordered cards for today's news
- Prominently displayed at the top
- Only shows if there are stories for today

### Article Cards:
- Clean, modern card design
- Source badges with color coding
- Hover effects and smooth transitions
- Clickable headlines that open original articles
- Publication time and external link indicators

### "No News" Days:
- Special yellow/orange styling
- Clear messaging about no news
- Maintains visual consistency

### Mobile Responsive:
- Stacked layout on mobile devices
- Touch-friendly buttons and links
- Optimized typography for small screens

## 🔧 Customization Options

### Colors and Styling:
- CSS variables make it easy to change colors
- Modern design system with consistent spacing
- Professional typography choices

### Adding New Sources:
The source recognition system can be easily extended by adding new entries to the `sourceMap` in `app.js`.

### Filtering Options:
- Search works across all text content
- Date filtering supports all parsed dates
- Source filtering includes all detected sources

## 📊 Example Markdown Format

Your markdown files should follow this exact format:

```markdown
**OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities**  
June 4, 2025, 9:30am  
[https://techcrunch.com/2025/06/04/openai-announces-gpt-5-revolutionary-reasoning/](https://techcrunch.com/2025/06/04/openai-announces-gpt-5-revolutionary-reasoning/)

**Microsoft Copilot Integration Reaches 500 Million Users**  
Published: 3 hours ago  
[https://www.theinformation.com/articles/microsoft-copilot-integration-reaches-500-million-users](https://www.theinformation.com/articles/microsoft-copilot-integration-reaches-500-million-users)
```

For "No news" days, simply put:
```markdown
No news
```

## 🛠️ Technical Details

- **Framework**: Vanilla JavaScript (no dependencies except Font Awesome icons)
- **Hosting**: GitHub Pages compatible
- **Performance**: Client-side rendering for fast filtering
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **SEO**: Structured HTML with semantic markup

## 📈 Future Enhancement Ideas

- RSS feed generation
- Social sharing buttons  
- Bookmark system
- Dark mode toggle
- Push notifications for new articles
- Analytics integration
- Comment system using GitHub Issues

## 🤝 Support

The code is well-documented and modular. If you need to make changes:
- CSS variables control the visual design
- JavaScript is organized into clear functions
- HTML structure is semantic and accessible

Your Daily AI News website is ready to go live! 🚀