import { Link, useRouterState } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Target,
  Files,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resume", label: "Meu Currículo", icon: FileText },
  { to: "/jobs", label: "Minhas Vagas", icon: BriefcaseBusiness },
  { to: "/matches", label: "Matches", icon: Target },
  { to: "/resumes", label: "Currículos Personalizados", icon: Files },
] as const;

const BOTTOM = [
  { to: "/settings", label: "Configurações", icon: Settings },
  { to: "/help", label: "Ajuda", icon: HelpCircle },
] as const;

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-start gap-3 px-4 py-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Sparkles className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-semibold text-foreground">JobMatch</span>
        <span className="block text-xs text-muted-foreground">Seu currículo trabalhando para você.</span>
      </span>
    </Link>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const render = (item: { to: string; label: string; icon: typeof Settings }) => {
    const active = pathname === item.to || pathname.startsWith(item.to + "/");
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary/15 text-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
        )}
      >
        <item.icon className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-3">
        <nav aria-label="Navegação principal" className="flex flex-col gap-1 pb-4">
          {NAV.map(render)}
        </nav>
      </ScrollArea>
      <Separator />
      <nav aria-label="Navegação secundária" className="flex flex-col gap-1 p-3">
        {BOTTOM.map(render)}
      </nav>
    </div>
  );
}

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r bg-sidebar lg:flex">
        <Brand />
        <Separator />
        <div className="flex-1 overflow-hidden pt-3">
          <NavItems />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Brand />
              <Separator />
              <div className="h-[calc(100vh-96px)] pt-3">
                <NavItems onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="truncate text-sm font-semibold">{title ?? "JobMatch"}</span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
