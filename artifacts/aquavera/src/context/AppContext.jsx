import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfileState] = useState({
    name: '',
    aadhaar: '',
    landId: '',
    landArea: '',
    isSetup: false,
    beneficiaryType: 'wua',
    waterSource: null
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setProfile = (data) => {
    setProfileState({ ...data, isSetup: true });
  };

  const addRequest = (req) => {
    setRequests(prev => [req, ...prev]);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfileState({
      name: '',
      aadhaar: '',
      landId: '',
      landArea: '',
      isSetup: false,
      beneficiaryType: 'wua',
      waterSource: null
    });
  };

  return (
    <AppContext.Provider value={{ 
      session, 
      profile, 
      setProfile, 
      requests, 
      setRequests,
      addRequest, 
      logout,
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
