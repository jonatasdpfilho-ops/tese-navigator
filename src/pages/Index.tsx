import { useState } from "react";
import { Scale, Building } from "lucide-react";
import { TESES } from "@/data/teses";
import { OPORTUNIDADES } from "@/data/oportunidades";
import { RadarTributario } from "@/components/RadarTributario";
import { DiagnosticoEmpresarial } from "@/components/DiagnosticoEmpresarial";

type Tab = "tributario" | "empresarial";

const Index = () => {
  const [tab, setTab] = useState<Tab>("tributario");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary-deep border-b border-primary-deep/50 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded grid place-items-center font-bold text-primary-deep text-sm">
              RT
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-tight">
                Radar Jurídico 2026
              </h1>
              <p className="text-[10px] text-white/60 leading-tight">
                Hackathon Jurídico · Tributário & Empresarial
              </p>
            </div>
          </div>
          <div className="text-[10px] text-accent-light/80 hidden sm:block uppercase tracking-wider">
            {TESES.length} teses · {OPORTUNIDADES.length} oportunidades
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-primary-deep border-b border-white/5 sticky top-14 z-40">
        <div className="container flex gap-1 overflow-x-auto">
          <TabButton active={tab === "tributario"} onClick={() => setTab("tributario")} icon={<Scale className="w-4 h-4" />}>
            Teses Tributárias
          </TabButton>
          <TabButton active={tab === "empresarial"} onClick={() => setTab("empresarial")} icon={<Building className="w-4 h-4" />}>
            Diagnóstico Empresarial
          </TabButton>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {tab === "tributario" ? (
          <RadarTributario onGoToEmpresarial={() => setTab("empresarial")} />
        ) : (
          <DiagnosticoEmpresarial onGoToTributario={() => setTab("tributario")} />
        )}
      </main>

      <footer className="bg-primary-deep text-white/70 mt-12 py-5 text-xs">
        <div className="container text-center">
          Radar Jurídico · Hackathon Jurídico 2026 · Powered by Lovable AI · LC 214/2025 · {TESES.length} teses tributárias · {OPORTUNIDADES.length} oportunidades empresariais
        </div>
      </footer>
    </div>
  );
};

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
        active
          ? "bg-primary text-white border-accent"
          : "text-white/70 border-transparent hover:text-white hover:border-accent/50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export default Index;
