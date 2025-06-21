"use client";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useState, useEffect } from "react";

export default function ThemeDebugger() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [htmlClasses, setHtmlClasses] = useState("");
  const [localStorageTheme, setLocalStorageTheme] = useState("");

  useEffect(() => {
    const updateDebugInfo = () => {
      setHtmlClasses(document.documentElement.classList.toString());
      setLocalStorageTheme(localStorage.getItem('theme') || 'not set');
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 100);
    return () => clearInterval(interval);
  }, [isDarkMode]);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2 text-gray-800 dark:text-white">Theme Debug</h4>
      <div className="space-y-1 text-gray-600 dark:text-gray-300">
        <div>Context: {isDarkMode ? 'Dark' : 'Light'}</div>
        <div>LocalStorage: {localStorageTheme}</div>
        <div>HTML Classes: {htmlClasses || 'none'}</div>
        <button 
          onClick={toggleDarkMode}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}