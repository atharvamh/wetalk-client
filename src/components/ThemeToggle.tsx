import { Switch, FormGroup, FormControlLabel } from "@mui/material";
import { useTheme } from "../customhooks";

export default function ThemeToggle(){
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className="header">
            <FormGroup>
                <FormControlLabel 
                    control={<Switch defaultChecked onClick={toggleDarkMode} />} 
                    label={ darkMode ? "Dark" : "Light"}
                />
            </FormGroup>
        </div>
    )
}