import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

export default function useTheme(){
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return { darkMode, toggleDarkMode };
}