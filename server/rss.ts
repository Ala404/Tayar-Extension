import Parser from 'rss-parser';
import { Article, InsertArticle, Source, Tag } from '@shared/schema';
import { storage } from './storage';
import { log } from './vite';

// Initialize RSS parser
const parser = new Parser({
  headers: {
    'User-Agent': 'Tayar RSS Reader/1.0',
  },
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
    ]
  }
});

// RSS feed sources
const rssSources = [
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com/feed/',
    logoUrl: 'https://css-tricks.com/favicon.ico',
    tags: ['css', 'webdev', 'frontend']
  },
  {
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/news/rss/',
    logoUrl: 'https://www.freecodecamp.org/favicon-32x32.png',
    tags: ['webdev', 'tutorial', 'programming']
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/feed/',
    logoUrl: 'https://dev.to/favicon.ico',
    tags: ['webdev', 'programming', 'development']
  },
  {
    name: 'The GitHub Blog',
    url: 'https://github.blog/feed/',
    logoUrl: 'https://github.githubassets.com/favicons/favicon.png',
    tags: ['github', 'opensource', 'development']
  },
  {
    name: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
    logoUrl: 'https://www.smashingmagazine.com/images/favicon/favicon.png',
    tags: ['design', 'webdev', 'ux']
  },
  {
    name: 'JavaScript Weekly',
    url: 'https://cprss.s3.amazonaws.com/javascriptweekly.com.xml',
    logoUrl: 'https://javascriptweekly.com/favicon.png',
    tags: ['javascript', 'webdev', 'frontend']
  }
];

// Get a safe image URL from feed item
function getImageUrl(item: Parser.Item): string | null {
  // Check for media content
  if (item.media && item.media.$ && item.media.$.url) {
    return item.media.$.url;
  }
  
  // Check for enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  // Try to extract from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  // Try to extract from contentEncoded
  if (item.contentEncoded) {
    const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  
  // Default placeholders based on the feed category
  return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
}

// Estimate read time based on content length
function estimateReadTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Create source if it doesn't exist
async function ensureSource(sourceName: string, logoUrl: string): Promise<Source> {
  const sources = await storage.getSources();
  const existingSource = sources.find(s => s.name === sourceName);
  
  if (existingSource) {
    return existingSource;
  }
  
  return await storage.createSource({
    name: sourceName,
    logoUrl: logoUrl || null
  });
}

// Create tag if it doesn't exist
async function ensureTag(tagName: string): Promise<Tag> {
  const tag = await storage.getTagByName(tagName);
  
  if (tag) {
    return tag;
  }
  
  // Get a color based on the tag name hash
  const colors = ['#F7DF1E', '#61DAFB', '#4285F4', '#F29111', '#FF5722', '#9C27B0', '#E91E63', '#3776AB', '#05122A'];
  const colorIndex = Math.abs(tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  
  return await storage.createTag({
    name: tagName,
    color: colors[colorIndex]
  });
}

// Add tags to an article
async function addTagsToArticle(articleId: number, tagNames: string[]): Promise<void> {
  for (const tagName of tagNames) {
    const tag = await ensureTag(tagName);
    await storage.createArticleTag({
      articleId,
      tagId: tag.id
    });
  }
}

// Fetch and store articles from RSS feeds
export async function fetchAndStoreRssFeeds(): Promise<void> {
  log('Starting RSS feed fetch...', 'rss');
  
  for (const source of rssSources) {
    try {
      log(`Fetching RSS feed: ${source.name}`, 'rss');
      const feed = await parser.parseURL(source.url);
      const dbSource = await ensureSource(source.name, source.logoUrl);
      
      log(`Processing ${feed.items.length} items from ${source.name}`, 'rss');
      
      for (const item of feed.items.slice(0, 10)) { // Limit to 10 most recent items
        // Check if article already exists by URL
        const existingArticles = await storage.getArticles();
        const exists = existingArticles.find(a => a.url === item.link);
        
        if (!exists) {
          const content = item.contentEncoded || item.content || item.summary || '';
          const imageUrl = getImageUrl(item);
          const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
          const readTime = estimateReadTime(content);
          
          // Create article
          const article = await storage.createArticle({
            title: item.title || 'Untitled',
            description: item.summary || content.substring(0, 200) + '...',
            content: content,
            sourceId: dbSource.id,
            url: item.link || '',
            imageUrl: imageUrl || null,
            publishedAt,
            readTime
          });
          
          // Add tags
          await addTagsToArticle(article.id, source.tags);
          
          log(`Added article: ${article.title}`, 'rss');
        }
      }
    } catch (error) {
      log(`Error fetching RSS feed ${source.name}: ${error}`, 'rss');
    }
  }
  
  log('RSS feed fetch completed', 'rss');
}