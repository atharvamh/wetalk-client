import { createContext, useState } from "react";

interface IThemeContext{
    darkMode : boolean,
    toggleDarkMode : () => void;
}

export const ThemeContext = createContext({} as IThemeContext);

export const ThemeProvider = (props : any) => {
    const [darkMode, setDarkMode] = useState<boolean>(true);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    }

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            { props.children }
        </ThemeContext.Provider>
    )
}