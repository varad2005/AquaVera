import { createContext, useContext, useState } from 'react';

const initialRequests = [
  {
    id: "REQ-2025-001",
    cropKey: "sugarcane",
    seasonKey: "kharif",
    duration: 30,
    landArea: 2.5,
    imageUrl: null,
    status: "Approved",
    billAmount: 4725.00,
    paid: true,
    date: "2025-05-10",
    beneficiaryType: "wua",
    waterSource: null
  },
  {
    id: "REQ-2025-002",
    cropKey: "foodGrains",
    seasonKey: "rabi",
    duration: 20,
    landArea: 2.5,
    imageUrl: null,
    status: "Needs Review",
    billAmount: 3000.00,
    paid: false,
    date: "2025-06-01",
    beneficiaryType: "individual",
    waterSource: null
  },
  {
    id: "REQ-2025-003",
    cropKey: "cotton",
    seasonKey: "kharif",
    duration: 15,
    landArea: 2.5,
    imageUrl: null,
    status: "Pending",
    billAmount: 2025.00,
    paid: false,
    date: "2025-06-10",
    beneficiaryType: "wua",
    waterSource: null
  }
];

const AppContext = createContext();

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState({
    name: '',
    aadhaar: '',
    landId: '',
    landArea: '',
    isSetup: false,
    beneficiaryType: 'wua',
    waterSource: null
  });
  const [requests, setRequests] = useState(initialRequests);

  const setProfile = (data) => {
    setProfileState({ ...data, isSetup: true });
  };

  const addRequest = (req) => {
    setRequests(prev => [req, ...prev]);
  };

  return (
    <AppContext.Provider value={{ profile, setProfile, requests, addRequest }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
