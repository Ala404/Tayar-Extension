import { 
  User, Article, Source, Tag, Bookmark, 
  ReadingHistory, Reaction, Comment, ArticleWithRelations 
} from "@shared/schema";

export type { 
  User, Article, Source, Tag, Bookmark, 
  ReadingHistory, Reaction, Comment, ArticleWithRelations 
};

export interface UserContext {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export type SortOption = 'all' | 'popular' | 'recent';

export type ViewMode = 'list' | 'grid';

export interface FeedState {
  sortOption: SortOption;
  viewMode: ViewMode;
}

export type ThemeMode = 'light' | 'dark';
