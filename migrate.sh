#!/bin/bash

# Check if directory argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

TARGET_DIR="$1"

# Create Python script for processing
cat > process_md.py << 'EOL'
import sys
import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def is_url(text):
    text = text.strip()
    try:
        result = urlparse(text)
        return all([result.scheme, result.netloc])
    except:
        return False

def process_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    if not is_url(content):
        return
    
    url = content.strip()
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1', id='title-text')
        title = title_elem.get_text() if title_elem else ''
        
        # Extract main content
        main_content = soup.find('div', id='main-content')
        content_html = str(main_content) if main_content else ''
        
        # Generate slug from title
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
        
        # Create front matter
        front_matter = f"""---
slug: '{slug}'
title: '{title}'
hide_title: true
keywords: []
description: ''
---

{content_html}"""
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(front_matter)
            
        print(f"Processed: {file_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python process_md.py <markdown_file>")
        sys.exit(1)
        
    md_file = sys.argv[1]
    if os.path.isfile(md_file) and md_file.endswith('.md'):
        process_markdown_file(md_file)

if __name__ == "__main__":
    main()
EOL

# Install required Python packages
pip3 install requests beautifulsoup4

# Find all markdown files and process them
find "$TARGET_DIR" -name "*.md" -type f | while read -r file; do
    python3 process_md.py "$file"
done
