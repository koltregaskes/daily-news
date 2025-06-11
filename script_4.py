# Show the content of one of the markdown files as an example
with open('2025_06_10.md', 'r', encoding='utf-8') as f:
    content = f.read()

print("Content of 2025_06_10.md:")
print("=" * 50)
print(content)

print("\n" + "=" * 50)
print("\nContent of 2025_06_07.md (No news example):")
print("=" * 50)

with open('2025_06_07.md', 'r', encoding='utf-8') as f:
    content = f.read()

print(content)