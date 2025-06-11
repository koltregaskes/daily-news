# Create dummy markdown files for the dates shown in the screenshot
import os
from datetime import datetime, timedelta

# Create dummy AI news stories for each date
dummy_news_data = {
    "2025_06_04": [
        {
            "title": "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
            "time": "June 4, 2025, 9:30am",
            "url": "https://techcrunch.com/2025/06/04/openai-announces-gpt-5-revolutionary-reasoning/"
        },
        {
            "title": "Microsoft Copilot Integration Reaches 500 Million Users",
            "time": "Published: 3 hours ago",
            "url": "https://www.theinformation.com/articles/microsoft-copilot-integration-reaches-500-million-users"
        },
        {
            "title": "EU AI Act Implementation Begins with First Company Audits",
            "time": "04 June 2025, 2:15pm",
            "url": "https://www.reuters.com/technology/artificial-intelligence/eu-ai-act-implementation-begins-first-audits"
        }
    ],
    "2025_06_05": [
        {
            "title": "Google DeepMind Achieves Breakthrough in Protein Folding Predictions",
            "time": "June 5, 2025, 11:00am",
            "url": "https://www.nature.com/articles/breakthrough-protein-folding-predictions-2025"
        },
        {
            "title": "Meta's Llama 3.5 Outperforms GPT-4 in Mathematical Reasoning",
            "time": "Published: 5 hours ago",
            "url": "https://www.theinformation.com/articles/meta-llama-3-5-outperforms-gpt-4-mathematical-reasoning"
        }
    ],
    "2025_06_06": [
        {
            "title": "NVIDIA Stock Soars as H200 Chips See Record Demand",
            "time": "June 6, 2025, 8:45am",
            "url": "https://www.bloomberg.com/news/nvidia-stock-soars-h200-chips-record-demand"
        },
        {
            "title": "Anthropic's Claude 3.5 Sonnet Shows Improved Safety Measures",
            "time": "06 June 2025, 1:30pm",
            "url": "https://techcrunch.com/2025/06/06/anthropic-claude-3-5-sonnet-improved-safety-measures/"
        },
        {
            "title": "AI Regulation Summit: Global Leaders Agree on Safety Standards",
            "time": "Published: 7 hours ago",
            "url": "https://www.wsj.com/tech/ai/global-leaders-agree-ai-safety-standards"
        }
    ],
    "2025_06_07": [
        {
            "title": "No news"
        }
    ],
    "2025_06_08": [
        {
            "title": "Stability AI Releases SDXL 2.0 with Enhanced Image Generation",
            "time": "June 8, 2025, 10:15am",
            "url": "https://techcrunch.com/2025/06/08/stability-ai-releases-sdxl-2-enhanced-image-generation/"
        },
        {
            "title": "MIT Researchers Develop AI Model for Drug Discovery",
            "time": "08 June 2025, 3:45pm",
            "url": "https://news.mit.edu/2025/ai-model-drug-discovery-breakthrough"
        }
    ],
    "2025_06_09": [
        {
            "title": "Apple Intelligence Beta Shows Promising Siri Improvements",
            "time": "Published: 4 hours ago",
            "url": "https://www.theguardian.com/technology/2025/jun/09/apple-intelligence-beta-siri-improvements"
        },
        {
            "title": "ByteDance Faces New AI Scrutiny from US Commerce Department",
            "time": "June 9, 2025, 7:20am",
            "url": "https://www.reuters.com/technology/bytedance-faces-ai-scrutiny-us-commerce"
        },
        {
            "title": "Robotics Startup Raises $200M for AI-Powered Manufacturing",
            "time": "09 June 2025, 12:00pm",
            "url": "https://www.bloomberg.com/news/robotics-startup-raises-200m-ai-manufacturing"
        }
    ],
    "2025_06_10": [
        {
            "title": "Still No AI-powered, 'More Personalized' Siri from Apple at WWDC 2025",
            "time": "Published: 2 hours ago",
            "url": "https://techcrunch.com/2025/06/09/still-no-ai-powered-more-personalized-siri-from-apple-at-wwdc-25/"
        },
        {
            "title": "Meta-Scale AI Deal Could Mean Cursor's Explosive Revenue",
            "time": "10 June 2025, 7:00am",
            "url": "https://www.theinformation.com/articles/meta-scale-ai-deal-mean-cursors-explosive-revenue"
        },
        {
            "title": "AI can 'level up' opportunities for dyslexic children, says UK tech secretary",
            "time": "10 June 2025, 12:00am",
            "url": "https://www.theguardian.com/technology/2025/jun/10/ai-can-level-up-opportunities-for-dyslexic-children-says-uk-tech-secretary"
        }
    ],
    "2025_06_11": [
        {
            "title": "ChatGPT Enterprise Launches Advanced Code Interpreter",
            "time": "June 11, 2025, 9:00am",
            "url": "https://techcrunch.com/2025/06/11/chatgpt-enterprise-launches-advanced-code-interpreter/"
        },
        {
            "title": "Stanford AI Lab Reveals Breakthrough in Multimodal Learning",
            "time": "Published: 1 hour ago",
            "url": "https://hai.stanford.edu/news/breakthrough-multimodal-learning-2025"
        }
    ]
}

# Create the markdown files
for date, stories in dummy_news_data.items():
    filename = f"{date}.md"
    content = ""
    
    for story in stories:
        if story["title"] == "No news":
            content = "No news"
            break
        else:
            content += f"**{story['title']}**  \n"
            content += f"{story['time']}  \n"
            content += f"[{story['url']}]({story['url']})\n\n"
    
    # Write the file
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    
    print(f"Created {filename}")

print("\nAll dummy markdown files created successfully!")