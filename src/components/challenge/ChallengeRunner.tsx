import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import type { ChallengeItem, ChallengeResult, Domain } from "@/engine/types";
import { OptionGrid } from "./OptionGrid";
import { TimerBar } from "./TimerBar";
import { MatrixStimulus } from "@/components/domains/MatrixItem";
import { SequenceStimulus } from "@/components/domains/SequenceRecallItem";
import { RotationStimulus } from "@/components/domains/RotationItem";
import { DiscriminationStimulus } from "@/components/domains/DiscriminationItem";
import { NumberPatternStimulus } from "@/components/domains/NumberPatternItem";

const FEEDBACK_DELAY_MS = 650;

/**
 * Each domain component actually takes a `ChallengeItem<ItsOwnContent>`; this
 * registry is intentionally type-erased to `ChallengeItem` (unknown content)
 * so the five domain views can share one lookup keyed by `item.domain`.
 */
type StimulusComponent = ComponentType<{ item: ChallengeItem; onReady: () => void }>;

const STIMULUS_VIEWS: Record<Domain, StimulusComponent> = {
  fluidReasoning: MatrixStimulus as StimulusComponent,
  workingMemory: SequenceStimulus as StimulusComponent,
  spatialReasoning: RotationStimulus as StimulusComponent,
  processingSpeed: DiscriminationStimulus as StimulusComponent,
  quantitativeReasoning: NumberPatternStimulus as StimulusComponent,
};

interface ChallengeRunnerProps {
  item: ChallengeItem;
  onComplete: (result: ChallengeResult) => void;
}

export function ChallengeRunner({ item, onComplete }: ChallengeRunnerProps) {
  // Keyed by item.id so every new item gets a fresh mount instead of a reset
  // effect — an effect-based reset here would run in parent-after-child
  // order and could clobber the state the stimulus view's own mount effect
  // (e.g. onReady) just set.
  return <ChallengeRunnerInner key={item.id} item={item} onComplete={onComplete} />;
}

function ChallengeRunnerInner({ item, onComplete }: ChallengeRunnerProps) {
  const [optionsReady, setOptionsReady] = useState(false);
  const [remainingMs, setRemainingMs] = useState(item.timeLimitMs ?? 0);
  const [feedback, setFeedback] = useState<{ selectedOptionId: string | null; correct: boolean } | null>(null);
  const readyAtRef = useRef<number | null>(null);
  const answeredRef = useRef(false);

  const handleReady = useCallback(() => {
    readyAtRef.current = performance.now();
    setOptionsReady(true);
  }, []);

  const submit = useCallback(
    (selectedOptionId: string | null, timedOut: boolean) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      const responseTimeMs = readyAtRef.current != null ? performance.now() - readyAtRef.current : 0;
      const correct = !timedOut && selectedOptionId === item.correctOptionId;
      setFeedback({ selectedOptionId, correct });
      window.setTimeout(() => {
        onComplete({ item, selectedOptionId, correct, responseTimeMs, timedOut });
      }, FEEDBACK_DELAY_MS);
    },
    [item, onComplete],
  );

  useEffect(() => {
    if (!optionsReady || item.timeLimitMs == null || feedback) return;
    const start = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, item.timeLimitMs! - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0) {
        window.clearInterval(intervalId);
        submit(null, true);
      }
    }, 80);
    return () => window.clearInterval(intervalId);
  }, [optionsReady, item.timeLimitMs, feedback, submit]);

  const StimulusView = STIMULUS_VIEWS[item.domain];

  return (
    <div>
      <StimulusView item={item} onReady={handleReady} />
      {optionsReady && (
        <>
          {item.timeLimitMs != null && <TimerBar remainingMs={remainingMs} totalMs={item.timeLimitMs} />}
          <OptionGrid
            item={item}
            onSelect={(id) => submit(id, false)}
            disabled={!!feedback}
            revealCorrectId={feedback ? item.correctOptionId : null}
            selectedId={feedback?.selectedOptionId ?? null}
          />
          {feedback && (
            <p className={`mt-3 text-sm font-medium ${feedback.correct ? "text-emerald-400" : "text-rose-400"}`}>
              {feedback.correct ? "Correct" : "Not quite"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
