import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/useAuthStore';
import { useProductStore } from './store/useProductStore';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import StorePage from './pages/StorePage';

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const subscribeToProducts = useProductStore((state) => state.subscribeToProducts);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    const unsubProducts = subscribeToProducts();

    return () => {
      unsubAuth();
      unsubProducts();
    };
  }, [setUser, subscribeToProducts]);

  return (
    <BrowserRouter>
      <Navbar />
      <AuthModal />
      <Routes>
        <Route path="/" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}