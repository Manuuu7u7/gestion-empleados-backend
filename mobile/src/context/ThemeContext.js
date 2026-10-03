import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
    mode: 'light',
    background: '#f0f2f5',
    card: '#fff',
    text: '#1a1a2e',
    textSecondary: '#666',
    textMuted: '#888',
    border: '#e9ecef',
    input: '#f8f9fa',
    primary: '#4361ee',
    header: '#4361ee',
};

export const darkTheme = {
    mode: 'dark',
    background: '#0d1117',
    card: '#161b22',
    text: '#f0f6fc',
    textSecondary: '#c9d1d9',
    textMuted: '#8b949e',
    border: '#30363d',
    input: '#21262d',
    primary: '#58a6ff',
    header: '#161b22',
};

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('@theme').then((val) => {
            if (val === 'dark') setIsDark(true);
        });
    }, []);

    const toggleTheme = async () => {
        const nuevo = !isDark;
        setIsDark(nuevo);
        await AsyncStorage.setItem('@theme', nuevo ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);