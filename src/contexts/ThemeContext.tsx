```typescript
// Theme Context for Dark Mode support
import { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'colorful';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (newTheme?: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && ['light', 'dark', 'colorful'].includes(savedTheme)) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // If no saved theme or invalid, set default 'light'
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }, []);

    // Effect to update the document element's data-theme attribute whenever the theme state changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); // Keep localStorage in sync with current theme state
    }, [theme]);

    const toggleTheme = (newTheme?: Theme) => {
        const nextTheme = newTheme || (theme === 'light' ? 'dark' : theme === 'dark' ? 'colorful' : 'light');
        setTheme(nextTheme);
        // The localStorage.setItem and document.documentElement.setAttribute are now handled by the useEffect above
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
