import { useEffect } from "react";

import { hydrateStore, useAppState } from "@/lib/store";

export function AppEffects() {
  const state = useAppState();

  useEffect(() => {
    hydrateStore();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.preferences.theme === "dark");
    document.documentElement.lang = state.preferences.language === "en-US" ? "en" : "pt-BR";
  }, [state.preferences.theme, state.preferences.language]);

  return null;
}
