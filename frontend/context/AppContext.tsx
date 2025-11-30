"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
    walletAddress: string;
    loanId: string;
    attestation: any;
    loanStatus: "NotStarted" | "Processing" | "Completed";
    loading: boolean;
    theme: "dark" | "light";
}

const defaultState: AppState = {
    walletAddress: "",
    loanId: "",
    attestation: null,
    loanStatus: "NotStarted",
    loading: false,
    theme: "dark",
};

interface AppContextType {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>(defaultState);

    // Load theme from localStorage
    React.useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (storedTheme) {
            setState((prev) => ({ ...prev, theme: storedTheme }));
        }
    }, []);

    // Apply theme class to document
    React.useEffect(() => {
        if (state.theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", state.theme);
    }, [state.theme]);

    const toggleTheme = () => {
        setState((prev) => ({
            ...prev,
            theme: prev.theme === "dark" ? "light" : "dark",
        }));
    };

    return (
        <AppContext.Provider value={{ state, setState, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
