import { create } from 'zustand';
import { storage } from '../utils/storage';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while we check SecureStore

  login: async (user, token) => {
    await storage.setItem('accessToken', token);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await storage.removeItem('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateUser: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

// Initialize auth state
export const initAuth = async () => {
  const token = await storage.getItem('accessToken');
  if (token) {
    // You might want to fetch user profile here using the token
    useAuthStore.setState({ accessToken: token, isAuthenticated: true, isLoading: false });
  } else {
    useAuthStore.setState({ isLoading: false });
  }
};
