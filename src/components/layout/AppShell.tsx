import { NavLink, Outlet } from "react-router-dom";
import { useProfileStore } from "@/store/useProfileStore";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/train", label: "Training" },
  { to: "/assess", label: "Assessment" },
  { to: "/profile", label: "Profile" },
];

export function AppShell() {
  const xp = useProfileStore((s) => s.xp);
  const streakDays = useProfileStore((s) => s.streakDays);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold tracking-tight text-lg whitespace-nowrap">Cognitive Trainer</span>
          <div className="flex items-center gap-3 text-sm text-slate-400 whitespace-nowrap shrink-0">
            <span title="Total XP">⚡ {xp}</span>
            <span title="Day streak">🔥 {streakDays}</span>
          </div>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 mt-2 -mx-1 px-1 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  isActive ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 px-4 sm:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
