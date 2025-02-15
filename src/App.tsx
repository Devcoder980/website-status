import React, { useState, useEffect } from 'react';
import { Activity, LogOut, Users, Globe } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { CustomerList } from './components/CustomerList';
import { WebsiteList } from './components/WebsiteList';
import { Settings } from './components/Settings.tsx';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/websites" element={<WebsiteList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<WebsiteList />} /> {/* Default route */}
          </Routes>
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </Router>
  );
}

// Bottom Navigation Bar Component
const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm fixed bottom-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Customers Link */}
          <Link
            to="/customers"
            className={`flex flex-col items-center px-4 py-2 text-sm font-medium ${
              location.pathname === '/customers' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Users className="w-6 h-6" />
            <span>Customers</span>
          </Link>

          {/* Websites Link */}
          <Link
            to="/websites"
            className={`flex flex-col items-center px-4 py-2 text-sm font-medium ${
              location.pathname === '/websites' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Globe className="w-6 h-6" />
            <span>Websites</span>
          </Link>

          {/* Settings Link */}
          <Link
            to="/settings"
            className={`flex flex-col items-center px-4 py-2 text-sm font-medium ${
              location.pathname === '/settings' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {/* <Settings className="w-6 h-6" /> */}
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default App;