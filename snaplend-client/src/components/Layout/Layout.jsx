import React from "react";
import { User} from "../../entities/User";
import AuthService from "../../services/auth-service";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Only make API call if there's a user token in localStorage
      if (AuthService.isAuthenticated()) {
        const userData = await User.me();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Layout checkAuth error:', error);
      setUser(null);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <style>{`
        :root {
          --primary-sky: #0ea5e9;
          --primary-gray: #f8fafc;
          --accent-green: #10b981;
          --accent-orange: #f59e0b;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --shadow-soft: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-medium: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-large: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        
        * {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      {children}
    </div>
  );
}