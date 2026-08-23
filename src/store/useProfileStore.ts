import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DOMAINS, type Domain } from "@/engine/types";
import { INITIAL_ABILITY, updateAbility, type AbilityState } from "@/engine/ability";

const RECENT_SIGNATURES_LIMIT = 20;

export interface DomainProfile {
  ability: AbilityState;
  itemsCorrect: number;
  recentSignatures: string[];
}

function freshDomainProfile(): DomainProfile {
  return { ability: INITIAL_ABILITY, itemsCorrect: 0, recentSignatures: [] };
}

function freshDomains(): Record<Domain, DomainProfile> {
  return Object.fromEntries(DOMAINS.map((d) => [d, freshDomainProfile()])) as Record<Domain, DomainProfile>;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isConsecutiveDay(previousIso: string, currentIso: string): boolean {
  const diffMs = new Date(currentIso).getTime() - new Date(previousIso).getTime();
  return Math.round(diffMs / 86_400_000) === 1;
}

interface ProfileState {
  domains: Record<Domain, DomainProfile>;
  xp: number;
  streakDays: number;
  lastPlayedDate: string | null;
  recordSessionStart: () => void;
  recordResult: (domain: Domain, params: { correct: boolean; difficulty: number; signature: string }) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      domains: freshDomains(),
      xp: 0,
      streakDays: 0,
      lastPlayedDate: null,

      recordSessionStart: () => {
        const today = todayIso();
        const { lastPlayedDate, streakDays } = get();
        if (lastPlayedDate === today) return;
        const nextStreak = lastPlayedDate && isConsecutiveDay(lastPlayedDate, today) ? streakDays + 1 : 1;
        set({ lastPlayedDate: today, streakDays: nextStreak });
      },

      recordResult: (domain, { correct, difficulty, signature }) => {
        set((state) => {
          const current = state.domains[domain];
          const nextAbility = updateAbility(current.ability, difficulty, correct);
          const nextSignatures = [...current.recentSignatures, signature].slice(-RECENT_SIGNATURES_LIMIT);
          const xpGain = correct ? 10 + Math.round(Math.max(0, difficulty) * 5) : 1;
          return {
            xp: state.xp + xpGain,
            domains: {
              ...state.domains,
              [domain]: {
                ability: nextAbility,
                itemsCorrect: current.itemsCorrect + (correct ? 1 : 0),
                recentSignatures: nextSignatures,
              },
            },
          };
        });
      },

      resetProfile: () => set({ domains: freshDomains(), xp: 0, streakDays: 0, lastPlayedDate: null }),
    }),
    { name: "iq-trainer-profile" },
  ),
);
