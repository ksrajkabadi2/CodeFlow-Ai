import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import ChatInterface from './components/ChatInterface';
import UserAuth from './components/UserAuth';
import Navigation from './components/Navigation';
import './App.css';

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

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-white text-2xl">🚀 Loading CodeFlow-AI...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {session && <Navigation session={session} />}
        
        <Routes>
          {!session ? (
            <>
              <Route path="/*" element={<UserAuth />} />
            </>
          ) : (
            <>
              <Route path="/chat" element={<ChatInterface session={session} />} />
              <Route path="/" element={<Navigate to="/chat" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;