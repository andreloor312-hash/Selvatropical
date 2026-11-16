import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useCartStore } from './useCartStore';

const ADMIN_EMAIL = 'andreloor312@gmail.com';

export const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  authModalOpen: false,

  setUser: (user) =>
    set({
      user,
      isAdmin: user?.email?.toLowerCase() === ADMIN_EMAIL,
    }),

  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),

  logout: async () => {
    await signOut(auth);
    useCartStore.getState().clearCart();
    set({ user: null, isAdmin: false });
  },
}));