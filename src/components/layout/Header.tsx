import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  lang?: "pt" | "en";
}

const navItemsPt = [
  { label: "Início", href: "/#inicio" },
  { label: "Áreas de Atuação", href: "/#areas" },
  { label: "Novidades", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

const navItemsEn = [
  { label: "Home", href: "/en#inicio" },
  { label: "Practice Areas", href: "/en#areas" },
  { label: "News", href: "/blog" },
  { label: "Contact", href: "/en#contato" },
];

export function Header({ lang = "pt" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navItems = lang === "pt" ? navItemsPt : navItemsEn;

  const isActive = (href: string) => {
    if (href === "/blog") return location.pathname.startsWith("/blog");
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to={lang === "pt" ? "/" : "/en"} className="flex items-center gap-1">
          <span className="text-xl font-bold text-primary tracking-tight">
            JP<span className="text-accent">&</span>F Advogados
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-accent border-b-2 pb-0.5 ${
                isActive(item.href)
                  ? "border-accent text-accent"
                  : "border-transparent text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            <Link
              to="/"
              className={`px-2 py-1 rounded transition-colors ${
                lang === "pt"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              🇧🇷 PT
            </Link>
            <Link
              to="/en"
              className={`px-2 py-1 rounded transition-colors ${
                lang === "en"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              🇺🇸 EN
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-sm font-medium py-2 text-foreground hover:text-accent"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-border">
            <Link to="/" className="text-sm font-medium text-primary">🇧🇷 PT</Link>
            <Link to="/en" className="text-sm font-medium text-muted-foreground">🇺🇸 EN</Link>
          </div>
        </div>
      )}
    </header>
  );
}
