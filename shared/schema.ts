import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), 
  imageUrl: text("image_url").notNull(),
  sourceId: integer("source_id").notNull(),
  url: text("url").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  readTime: integer("read_time").notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

export const articleTags = pgTable("article_tags", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  viewedAt: timestamp("viewed_at").notNull(),
});

export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  type: text("type").notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  articleId: integer("article_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  description: true,
  content: true,
  imageUrl: true,
  sourceId: true,
  url: true,
  publishedAt: true,
  readTime: true,
});

export const insertSourceSchema = createInsertSchema(sources).pick({
  name: true,
  logoUrl: true,
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
});

export const insertArticleTagSchema = createInsertSchema(articleTags).pick({
  articleId: true,
  tagId: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).pick({
  userId: true,
  articleId: true,
  createdAt: true,
});

export const insertReadingHistorySchema = createInsertSchema(readingHistory).pick({
  userId: true,
  articleId: true,
  viewedAt: true,
});

export const insertReactionSchema = createInsertSchema(reactions).pick({
  userId: true,
  articleId: true,
  type: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  userId: true,
  articleId: true,
  content: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertArticleTag = z.infer<typeof insertArticleTagSchema>;
export type ArticleTag = typeof articleTags.$inferSelect;

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertReadingHistory = z.infer<typeof insertReadingHistorySchema>;
export type ReadingHistory = typeof readingHistory.$inferSelect;

export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactions.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Extended types for frontend use
export type ArticleWithRelations = Article & {
  source: Source;
  tags: Tag[];
  bookmarked?: boolean;
  reactions?: {
    likes: number;
    comments: number;
  };
};
