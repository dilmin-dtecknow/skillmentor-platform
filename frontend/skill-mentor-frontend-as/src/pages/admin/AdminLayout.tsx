import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Create Subject", path: "/admin/subjects/create" },
  { label: "Create Mentor", path: "/admin/mentors/create" },
  { label: "Manage Bookings", path: "/admin/bookings" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border bg-card p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block rounded-lg px-4 py-2 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-2xl border bg-card p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}