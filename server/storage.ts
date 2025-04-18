import {
  users, User, InsertUser,
  articles, Article, InsertArticle,
  sources, Source, InsertSource,
  tags, Tag, InsertTag,
  articleTags, ArticleTag, InsertArticleTag,
  bookmarks, Bookmark, InsertBookmark,
  readingHistory, ReadingHistory, InsertReadingHistory,
  reactions, Reaction, InsertReaction,
  comments, Comment, InsertComment,
  ArticleWithRelations
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Article operations
  getArticles(options?: { limit?: number; offset?: number; search?: string }): Promise<ArticleWithRelations[]>;
  getArticleById(id: number): Promise<ArticleWithRelations | undefined>;
  getArticlesByTag(tagName: string): Promise<ArticleWithRelations[]>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Source operations
  getSources(): Promise<Source[]>;
  getSourceById(id: number): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;

  // Tag operations
  getTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Article Tag operations
  createArticleTag(articleTag: InsertArticleTag): Promise<ArticleTag>;
  getTagsByArticleId(articleId: number): Promise<Tag[]>;
  getArticlesByTagId(tagId: number): Promise<Article[]>;

  // Bookmark operations
  getBookmarks(userId: number): Promise<ArticleWithRelations[]>;
  bookmarkArticle(bookmark: InsertBookmark): Promise<Bookmark>;
  removeBookmark(userId: number, articleId: number): Promise<boolean>;
  isArticleBookmarked(userId: number, articleId: number): Promise<boolean>;

  // Reading History operations
  getReadingHistory(userId: number): Promise<ArticleWithRelations[]>;
  addToReadingHistory(historyEntry: InsertReadingHistory): Promise<ReadingHistory>;
  updateReadingHistory(historyEntry: InsertReadingHistory): Promise<ReadingHistory>;
  clearReadingHistory(userId: number): Promise<boolean>;

  // Reaction operations
  getReactionsByArticleId(articleId: number): Promise<{ likes: number; comments: number }>;
  addReaction(reaction: InsertReaction): Promise<Reaction>;
  removeReaction(userId: number, articleId: number, type: string): Promise<boolean>;

  // Comment operations
  getCommentsByArticleId(articleId: number): Promise<(Comment & { user: User })[]>;
  addComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private sources: Map<number, Source>;
  private tags: Map<number, Tag>;
  private articleTags: Map<number, ArticleTag>;
  private bookmarks: Map<number, Bookmark>;
  private readingHistory: Map<number, ReadingHistory>;
  private reactions: Map<number, Reaction>;
  private comments: Map<number, Comment>;

  private userId: number;
  private articleId: number;
  private sourceId: number;
  private tagId: number;
  private articleTagId: number;
  private bookmarkId: number;
  private readingHistoryId: number;
  private reactionId: number;
  private commentId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.sources = new Map();
    this.tags = new Map();
    this.articleTags = new Map();
    this.bookmarks = new Map();
    this.readingHistory = new Map();
    this.reactions = new Map();
    this.comments = new Map();

    this.userId = 1;
    this.articleId = 1;
    this.sourceId = 1;
    this.tagId = 1;
    this.articleTagId = 1;
    this.bookmarkId = 1;
    this.readingHistoryId = 1;
    this.reactionId = 1;
    this.commentId = 1;
    
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article operations
  async getArticles(options?: { limit?: number; offset?: number; search?: string }): Promise<ArticleWithRelations[]> {
    let articleList = Array.from(this.articles.values());
    const offset = options?.offset || 0;
    const limit = options?.limit || articleList.length;
    const search = options?.search?.toLowerCase();
    
    // Apply search filter if provided
    if (search) {
      articleList = articleList.filter(article => {
        const matchesTitle = article.title.toLowerCase().includes(search);
        const matchesDescription = article.description.toLowerCase().includes(search);
        const matchesContent = article.content.toLowerCase().includes(search);
        
        return matchesTitle || matchesDescription || matchesContent;
      });
    }
    
    articleList = articleList.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    articleList = articleList.slice(offset, offset + limit);
    
    return Promise.all(articleList.map(article => this.enrichArticle(article)));
  }

  async getArticleById(id: number): Promise<ArticleWithRelations | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    return this.enrichArticle(article);
  }

  async getArticlesByTag(tagName: string): Promise<ArticleWithRelations[]> {
    const tag = await this.getTagByName(tagName);
    if (!tag) return [];
    
    const articles = await this.getArticlesByTagId(tag.id);
    return Promise.all(articles.map(article => this.enrichArticle(article)));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  // Source operations
  async getSources(): Promise<Source[]> {
    return Array.from(this.sources.values());
  }

  async getSourceById(id: number): Promise<Source | undefined> {
    return this.sources.get(id);
  }

  async createSource(insertSource: InsertSource): Promise<Source> {
    const id = this.sourceId++;
    const source: Source = { ...insertSource, id };
    this.sources.set(id, source);
    return source;
  }

  // Tag operations
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      (tag) => tag.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.tagId++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  // Article Tag operations
  async createArticleTag(insertArticleTag: InsertArticleTag): Promise<ArticleTag> {
    const id = this.articleTagId++;
    const articleTag: ArticleTag = { ...insertArticleTag, id };
    this.articleTags.set(id, articleTag);
    return articleTag;
  }

  async getTagsByArticleId(articleId: number): Promise<Tag[]> {
    const articleTagIds = Array.from(this.articleTags.values())
      .filter(at => at.articleId === articleId)
      .map(at => at.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => articleTagIds.includes(tag.id));
  }

  async getArticlesByTagId(tagId: number): Promise<Article[]> {
    const articleIds = Array.from(this.articleTags.values())
      .filter(at => at.tagId === tagId)
      .map(at => at.articleId);
    
    return Array.from(this.articles.values())
      .filter(article => articleIds.includes(article.id));
  }

  // Bookmark operations
  async getBookmarks(userId: number): Promise<ArticleWithRelations[]> {
    const bookmarksForUser = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    const articles = Array.from(this.articles.values())
      .filter(article => bookmarksForUser.some(b => b.articleId === article.id));
    
    return Promise.all(articles.map(article => this.enrichArticle(article, userId)));
  }

  async bookmarkArticle(insertBookmark: InsertBookmark): Promise<Bookmark> {
    // Check if bookmark already exists
    const existing = Array.from(this.bookmarks.values()).find(
      b => b.userId === insertBookmark.userId && b.articleId === insertBookmark.articleId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.bookmarkId++;
    const bookmark: Bookmark = { ...insertBookmark, id };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async removeBookmark(userId: number, articleId: number): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      b => b.userId === userId && b.articleId === articleId
    );
    
    if (!bookmark) return false;
    
    return this.bookmarks.delete(bookmark.id);
  }

  async isArticleBookmarked(userId: number, articleId: number): Promise<boolean> {
    return Array.from(this.bookmarks.values()).some(
      b => b.userId === userId && b.articleId === articleId
    );
  }

  // Reading History operations
  async getReadingHistory(userId: number): Promise<ArticleWithRelations[]> {
    const historyForUser = Array.from(this.readingHistory.values())
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
    
    const articles = [];
    for (const history of historyForUser) {
      const article = this.articles.get(history.articleId);
      if (article) {
        articles.push(article);
      }
    }
    
    return Promise.all(articles.map(article => this.enrichArticle(article, userId)));
  }

  async addToReadingHistory(insertHistory: InsertReadingHistory): Promise<ReadingHistory> {
    const id = this.readingHistoryId++;
    const historyEntry: ReadingHistory = { ...insertHistory, id };
    this.readingHistory.set(id, historyEntry);
    return historyEntry;
  }
  
  async updateReadingHistory(historyData: InsertReadingHistory): Promise<ReadingHistory> {
    // Find existing entry
    const existingEntry = Array.from(this.readingHistory.values()).find(
      history => history.userId === historyData.userId && history.articleId === historyData.articleId
    );
    
    if (!existingEntry) {
      // If no existing entry, create a new one
      return this.addToReadingHistory(historyData);
    }
    
    // Update viewedAt timestamp
    const updatedEntry: ReadingHistory = {
      ...existingEntry,
      viewedAt: historyData.viewedAt
    };
    
    this.readingHistory.set(existingEntry.id, updatedEntry);
    return updatedEntry;
  }
  
  async clearReadingHistory(userId: number): Promise<boolean> {
    const historyEntries = Array.from(this.readingHistory.values())
      .filter(history => history.userId === userId);
    
    for (const entry of historyEntries) {
      this.readingHistory.delete(entry.id);
    }
    
    return true;
  }

  // Reaction operations
  async getReactionsByArticleId(articleId: number): Promise<{ likes: number; comments: number }> {
    const likes = Array.from(this.reactions.values())
      .filter(r => r.articleId === articleId && r.type === 'like')
      .length;
    
    const comments = Array.from(this.comments.values())
      .filter(c => c.articleId === articleId)
      .length;
    
    return { likes, comments };
  }

  async addReaction(insertReaction: InsertReaction): Promise<Reaction> {
    // Check if reaction already exists
    const existing = Array.from(this.reactions.values()).find(
      r => r.userId === insertReaction.userId && 
          r.articleId === insertReaction.articleId && 
          r.type === insertReaction.type
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.reactionId++;
    const reaction: Reaction = { ...insertReaction, id };
    this.reactions.set(id, reaction);
    return reaction;
  }

  async removeReaction(userId: number, articleId: number, type: string): Promise<boolean> {
    const reaction = Array.from(this.reactions.values()).find(
      r => r.userId === userId && r.articleId === articleId && r.type === type
    );
    
    if (!reaction) return false;
    
    return this.reactions.delete(reaction.id);
  }

  // Comment operations
  async getCommentsByArticleId(articleId: number): Promise<(Comment & { user: User })[]> {
    const commentsForArticle = Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return Promise.all(commentsForArticle.map(async comment => {
      const user = await this.getUser(comment.userId);
      return { ...comment, user: user! };
    }));
  }

  async addComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const comment: Comment = { ...insertComment, id };
    this.comments.set(id, comment);
    return comment;
  }

  // Helper method to enrich articles with relations
  private async enrichArticle(article: Article, userId?: number): Promise<ArticleWithRelations> {
    const source = await this.getSourceById(article.sourceId);
    const tags = await this.getTagsByArticleId(article.id);
    const reactions = await this.getReactionsByArticleId(article.id);
    
    let bookmarked = false;
    if (userId) {
      bookmarked = await this.isArticleBookmarked(userId, article.id);
    }
    
    return {
      ...article,
      source: source!,
      tags,
      reactions,
      bookmarked
    };
  }

  // Seed initial data
  private seedData() {
    // Create sources
    const sources: InsertSource[] = [
      { name: 'TechCrunch', logoUrl: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png' },
      { name: 'Dev.to', logoUrl: 'https://dev-to.s3.amazonaws.com/favicon.ico' },
      { name: 'AWS Blog', logoUrl: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico' },
      { name: 'MongoDB Engineering', logoUrl: 'https://www.mongodb.com/assets/images/global/favicon.ico' },
      { name: 'Security Weekly', logoUrl: 'https://securityweekly.com/wp-content/uploads/2019/06/favicon.png' },
      { name: 'AI Research Journal', logoUrl: 'https://ai.googleblog.com/favicon.ico' }
    ];
    
    sources.forEach(source => {
      this.createSource(source);
    });

    // Create tags
    const tags: InsertTag[] = [
      { name: 'javascript', color: '#F7DF1E' },
      { name: 'react', color: '#61DAFB' },
      { name: 'cloud', color: '#4285F4' },
      { name: 'database', color: '#F29111' },
      { name: 'security', color: '#FF5722' },
      { name: 'ai', color: '#9C27B0' },
      { name: 'webdev', color: '#E91E63' },
      { name: 'python', color: '#3776AB' },
      { name: 'devops', color: '#05122A' }
    ];
    
    tags.forEach(tag => {
      this.createTag(tag);
    });

    // Create articles
    const articles: InsertArticle[] = [
      {
        title: 'JavaScript Animation Engine: Building High-Performance Web Animations',
        description: 'Learn how to build a lightweight animation engine for creating fluid UI experiences without relying on heavy libraries.',
        content: 'Full content of the JavaScript Animation Engine article...',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        sourceId: 1,
        url: '/article/1',
        publishedAt: new Date('2023-06-15T14:30:00Z'),
        readTime: 7
      },
      {
        title: '2023 Frontend Framework Comparison: React vs Vue vs Angular vs Svelte',
        description: 'A detailed analysis of the most popular frontend frameworks in 2023, with performance benchmarks and developer experience insights.',
        content: 'Full content of the Frontend Framework Comparison article...',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        sourceId: 2,
        url: '/article/2',
        publishedAt: new Date('2023-06-15T10:15:00Z'),
        readTime: 12
      },
      {
        title: 'A Beginner\'s Guide to Kubernetes: Containers Orchestration Made Simple',
        description: 'Learn the fundamentals of Kubernetes and how it can help you manage containerized applications at scale with practical examples.',
        content: 'Full content of the Kubernetes Guide article...',
        imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3',
        sourceId: 3,
        url: '/article/3',
        publishedAt: new Date('2023-06-14T09:45:00Z'),
        readTime: 10
      },
      {
        title: 'NoSQL vs SQL in 2023: Choosing the Right Database for Your Application',
        description: 'An updated comparison of SQL and NoSQL database systems with guidance on which to choose based on your specific use case.',
        content: 'Full content of the Database Comparison article...',
        imageUrl: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71',
        sourceId: 4,
        url: '/article/4',
        publishedAt: new Date('2023-06-12T16:20:00Z'),
        readTime: 8
      },
      {
        title: 'Modern Web Security: OWASP Top 10 and Beyond for 2023',
        description: 'Discover the latest security threats and learn practical techniques to protect your web applications against sophisticated attacks.',
        content: 'Full content of the Web Security article...',
        imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42',
        sourceId: 5,
        url: '/article/5',
        publishedAt: new Date('2023-06-13T11:30:00Z'),
        readTime: 9
      },
      {
        title: 'The 13 Most Important Software Engineering Laws Every Developer Should Know',
        description: 'From Conway\'s Law to the Law of Demeter, these fundamental principles will help you build better software systems.',
        content: 'Full content of the Software Engineering Laws article...',
        imageUrl: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4',
        sourceId: 6,
        url: '/article/6',
        publishedAt: new Date('2023-06-11T08:15:00Z'),
        readTime: 11
      }
    ];
    
    articles.forEach(article => {
      this.createArticle(article);
    });

    // Create article tags connections
    const articleTags = [
      { articleId: 1, tagId: 1 }, // JavaScript article - javascript tag
      { articleId: 2, tagId: 2 }, // Frontend Framework article - react tag
      { articleId: 2, tagId: 7 }, // Frontend Framework article - webdev tag
      { articleId: 3, tagId: 3 }, // Kubernetes article - cloud tag
      { articleId: 3, tagId: 9 }, // Kubernetes article - devops tag
      { articleId: 4, tagId: 4 }, // Database article - database tag
      { articleId: 5, tagId: 5 }, // Web Security article - security tag
      { articleId: 6, tagId: 6 }, // ML for JS Devs article - ai tag
      { articleId: 6, tagId: 7 }  // ML for JS Devs article - webdev tag
    ];
    
    articleTags.forEach(at => {
      this.createArticleTag(at);
    });

    // Create a test user
    this.createUser({
      username: 'testuser',
      password: 'password',
      email: 'test@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    });

    // Add some reactions
    for (let i = 1; i <= 6; i++) {
      const likesCount = Math.floor(Math.random() * 900) + 100;
      for (let j = 0; j < likesCount; j++) {
        this.addReaction({
          userId: j % 5 + 2, // Create some fake user IDs
          articleId: i,
          type: 'like'
        });
      }
      
      const commentsCount = Math.floor(Math.random() * 150) + 10;
      for (let j = 0; j < commentsCount; j++) {
        this.addComment({
          userId: j % 5 + 2, // Create some fake user IDs
          articleId: i,
          content: `This is a test comment ${j} on article ${i}`,
          createdAt: new Date()
        });
      }
    }
  }
}

export const storage = new MemStorage();
