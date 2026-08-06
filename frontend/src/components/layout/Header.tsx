import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

import MobileSidebar from "./MobileSidebar";

function getInitials(firstName?: string, lastName?: string, email?: string) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((name) => name?.[0])
    .join("");

  return initials || email?.[0]?.toUpperCase() || "U";
}

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <h2 className="text-lg font-semibold lg:hidden">
          FlowDesk
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm md:block">
          <p className="font-medium leading-none">
            {user?.first_name || user?.email || "User"}
          </p>
          {user?.organization_name && (
            <p className="mt-1 text-xs text-muted-foreground">
              {user.organization_name}
            </p>
          )}
        </div>

        <Avatar className="h-9 w-9">
          <AvatarFallback>
            {getInitials(user?.first_name, user?.last_name, user?.email)}
          </AvatarFallback>
        </Avatar>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          onClick={() => void logout()}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
