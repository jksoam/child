export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  caption: string;
  imageUrl: string;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  storyId: string;
  user: User;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  storyId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}