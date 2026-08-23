import { useCallback, useMemo, useRef, useState } from "react";
import { GENERATORS } from "@/engine/generators";
import { generateValidated } from "@/engine/validation";
import { nextItemDifficulty } from "@/engine/ability";
import { mulberry32, randomSeed } from "@/lib/random";
import { useProfileStore } from "@/store/useProfileStore";
import type { ChallengeItem, ChallengeResult, Domain, SessionMode } from "@/engine/types";

interface UseChallengeSessionOptions {
  domain: Domain;
  mode: SessionMode;
  /** Number of items before an assessment session ends. Ignored in training mode (open-ended). */
  sessionLength?: number;
}

export interface SessionSummary {
  itemsAnswered: number;
  correctCount: number;
  averageResponseTimeMs: number;
}

/**
 * Drives one adaptive session for a domain: generates a validated item near
 * the player's current ability, waits for a result, feeds it back into the
 * profile store, and either generates the next item (training) or ends the
 * session once `sessionLength` items have been answered (assessment).
 */
export function useChallengeSession({ domain, mode, sessionLength = 10 }: UseChallengeSessionOptions) {
  const recordResult = useProfileStore((s) => s.recordResult);
  const recordSessionStart = useProfileStore((s) => s.recordSessionStart);

  const rngRef = useRef(mulberry32(randomSeed()));
  const answeredCountRef = useRef(0);
  const [currentItem, setCurrentItem] = useState<ChallengeItem | null>(null);
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [finished, setFinished] = useState(false);

  const generateNext = useCallback(() => {
    const profile = useProfileStore.getState().domains[domain];
    const difficulty = nextItemDifficulty(profile.ability, rngRef.current);
    const item = generateValidated(GENERATORS[domain], difficulty, rngRef.current, profile.recentSignatures);
    setCurrentItem(item);
  }, [domain]);

  const start = useCallback(() => {
    recordSessionStart();
    answeredCountRef.current = 0;
    setResults([]);
    setFinished(false);
    generateNext();
  }, [generateNext, recordSessionStart]);

  const submitResult = useCallback(
    (result: ChallengeResult) => {
      recordResult(domain, {
        correct: result.correct,
        difficulty: result.item.difficulty,
        signature: result.item.signature,
      });
      setResults((prev) => [...prev, result]);
      answeredCountRef.current += 1;
      if (mode === "assessment" && answeredCountRef.current >= sessionLength) {
        setFinished(true);
        setCurrentItem(null);
      } else {
        generateNext();
      }
    },
    [domain, mode, sessionLength, recordResult, generateNext],
  );

  const summary: SessionSummary = useMemo(() => {
    const correctCount = results.filter((r) => r.correct).length;
    const averageResponseTimeMs = results.length ? results.reduce((sum, r) => sum + r.responseTimeMs, 0) / results.length : 0;
    return { itemsAnswered: results.length, correctCount, averageResponseTimeMs };
  }, [results]);

  return { currentItem, results, summary, finished, start, submitResult };
}
