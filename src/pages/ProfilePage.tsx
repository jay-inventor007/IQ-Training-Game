import { useProfileStore } from "@/store/useProfileStore";
import { MindProfile } from "@/components/profile/MindProfile";

export function ProfilePage() {
  const xp = useProfileStore((s) => s.xp);
  const streakDays = useProfileStore((s) => s.streakDays);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] tracking-widest text-console-muted">MIND PROFILE</div>
        <p className="font-mono text-xs text-console-muted mt-1">
          {xp} XP · {streakDays}D STREAK
        </p>
      </div>
      <MindProfile />
      <button
        onClick={() => {
          if (confirm("Reset all progress? This cannot be undone.")) resetProfile();
        }}
        className="font-mono text-[11px] tracking-widest text-console-muted hover:text-alarm transition"
      >
        RESET PROGRESS
      </button>
    </div>
  );
}
