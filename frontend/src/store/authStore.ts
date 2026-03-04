import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  sendOtp: (email: string) => Promise<void>;
  signupWithOtp: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      sendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/sendotp', { email });
          set({ isLoading: false });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Failed to send OTP',
          });
          throw err;
        }
      },

      signupWithOtp: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', data);
          const { user, token } = response.data;
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Signup failed',
          });
          throw err;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', {
            uniq: email,
            passwordInput: password,
          });
          const { user, token } = response.data;
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Login failed',
          });
          throw err;
        }
      },

      loginWithGoogle: async (idToken: string) => {
        console.log("..",idToken)
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login/google', { idToken });
          const { user, token } = response.data;
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Google login failed',
          });
          throw err;
        }
      },

      checkAuth: async () => {
        try {
          const response = await api.get('/auth/checkauth');
          const { user, token } = response.data.data;
          set({ user, token });
        } catch (err) {
          set({ user: null, token: null });
        }
      },

      logout: () => {
        api.post('/auth/logout').catch(() => {});
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
