import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const themes = ["vintage", "dark", "light", "tide", "supernova"];

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "vintage",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function changeTheme(newTheme) {
    setTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
