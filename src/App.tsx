import { useCallback, useMemo, useRef, useState } from "react";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import HeroSection from "./components/home/HeroSection";
import FeatureSection from "./components/home/FeatureSection";
import CatalogPage from "./components/phones/CatalogPage";
import QuizWizard from "./components/quiz/QuizWizard";
import RecommendationResults from "./components/phones/RecommendationResults";
import PhoneDetailsModal from "./components/phones/PhoneDetailsModal";
import CompareTray from "./components/compare/CompareTray";
import CompareTable from "./components/compare/CompareTable";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { STORAGE_KEYS } from "./utils/storage";
import {
  createDefaultPreferences,
  type UserPreferences,
} from "./types/preferences";
import { PHONES } from "./data/phones";
import type { Phone } from "./types/phone";
import "./App.css";

/**
 * نماهای اپ (state-based navigation، بدون react-router).
 */
export type AppView = "home" | "quiz" | "results" | "compare" | "catalog";

/** حداکثر گوشی قابل مقایسه — هماهنگ با CatalogPage و RecommendationResults */
const MAX_COMPARE = 3;

export default function App() {
  const [view, setView] = useState<AppView>("home");

  // ---- Favorites ----
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    STORAGE_KEYS.favorites,
    [],
  );

  // ---- Preferences ----
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    STORAGE_KEYS.preferences,
    createDefaultPreferences(),
  );

  // ---- Compare ----
  const [compareIds, setCompareIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.compare,
    [],
  );

  // ---- Modal ----
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Resolve IDs to phone objects, dropping any stale IDs.
  const comparePhones = useMemo<Phone[]>(() => {
    return compareIds
      .map((id) => PHONES.find((p) => p.id === id))
      .filter((p): p is Phone => p !== undefined);
  }, [compareIds]);

  const activeCompareIds = useMemo(
    () => comparePhones.map((p) => p.id),
    [comparePhones],
  );

  /* ---------------- Handlers ---------------- */

  const toggleFavorite = useCallback(
    (phoneId: string) => {
      setFavorites((prev) =>
        prev.includes(phoneId)
          ? prev.filter((id) => id !== phoneId)
          : [...prev, phoneId],
      );
    },
    [setFavorites],
  );

  const updatePreferences = useCallback(
    (partial: Partial<UserPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...partial }));
    },
    [setPreferences],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(createDefaultPreferences());
  }, [setPreferences]);

  const toggleCompare = useCallback(
    (phone: Phone) => {
      setCompareIds((prev) => {
        if (prev.includes(phone.id)) {
          return prev.filter((id) => id !== phone.id);
        }
        if (prev.length >= MAX_COMPARE) return prev;
        return [...prev, phone.id];
      });
    },
    [setCompareIds],
  );

  const removeFromCompare = useCallback(
    (phoneId: string) => {
      setCompareIds((prev) => prev.filter((id) => id !== phoneId));
    },
    [setCompareIds],
  );

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, [setCompareIds]);

  const openDetails = useCallback((phone: Phone) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setSelectedPhone(phone);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedPhone(null);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    });
  }, []);

  const handleQuizFinish = useCallback(() => {
    setView("results");
  }, []);

  /* ---------------- Derived ---------------- */

  const showCompareTray = view !== "compare" && comparePhones.length > 0;

  /* ---------------- Render ---------------- */

  return (
    <div className="app">
      <SiteHeader activeView={view} onNavigate={setView} />

      <main className="app__main" id="main-content">
        {view === "home" && (
          <>
            <HeroSection onNavigate={setView} />
            <FeatureSection onNavigate={setView} />
          </>
        )}

        {view === "catalog" && (
          <CatalogPage
            favorites={favorites}
            compareIds={activeCompareIds}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={toggleCompare}
            onOpenDetails={openDetails}
            onNavigate={setView}
          />
        )}

        {view === "quiz" && (
          <QuizWizard
            preferences={preferences}
            onChange={updatePreferences}
            onFinish={handleQuizFinish}
            onReset={resetPreferences}
          />
        )}

        {view === "results" && (
          <RecommendationResults
            preferences={preferences}
            favorites={favorites}
            compareIds={activeCompareIds}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={toggleCompare}
            onOpenDetails={openDetails}
            onNavigate={setView}
            onResetPreferences={resetPreferences}
          />
        )}

        {view === "compare" && (
          <CompareTable
            phones={comparePhones}
            onRemove={removeFromCompare}
            onClear={clearCompare}
            onOpenDetails={openDetails}
            onNavigate={setView}
          />
        )}
      </main>

      <SiteFooter onNavigate={setView} />

      {showCompareTray && (
        <CompareTray
          phones={comparePhones}
          onRemove={removeFromCompare}
          onClear={clearCompare}
          onOpenCompare={() => setView("compare")}
          onOpenDetails={openDetails}
          maxCompare={MAX_COMPARE}
        />
      )}

      {selectedPhone && (
        <PhoneDetailsModal
          phone={selectedPhone}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}