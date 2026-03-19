import { createContext, useContext, useState, useEffect } from 'react';

const DEMO_SESSION_KEY = 'aquavera_demo_session';

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
    try {
      const savedSession = localStorage.getItem(DEMO_SESSION_KEY);
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }
    } catch (err) {
      console.warn('Failed to read demo session from localStorage', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithPhone = (phone) => {
    const demoSession = {
      phone,
      loggedIn: true,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoSession));
    setSession(demoSession);
  };

  const setProfile = (data) => {
    setProfileState({ ...data, isSetup: true });
  };

  const addRequest = (req) => {
    setRequests(prev => [req, ...prev]);
  };

  const logout = () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
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
    setRequests([]);
  };

  return (
    <AppContext.Provider value={{ 
      session, 
      profile, 
      setProfile, 
      requests, 
      setRequests,
      addRequest, 
      loginWithPhone,
      logout,
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
