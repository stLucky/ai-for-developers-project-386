import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isPublic = location.pathname.startsWith("/public") || location.pathname === "/";

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 font-semibold text-lg">Call Booking</div>
        <nav className="flex gap-6">
          <Link
            to="/public"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isPublic ? "text-primary" : "text-muted-foreground"
            )}
          >
            Публичная страница
          </Link>
          <Link
            to="/admin"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isAdmin ? "text-primary" : "text-muted-foreground"
            )}
          >
            Администрирование
          </Link>
        </nav>
      </div>
    </header>
  );
}
