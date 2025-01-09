"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../utils/provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  );
};
