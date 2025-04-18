import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchAndStoreRssFeeds } from "./rss";
import { z } from "zod";
import {
  insertBookmarkSchema,
  insertReactionSchema,
  insertCommentSchema,
  insertReadingHistorySchema,
  insertArticleSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get all articles with pagination and search
  app.get('/api/articles', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const search = req.query.search as string | undefined;
      
      const articles = await storage.getArticles({ limit, offset, search });
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles' });
    }
  });

  // Get article by ID
  app.get('/api/articles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // If a userId is provided, add to reading history
      if (userId) {
        await storage.addToReadingHistory({
          userId,
          articleId: id,
          viewedAt: new Date()
        });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });

  // Get articles by tag
  app.get('/api/tags/:tagName/articles', async (req, res) => {
    try {
      const { tagName } = req.params;
      const articles = await storage.getArticlesByTag(tagName);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles by tag' });
    }
  });

  // Get all tags
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tags' });
    }
  });

  // Get all sources
  app.get('/api/sources', async (req, res) => {
    try {
      const sources = await storage.getSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch sources' });
    }
  });

  // Get bookmarks for a user
  app.get('/api/users/:userId/bookmarks', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookmarks = await storage.getBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookmarks' });
    }
  });

  // Add bookmark
  app.post('/api/bookmarks', async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse({
        ...req.body,
        createdAt: new Date()
      });
      
      const bookmark = await storage.bookmarkArticle(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create bookmark' });
    }
  });

  // Remove bookmark
  app.delete('/api/bookmarks', async (req, res) => {
    try {
      const { userId, articleId } = req.body;
      if (!userId || !articleId) {
        return res.status(400).json({ message: 'userId and articleId are required' });
      }
      
      const success = await storage.removeBookmark(parseInt(userId), parseInt(articleId));
      
      if (!success) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      
      res.status(200).json({ message: 'Bookmark removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove bookmark' });
    }
  });

  // Get reading history for a user
  app.get('/api/users/:userId/history', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const history = await storage.getReadingHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reading history' });
    }
  });

  // Clear reading history for a user
  app.delete('/api/users/:userId/history', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearReadingHistory(userId);
      res.status(200).json({ message: 'Reading history cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear reading history' });
    }
  });

  // Add to reading history
  app.post('/api/history', async (req, res) => {
    try {
      const validatedData = insertReadingHistorySchema.parse({
        ...req.body,
        viewedAt: new Date()
      });
      
      // Check if this article is already in the history
      const existingHistory = await storage.getReadingHistory(validatedData.userId);
      const alreadyExists = existingHistory.some(item => item.id === validatedData.articleId);
      
      let historyEntry;
      if (alreadyExists) {
        // Update the existing entry with new timestamp
        historyEntry = await storage.updateReadingHistory(validatedData);
      } else {
        // Add new entry
        historyEntry = await storage.addToReadingHistory(validatedData);
      }
      
      res.status(201).json(historyEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add to reading history' });
    }
  });

  // Get reactions for an article
  app.get('/api/articles/:id/reactions', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const reactions = await storage.getReactionsByArticleId(articleId);
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reactions' });
    }
  });

  // Add reaction
  app.post('/api/reactions', async (req, res) => {
    try {
      const validatedData = insertReactionSchema.parse(req.body);
      const reaction = await storage.addReaction(validatedData);
      res.status(201).json(reaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add reaction' });
    }
  });

  // Remove reaction
  app.delete('/api/reactions', async (req, res) => {
    try {
      const { userId, articleId, type } = req.body;
      if (!userId || !articleId || !type) {
        return res.status(400).json({ message: 'userId, articleId, and type are required' });
      }
      
      const success = await storage.removeReaction(parseInt(userId), parseInt(articleId), type);
      
      if (!success) {
        return res.status(404).json({ message: 'Reaction not found' });
      }
      
      res.status(200).json({ message: 'Reaction removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove reaction' });
    }
  });

  // Get comments for an article
  app.get('/api/articles/:id/comments', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const comments = await storage.getCommentsByArticleId(articleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  });

  // Add comment
  app.post('/api/comments', async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        createdAt: new Date()
      });
      
      const comment = await storage.addComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to add comment' });
    }
  });
  
  // Add new article
  app.post('/api/articles', async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse({
        ...req.body,
        publishedAt: new Date()
      });
      
      const article = await storage.createArticle(validatedData);
      
      // Add tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagName of req.body.tags) {
          const tag = await storage.getTagByName(tagName);
          if (tag) {
            await storage.createArticleTag({
              articleId: article.id,
              tagId: tag.id
            });
          } else {
            const newTag = await storage.createTag({
              name: tagName,
              color: '#' + Math.floor(Math.random()*16777215).toString(16)
            });
            await storage.createArticleTag({
              articleId: article.id,
              tagId: newTag.id
            });
          }
        }
      }
      
      res.status(200).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create article' });
    }
  });
  
  // Fetch RSS feeds
  app.post('/api/rss/fetch', async (req, res) => {
    try {
      await fetchAndStoreRssFeeds();
      res.status(200).json({ message: 'RSS feeds fetched and stored successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch RSS feeds', error: error instanceof Error ? error.message : String(error) });
    }
  });
  
  // Initialize RSS feeds on server start
  setTimeout(async () => {
    try {
      await fetchAndStoreRssFeeds();
      console.log('Initial RSS feeds fetched and stored successfully');
    } catch (error) {
      console.error('Failed to fetch initial RSS feeds:', error);
    }
  }, 2000);

  return httpServer;
}
