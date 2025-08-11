import React, { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import GISMapPage from "./pages/GISMapPage";
import AuthModal from "./components/gis/AuthModal";
import AuthService from "./services/auth-service";
import { Toaster } from "./components/ui/toaster";
import './index.css';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show login/register modal if user is not authenticated
    if (!AuthService.isAuthenticated()) {
      setShowAuthModal(true);
    }
  }, []);

  return (
    <>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Main app layout */}
      <Layout currentPageName="GIS Map">
        <GISMapPage />
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
