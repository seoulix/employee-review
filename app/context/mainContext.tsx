"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ExpiryTime {
  format: string;
  value: number;
}

interface MainContextType {
  expiryTime: ExpiryTime;
  updateExpiryTime: () => Promise<void>;
  setExpiryTime: (value: ExpiryTime) => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
    const [expiryTime, setExpiryTime] = useState<ExpiryTime>({format: "Minute", value: 0});

    const fetchFeedbackSettings = async (selection: string) => {
        const res = await fetch(`/api/feedback_settings?selection=${selection}`);
        const json = await res.json();
console.log(json.data[0]);
        if(json.success){
            setExpiryTime({format: json.data[0].expiry_format, value: json.data[0].expiry_time});
        }
    }

    const updateExpiryTime = async () => {
        const res = await fetch("/api/feedback_settings", {
            method: "POST",
            body: JSON.stringify({expiry_time: expiryTime.value, expiry_format: expiryTime.format})
        });
        const json = await res.json();
        return json;
     
    }

    useEffect(() => {
        fetchFeedbackSettings("expiry_time,expiry_format");
    }, []);

    return (
        <MainContext.Provider value={{ expiryTime, updateExpiryTime,setExpiryTime }}>
            {children}
        </MainContext.Provider>
    );
}

export function useMainContext() {
    const context = useContext(MainContext);
    if (context === undefined) {
        throw new Error('useMainContext must be used within a MainProvider');
    }
    return context;
} 