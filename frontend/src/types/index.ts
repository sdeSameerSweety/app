export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'PROFESSIONAL' | 'ENTREPRENEUR' | 'PARENT' | 'ADMIN';
  subscriptionTier: 'FREE' | 'STUDENT_PREMIUM' | 'PROFESSIONAL_PREMIUM' | 'ENTERPRISE_PREMIUM';
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  isFaceVerified?: boolean;
  verificationLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
  credibilityScore?: number;
  aiQueriesUsed?: number;
  voiceConversationsUsed?: number;
}

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    verificationLevel: string;
    credibilityScore: number;
  };
  reviewType: 'COLLEGE' | 'COURSE' | 'COMPANY' | 'MENTOR';
  collegeId?: string;
  college?: {
    id: string;
    name: string;
    location: string;
  };
  courseId?: string;
  course?: {
    id: string;
    name: string;
    category: string;
  };
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIConversation {
  id: string;
  type: 'TEXT' | 'VOICE';
  messages: { role: string; content: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}
