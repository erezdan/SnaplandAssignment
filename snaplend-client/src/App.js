import React, { useEffect, useState, useCallback } from "react";
import Layout from "./components/layout/Layout";
import GISMapPage from "./pages/GISMapPage";
import AuthModal from "./components/gis/AuthModal";
import AuthService from "./services/auth-service";
import { Toaster } from "./components/ui/toaster";
import './index.css';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleCloseAuthModal = useCallback(() => {
    console.log('AuthModal onClose called');
    setShowAuthModal(false);
  }, []);

  useEffect(() => {
    console.log('App useEffect triggered - isInitialized:', isInitialized);
    // Only run this effect once on mount
    if (!isInitialized) {
      console.log('App useEffect - checking authentication...');
      const isAuth = AuthService.isAuthenticated();
      console.log('App useEffect - isAuthenticated:', isAuth);
      console.log('App useEffect - localStorage user:', AuthService.getCurrentUser());
      
      // Show login/register modal if user is not authenticated
      if (!isAuth) {
        console.log('App useEffect - Setting showAuthModal to true');
        setShowAuthModal(true);
      } else {
        console.log('App useEffect - User is authenticated, not showing modal');
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Debug state changes
  useEffect(() => {
    console.log('App state changed - showAuthModal:', showAuthModal);
  }, [showAuthModal]);

  // Debug initialization
  useEffect(() => {
    console.log('App initialization state changed - isInitialized:', isInitialized);
  }, [isInitialized]);

  console.log('App render - showAuthModal:', showAuthModal, 'isInitialized:', isInitialized);

  return (
    <>
      <Toaster />
      
      <AuthModal open={showAuthModal} onClose={handleCloseAuthModal} />

      {/* Main app layout */}
      <Layout currentPageName="GIS Map">
        <GISMapPage />
      </Layout>
    </>
  );
}

export default App;
