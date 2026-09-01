import { useEffect, useState } from "react";

export function SobreMimPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [personalPhoto, setPersonalPhoto] = useState({ src: "./eu.png", alt: "Foto pessoal" });
  const [overlayImage, setOverlayImage] = useState({ src: "./peixes.png", alt: "Detalhes do ateliê" });
  const [editingTarget, setEditingTarget] = useState<"photo" | "overlay" | null>(null);
  const [editedSrc, setEditedSrc] = useState("");
  const [editedAlt, setEditedAlt] = useState("");

  useEffect(() => {
    setIsAdmin(new URLSearchParams(window.location.search).get("admin") === "1");
  }, []);

  const startEdit = (target: "photo" | "overlay") => {
    setEditingTarget(target);
    const source = target === "photo" ? personalPhoto : overlayImage;
    setEditedSrc(source.src);
    setEditedAlt(source.alt);
  };

  const saveEdit = () => {
    if (editingTarget === "photo") {
      setPersonalPhoto({ src: editedSrc.trim() || personalPhoto.src, alt: editedAlt.trim() || personalPhoto.alt });
    }
    if (editingTarget === "overlay") {
      setOverlayImage({ src: editedSrc.trim() || overlayImage.src, alt: editedAlt.trim() || overlayImage.alt });
    }
    setEditingTarget(null);
  };

  const deleteImage = () => {
    if (editingTarget === "photo") {
      setPersonalPhoto({ src: "", alt: "" });
    }
    if (editingTarget === "overlay") {
      setOverlayImage({ src: "", alt: "" });
    }
    setEditingTarget(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1450px] px-4 py-8 pl-7 pr-14 sm:px-5 sm:py-10 lg:px-10 min-[2560px]:max-w-[3300px] min-[2560px]:px-16 min-[2560px]:py-14">
      <div className="mb-10 mt-6 flex flex-col items-start sm:mt-0">
        <p className="text-xs tracking-widest uppercase mb-2 text-left min-[2560px]:text-lg" style={{ color: "#83b5e0" }}>sobre mim</p>
        <h2 className="text-left text-3xl font-bold min-[2560px]:text-7xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--foreground)" }}>
          Quem sou eu
        </h2>
        <div className="mt-4 h-0.5 w-12 rounded" style={{ background: "#b8d8ff" }} />
      </div>

      {isAdmin && editingTarget ? (
        <div className="mb-8 rounded-[1.75rem] border border-[#e7e9f0] bg-[#f7f9ff] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#5c6a8a]">Editar imagem</h3>
          <p className="mt-2 text-sm text-[#6d6d7f]">Use o campo abaixo para atualizar o endereço da imagem e o texto alt.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#55657f]">
              URL da imagem
              <input
                className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-4 py-3 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                value={editedSrc}
                onChange={(event) => setEditedSrc(event.target.value)}
                placeholder="https://.../imagem.jpg"
              />
            </label>
            <label className="block text-xs font-semibold text-[#55657f]">
              Texto alt
              <input
                className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-4 py-3 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                value={editedAlt}
                onChange={(event) => setEditedAlt(event.target.value)}
                placeholder="Descrição da imagem"
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-full bg-[#83b5e0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6d97c9]"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditingTarget(null)}
              className="rounded-full border border-[#83b5e0] bg-white px-5 py-3 text-sm font-bold text-[#5c6a8a] transition hover:bg-[#f0f5ff]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={deleteImage}
              className="rounded-full border border-[#b24b59] bg-white px-5 py-3 text-sm font-bold text-[#b24b59] transition hover:bg-[#fde7ec]"
            >
              Excluir imagem
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-stretch min-[2560px]:grid-cols-[300px_minmax(0,1fr)]">
        <div className="mx-auto flex flex-col items-center gap-5 lg:mx-0">
          <div className="relative h-[500px] w-full max-w-[360px] overflow-hidden rounded-2xl sm:h-[620px] sm:max-w-[420px] lg:h-[520px] lg:max-w-[340px] min-[2560px]:h-[400px] min-[2560px]:max-w-[280px]" style={{ border: "3px solid rgba(155,135,194,0.3)", boxShadow: "0 8px 24px rgba(58,36,20,0.12)" }}>
            {personalPhoto.src ? (
              <img
                src={personalPhoto.src}
                alt={personalPhoto.alt}
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.15)", objectPosition: "35% center" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f7f7fb] text-sm text-[#6d6d7f]">
                Foto pessoal removida
              </div>
            )}
          </div>
          <div
            className="w-full max-w-72 rounded-xl px-5 py-4 text-center"
            style={{ background: "#d7e8ff", border: "1px solid #aac3e3" }}
          >
            <p className="text-xs min-[2560px]:text-lg" style={{ color: "var(--muted-foreground)" }}>criando desde</p>
            <p className="text-2xl font-bold min-[2560px]:text-5xl" style={{ fontFamily: "Playfair Display, serif", color: "#d77d95" }}>2026</p>
          </div>
        </div>

        <div className="flex h-full flex-col gap-6">
          <div
            className="rounded-2xl p-8"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(58,36,20,0.06)" }}
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-0.5 min-[2560px]:text-5xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--foreground)" }}>
              Oii! Sou a Bia!
              <img src="./cafe_transparente.png" alt="ícone de café" className="inline h-10 w-10" style={{ transform: "translateY(-2px)" }} />
            </h3>
            <p className="text-sm leading-relaxed mb-4 text-justify min-[2560px]:text-[1.7rem] min-[2560px]:leading-10" style={{ color: "var(--muted-foreground)" }}>
              Criadora apaixonada por café, gatinhos e arte.
            </p>
            <p className="text-sm leading-relaxed text-justify min-[2560px]:text-[1.7rem] min-[2560px]:leading-10" style={{ color: "var(--muted-foreground)" }}>
              Por muito tempo, minhas pinturas e peças de crochê ficaram apenas comigo ou foram presentes para pessoas próximas. A vontade de compartilhar esse trabalho sempre existiu, mas a coragem demorou um pouco para chegar. Este ateliê nasce justamente desse momento da minha vida, a decisão de acreditar na minha arte e dividir com outras pessoas tudo aquilo que gosto de criar.
            </p>
          </div>

          <div
            className="mx-auto flex w-fit max-w-full flex-col items-center gap-2 rounded-2xl px-6 py-4 text-center min-[2560px]:gap-4 min-[2560px]:px-10 min-[2560px]:py-6"
            style={{ background: "linear-gradient(135deg, rgba(191,122,74,0.12), rgba(201,122,138,0.12))", border: "1px solid rgba(255,255,255,0.75)" }}
          >
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-white/90 shadow-sm min-[2560px]:h-24 min-[2560px]:w-24">
              <img
                src="./CAMPINK.png"
                alt="Gatinho com café"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold min-[2560px]:text-3xl" style={{ color: "var(--foreground)" }}>Encomendas abertas!</p>
              <p className="text-xs mt-0.5 min-[2560px]:text-xl" style={{ color: "var(--muted-foreground)" }}>
                Me manda mensagem no Instagram para mais informações.
              </p>
              <a href="https://instagram.com/ateliedabame" target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-semibold text-[#d77d95] transition hover:text-[#a55b72] min-[2560px]:text-3xl">
                @ateliedabame
              </a>
            </div>
          </div>

        </div>
      </div>

      {isAdmin && editingTarget ? (
        <div className="mt-8 rounded-[1.5rem] border border-[#e7e9f0] bg-[#f7f9ff] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#5c6a8a]">Editar imagem da página</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#55657f]">
              URL da imagem
              <input
                className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-3 py-2 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                value={editedSrc}
                onChange={(event) => setEditedSrc(event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-[#55657f]">
              Texto alt
              <input
                className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-3 py-2 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                value={editedAlt}
                onChange={(event) => setEditedAlt(event.target.value)}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveEdit}
              className="rounded-full bg-[#83b5e0] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#6d97c9]"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditingTarget(null)}
              className="rounded-full border border-[#83b5e0] bg-white px-4 py-2 text-xs font-bold text-[#5c6a8a] transition hover:bg-[#f0f5ff]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={deleteImage}
              className="rounded-full border border-[#b24b59] bg-white px-4 py-2 text-xs font-bold text-[#b24b59] transition hover:bg-[#fde7ec]"
            >
              Excluir imagem
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
