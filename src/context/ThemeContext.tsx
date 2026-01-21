"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "neo" | "swiss" | "soft";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("neo");

    useEffect(() => {
        // Check localStorage on mount
        const savedTheme = localStorage.getItem("subby-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Update data attribute and localStorage
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("subby-theme", theme);
    }, [theme]);

    // Handle Cyber theme specific body class if needed for blur/noise adjustments
    // For now just data attribute is sufficient for the CSS setup

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
