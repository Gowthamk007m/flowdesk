import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpen } from "lucide-react";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/cases",
    label: "Cases",
    icon: FolderOpen,
  },
];

export default function NavLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}