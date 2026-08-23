import { useProfileStore } from "@/store/useProfileStore";
import { MindProfile } from "@/components/profile/MindProfile";

export function ProfilePage() {
  const xp = useProfileStore((s) => s.xp);
  const streakDays = useProfileStore((s) => s.streakDays);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">Mind Profile</h1>
        <p className="text-sm text-slate-400">
          {xp} XP · {streakDays} day streak
        </p>
      </div>
      <MindProfile />
      <button
        onClick={() => {
          if (confirm("Reset all progress? This cannot be undone.")) resetProfile();
        }}
        className="text-sm text-slate-500 hover:text-rose-400"
      >
        Reset progress
      </button>
    </div>
  );
}
