import { useState } from "react";
import { Home, Palette, Sparkles, UserRound } from "lucide-react";
import { HomePage } from "./components/pages/HomePage";
import { ArtesPage } from "./components/pages/ArtesPage";
import { CrochePage } from "./components/pages/CrochePage";
import { SobreMimPage } from "./components/pages/SobreMimPage";

type Page = "inicio" | "artes" | "croche" | "sobre";

const TABS: { id: Page; label: string; color: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Início", color: "#d77d95", icon: Home },
  { id: "artes", label: "Artes", color: "#c87890", icon: Palette },
  { id: "croche", label: "Crochê", color: "#8cae83", icon: Sparkles },
  { id: "sobre", label: "Sobre mim", color: "#aa8cc4", icon: UserRound },
];

export default function App() {
  const [page, setPage] = useState<Page>("inicio");
  const activeTab = TABS.find((tab) => tab.id === page);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcecf2] p-4 pt-10 sm:p-6 lg:p-10" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-[390px] sm:min-h-[calc(100vh-3rem)] sm:max-w-[1700px] lg:min-h-[calc(100vh-5rem)] min-[2560px]:max-w-[3600px]">
        <div className="relative -ml-3 flex min-h-[inherit] w-[calc(100%+0.75rem)] flex-col rounded-[2rem] bg-[#f3cbd8] p-1.5 shadow-[0_20px_60px_rgba(123,68,84,0.16)] sm:ml-0 sm:w-auto sm:rounded-[1.6rem] sm:p-3">
          <div className="pointer-events-none absolute right-2 top-[-60px] z-30 h-32 w-auto overflow-visible sm:left-[-10px] sm:right-auto sm:top-[-42px] sm:z-10 sm:h-44 min-[2560px]:top-[-40px] min-[2560px]:h-60" style={{ background: "transparent" }}>
            <img src="./miau.png" alt="Gatinho espiando por trás da aba" className="h-full w-auto object-contain" style={{ background: "transparent" }} />
          </div>
          <div className="relative z-20 hidden flex-wrap items-end justify-start gap-0 pt-1 sm:flex sm:gap-1 sm:px-2 sm:pl-60 md:flex-nowrap md:gap-0 md:pl-64 lg:px-0 lg:pl-[248px] min-[2560px]:pt-0">
            {TABS.map((tab) => {
              const isActive = tab.id === page;
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} className="relative min-w-0 flex-1 rounded-t-xl px-1 py-3 text-[11px] font-bold transition-all sm:min-w-[56px] sm:max-w-[64px] sm:px-0 md:min-w-0 md:max-w-none md:w-[115px] md:flex-none md:px-3 lg:w-[145px] lg:px-4 min-[2560px]:w-[220px] min-[2560px]:px-8"
                  style={{ background: isActive ? "#fffaf8" : "rgba(255,250,248,.74)", color: isActive ? "#821663" : "#79555f", transform: isActive ? "translateY(3px)" : "translateY(7px)" }}>
                  {tab.label}
                </button>
              );
            })}
          </div>

          <nav className="absolute right-0 top-16 z-40 grid h-[calc(100dvh-8.75rem)] w-9 grid-rows-4 gap-1 sm:hidden" aria-label="Navegação móvel">
            {TABS.map((tab) => {
              const isActive = tab.id === page;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPage(tab.id)}
                  className="h-full w-full rounded-l-lg border border-r-0 border-[#efdce1] px-1 py-1.5 text-[9px] font-bold shadow-sm transition"
                  style={{ background: isActive ? "#fffaf8" : "#f8e1eb", color: isActive ? "#821663" : "#79555f", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="grid min-h-[680px] flex-1 grid-cols-1 overflow-hidden rounded-[1.65rem] bg-[#fffaf8] shadow-[0_8px_24px_rgba(123,68,84,0.14)] sm:grid-cols-[minmax(175px,250px)_1fr] sm:rounded-2xl min-[2560px]:mt-0 min-[2560px]:grid-cols-[minmax(300px,320px)_1fr]">
            <aside className="relative hidden border-r border-[#f2dfe5] bg-[#fffafb] p-3 sm:block sm:p-6 min-[2560px]:p-5">
              <div className="mb-9 hidden text-center min-[440px]:block translate-y-6 min-[2560px]:translate-y-12">
                <p className="font-bold leading-none text-[#593d47] min-[2560px]:text-[32px]" style={{ fontFamily: "Playfair Display, serif" }}>Ateliê da Bame</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#b0808d] min-[2560px]:text-[18px]">pinturas & crochê</p>
              </div>

              <nav className="flex flex-col gap-1.5 min-[2560px]:mt-18 min-[2560px]:gap-2" aria-label="Navegação lateral">
                {TABS.map(({ id, label, icon: Icon, color }) => (
                    <button key={id} onClick={() => setPage(id)} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left text-xs font-semibold transition sm:text-sm min-[2560px]:gap-4 min-[2560px]:px-4 min-[2560px]:py-2.5 min-[2560px]:text-[18px]" style={{ color: page === id ? "#821663" : "#765963", background: page === id ? "#f8e1eb" : "transparent" }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center min-[2560px]:h-[48px] min-[2560px]:w-[48px]">
                      {id === "croche" ? <img src="./gato-croche-atual.png" alt="" className="h-6 w-6 object-contain min-[2560px]:h-[48px] min-[2560px]:w-[48px]" style={{ filter: "saturate(0.9) brightness(0.95)" }} /> : <Icon size={18} className="shrink-0 min-[2560px]:h-[48px] min-[2560px]:w-[48px]" />}
                    </span>
                    <span className="hidden min-[440px]:block leading-none min-[2560px]:text-[36px]">{label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <main className="min-w-0 bg-[radial-gradient(circle_at_96%_5%,rgba(248,205,217,.42),transparent_23%),#fffaf8]">
              {page === "inicio" && <HomePage />}
              {page === "artes" && <ArtesPage />}
              {page === "croche" && <CrochePage />}
              {page === "sobre" && <SobreMimPage />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
