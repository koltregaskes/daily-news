# List all the files created
import os

files = [f for f in os.listdir('.') if f.endswith(('.md', '.html', '.css', '.js'))]
files.sort()

print("Files created for your Daily AI News website:")
print("=" * 50)

# Separate into categories
website_files = [f for f in files if f.endswith(('.html', '.css', '.js'))]
md_files = [f for f in files if f.endswith('.md')]

print("Website Files (upload these to your repo):")
for file in website_files:
    print(f"  ✅ {file}")

print(f"\nDummy Markdown Files ({len(md_files)} files):")
for file in md_files:
    print(f"  📄 {file}")

print("\n" + "=" * 50)
print("Upload Instructions:")
print("1. Upload these 3 website files to your GitHub repo:")
print("   - index.html")
print("   - style.css") 
print("   - app.js")
print("2. Keep the dummy .md files for testing (don't upload them)")
print("3. Enable GitHub Pages in your repo settings")
print("4. Your site will be available at: https://koltregaskes.github.io/daily-news/")

print("\nThe website will automatically:")
print("✅ Find and read all yyyy_mm_dd.md files")  
print("✅ Parse the news stories in your format")
print("✅ Handle 'No news' days properly")
print("✅ Show today's stories prominently")
print("✅ Provide search and filtering")
print("✅ Categorize by news source")
print("✅ Work responsively on mobile devices")