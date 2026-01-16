import { Link } from "@tanstack/react-router";
import { Compass, Star, Search, User } from "lucide-react";

export function BottomTabNavigator() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 flex flex-row items-center justify-around pb-safe">
      <TabLink to="/explorer" label="Explorer" icon={Compass} />
      <TabLink to="/favoris" label="Favoris" icon={Star} />
      <TabLink to="/recherche" label="Rechercher" icon={Search} />
      <TabLink to="/profil" label="Moi" icon={User} />
    </div>
  );
}

interface TabLinkProps {
  to: string;
  label: string;
  icon: React.ElementType;
}

function TabLink({ to, label, icon: Icon }: TabLinkProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 no-underline"
      activeProps={{
        className: "text-blue-600", // Update with exact brand color if needed
      }}
    >
      <Icon size={24} strokeWidth={2} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </Link>
  );
}
