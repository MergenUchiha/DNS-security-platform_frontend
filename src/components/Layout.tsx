import { NavLink } from "react-router-dom";
import {
  Moon,
  Sun,
  Globe,
  Shield,
  Activity,
  LayoutDashboard,
  Search,
  FileText,
  Play,
  Wifi,
  LogOut,
  User,
} from "lucide-react";
import { clsx } from "clsx";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";
import { useAuth } from "../contexts/AuthContext";
import { useSession } from "../contexts/SessionContext";
import { ModeBadge } from "./ui";
import type { Lang } from "../i18n/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "tk", label: "TK" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const { username, logout } = useAuth();
  const { session } = useSession();

  const navItems = [
    {
      to: "/",
      label: t.nav.dashboard,
      icon: <LayoutDashboard size={15} />,
      end: true,
    },
    { to: "/dns", label: t.nav.dns, icon: <Search size={15} /> },
    { to: "/mitigation", label: t.nav.mitigation, icon: <Shield size={15} /> },
    { to: "/events", label: t.nav.events, icon: <Activity size={15} /> },
    { to: "/report", label: t.nav.report, icon: <FileText size={15} /> },
    { to: "/demo", label: t.nav.demo, icon: <Play size={15} /> },
    { to: "/health", label: t.nav.health, icon: <Wifi size={15} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0"
            style={{
              border: "1px solid rgba(20,184,166,0.5)",
              boxShadow: "0 0 10px rgba(20,184,166,0.2)",
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-white text-[11px] leading-tight">
              DNS Spoofing
            </p>
            <p className="font-mono text-[9px] text-cyber-400/80 leading-tight">
              Attack Simulation & Mitigation
            </p>
          </div>
          {session && (
            <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-gray-700/50">
              <ModeBadge mode={session.mode} />
              <span className="text-gray-500 text-xs font-mono">
                {session.id.slice(0, 8)}…
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all duration-150",
                  isActive
                    ? "bg-cyber-500/15 text-cyber-400 border border-cyber-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
                )
              }
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-gray-700/50 rounded-md p-0.5">
            <Globe size={12} className="text-gray-500 ml-1.5" />
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={clsx(
                  "px-2 py-1 rounded text-xs font-mono transition-all",
                  lang === l.code
                    ? "bg-cyber-500/20 text-cyber-400"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
            title={theme === "dark" ? t.general.lightMode : t.general.darkMode}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User + Logout */}
          {username && (
            <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-700/50">
              <span className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                <User size={12} />
                {username}
              </span>
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-gray-500 hover:text-danger-400 hover:bg-danger-500/10 transition-all"
                title={t.auth.logout}
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 text-gray-100">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-cyber-950/20 pointer-events-none" />
      <Navbar />
      <main className="relative pt-14 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
