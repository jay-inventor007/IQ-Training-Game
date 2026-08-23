import { NavLink, Outlet } from "react-router-dom";
import { useProfileStore } from "@/store/useProfileStore";

const NAV_LINKS = [
  { to: "/", label: "HOME", end: true },
  { to: "/train", label: "TRAIN" },
  { to: "/assess", label: "ASSESS" },
  { to: "/profile", label: "PROFILE" },
];

export function AppShell() {
  const xp = useProfileStore((s) => s.xp);
  const streakDays = useProfileStore((s) => s.streakDays);

  return (
    <div className="min-h-screen flex flex-col bg-console-bg">
      <header className="border-b border-console-line px-4 sm:px-8">
        <div className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-channel-flu shadow-[0_0_6px_theme(colors.channel.flu)]" aria-hidden="true" />
            <span className="font-mono font-semibold tracking-[0.2em] text-sm sm:text-base">COGNOSCOPE</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs whitespace-nowrap shrink-0">
            <span>
              <span className="text-console-muted mr-1">XP</span>
              <span className="text-console-text tabular-nums">{xp}</span>
            </span>
            <span>
              <span className="text-console-muted mr-1">STRK</span>
              <span className="text-console-text tabular-nums">{streakDays}d</span>
            </span>
          </div>
        </div>
        <nav className="flex items-center -mx-1 px-1 overflow-x-auto border-t border-console-line/70">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 sm:px-4 py-3 min-h-[44px] font-mono text-[11px] tracking-widest border-r border-console-line/70 whitespace-nowrap transition active:bg-console-panel2 ${
                  isActive ? "text-console-text bg-console-panel" : "text-console-muted hover:text-console-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-channel-flu" : "bg-console-line"}`} aria-hidden="true" />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 px-4 sm:px-8 py-8 bg-grid-fine bg-grid">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
