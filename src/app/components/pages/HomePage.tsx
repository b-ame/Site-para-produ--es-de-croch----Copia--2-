import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

const HOME_IMAGES_KEY = "home-carousel-images";
const DEFAULT_HOME_IMAGES = [
  { src: "./cartao.png", alt: "Cartão artesanal" },
  { src: "./snopy.jpeg", alt: "Snoopy artesanal" },
  { src: "./limao.jpeg", alt: "Limão artesanal" },
  { src: "./homephoto.png", alt: "Imagem do ateliê" },
  { src: "./copo.jpeg", alt: "Copo artesanal" },
];

export function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [images, setImages] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(HOME_IMAGES_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // ignore invalid data
        }
      }
    }

    return DEFAULT_HOME_IMAGES;
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedSrc, setEditedSrc] = useState("");
  const [editedAlt, setEditedAlt] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  useEffect(() => {
    setIsAdmin(new URLSearchParams(window.location.search).get("admin") === "1");
    const raw = window.localStorage.getItem(HOME_IMAGES_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setImages(parsed);
        }
      } catch {
        // ignore invalid data
      }
    }
  }, []);

  const startEditImage = (index: number) => {
    setEditIndex(index);
    setEditedSrc(images[index].src);
    setEditedAlt(images[index].alt);
  };

  const saveImageEdit = () => {
    if (editIndex === null) return;
    const next = images.map((item, index) =>
      index === editIndex ? { src: editedSrc.trim() || item.src, alt: editedAlt.trim() || item.alt } : item,
    );
    setImages(next);
    window.localStorage.setItem(HOME_IMAGES_KEY, JSON.stringify(next));
    setEditIndex(null);
  };

  const deleteImage = () => {
    if (editIndex === null) return;
    const next = images.filter((_, index) => index !== editIndex);
    setImages(next);
    window.localStorage.setItem(HOME_IMAGES_KEY, JSON.stringify(next));
    setEditIndex(null);
  };

  const addImage = () => {
    const trimmedSrc = newImageSrc.trim();
    if (!trimmedSrc) return;
    const next = [...images, { src: trimmedSrc, alt: newImageAlt.trim() || "Imagem" }];
    setImages(next);
    window.localStorage.setItem(HOME_IMAGES_KEY, JSON.stringify(next));
    setNewImageSrc("");
    setNewImageAlt("");
    setIsAddingImage(false);
  };

  const cancelAddImage = () => {
    setIsAddingImage(false);
    setNewImageSrc("");
    setNewImageAlt("");
  };

  // Mantém os links que já foram salvos no navegador compatíveis com a versão publicada em subpastas.
  const resolveImageSrc = (src: string) => (src.startsWith("/") ? `.${src}` : src);

  return (
    <div className="flex min-h-0 items-start p-3 pl-6 pr-14 sm:min-h-[680px] sm:items-center sm:p-6 lg:p-10 min-[2560px]:p-16">
      <section className="relative mx-auto grid min-h-0 w-full min-w-0 max-w-none gap-0 overflow-visible bg-transparent sm:max-w-[1500px] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-[#efdce1] sm:bg-white sm:shadow-[0_12px_32px_rgba(123,68,84,.1)] md:grid-cols-1 lg:min-h-[660px] lg:grid-cols-[1.25fr_.75fr] lg:gap-8 xl:grid-cols-[1.2fr_.8fr] xl:gap-10 min-[2560px]:max-w-[3300px] min-[2560px]:gap-16">
        <div className="relative order-2 space-y-6 px-3 pb-5 pt-8 sm:space-y-8 sm:px-10 sm:pb-10 sm:pt-6 md:p-10 lg:order-none min-[2560px]:space-y-8 min-[2560px]:p-20">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setIsAddingImage(true);
                setEditIndex(null);
              }}
              className="absolute right-4 top-4 z-20 rounded-full border border-[#d77d95] bg-white px-4 py-2 text-[11px] font-semibold text-[#7d5f6f] shadow-sm transition hover:bg-[#fff1f5]"
            >
              Adicionar imagem
            </button>
          ) : null}
          <p className="hidden text-[10px] font-bold uppercase tracking-[.18em] text-[#c87890] sm:block sm:text-xs sm:tracking-[.2em] min-[2560px]:text-xl">Bem-vindo(a) ao meu ateliê</p>
          <div className="hidden max-w-full sm:block">
            <h1 className="text-3xl font-bold leading-tight text-[#593d47] sm:text-[3.6rem] min-[2560px]:text-[7rem]" style={{ fontFamily: "Playfair Display, serif" }}>
              Bom ver você aqui.
            </h1>
            <p className="mt-1 text-lg font-semibold leading-snug text-[#7d5f6f] sm:mt-2 sm:text-[2rem] min-[2560px]:text-[3.75rem]">
              Explore pelas minhas criações.
            </p>
          </div>
          <div className="max-w-xl space-y-2 text-xs leading-5 text-[#876b74] sm:space-y-3 sm:text-lg sm:leading-8 min-[2560px]:max-w-4xl min-[2560px]:text-[2.35rem] min-[2560px]:leading-10">
            <p>Arte feita à mão para levar mais aconchego e delicadeza ao seu lar.</p>
            <p>Conheça os meus trabalhos em crochê e as artes que fazem parte deste cantinho.</p>
          </div>
          <div className="mt-4 border-t border-[#f1e0e3] pt-4 sm:mt-4 sm:pt-4">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#a17a85] min-[2560px]:text-xl">Acompanhe minhas criações</p>
            <a href="https://instagram.com/ateliedabame" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#d77d95] transition hover:text-[#b95873] min-[2560px]:text-3xl">
              <Instagram size={19} /> @ateliedabame
            </a>
          </div>
        </div>
        <div className="order-1 flex min-h-[480px] min-w-0 flex-col items-center justify-center bg-transparent px-3 pb-4 pt-6 sm:min-h-[310px] sm:rounded-[1.75rem] sm:bg-[#fff0f6] sm:p-5 md:min-h-[310px] md:p-5 lg:order-none lg:min-h-full lg:p-8 min-[2560px]:p-16">
          <div className="mb-6 text-center sm:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87890]">Bem-vindo(a) ao meu ateliê</p>
            <h1 className="mt-1 text-3xl font-bold leading-tight text-[#593d47]" style={{ fontFamily: "Playfair Display, serif" }}>Bom ver você aqui.</h1>
            <p className="mt-1 text-base font-semibold text-[#7d5f6f]">Explore pelas minhas criações.</p>
          </div>
          <div className="w-full min-w-0 max-w-[460px] space-y-5 lg:max-w-[520px] min-[2560px]:max-w-[850px] min-[2560px]:space-y-8">
            {isAdmin && editIndex !== null ? (
              <div className="rounded-[1.5rem] border border-[#f3d4dd] bg-[#fff5f7] p-6 shadow-xl ring-1 ring-[#d77d95]/20">
                <h3 className="text-base font-semibold text-[#8f5c74]">Editar imagem do carrossel</h3>
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-semibold text-[#7a5665]">
                    URL da imagem
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-4 py-3 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                      value={editedSrc}
                      onChange={(event) => setEditedSrc(event.target.value)}
                      placeholder="https://.../imagem.jpg"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#7a5665]">
                    Texto alt
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-4 py-3 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                      value={editedAlt}
                      onChange={(event) => setEditedAlt(event.target.value)}
                      placeholder="Descrição da imagem"
                    />
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={saveImageEdit}
                    className="rounded-full bg-[#D77D95] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b95b7b]"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditIndex(null)}
                    className="rounded-full border border-[#d77d95] bg-white px-5 py-3 text-sm font-bold text-[#7d5f6f] transition hover:bg-[#fff1f5]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={deleteImage}
                    className="rounded-full border border-[#d24f61] bg-white px-5 py-3 text-sm font-bold text-[#b24b59] transition hover:bg-[#fee6ea]"
                  >
                    Excluir imagem
                  </button>
                </div>
              </div>
            ) : null}
            {isAdmin && isAddingImage ? (
              <div className="rounded-[1.5rem] border border-[#d7dde9] bg-[#f7f7ff] p-6 shadow-sm">
                <h3 className="text-base font-semibold text-[#5c6a8a]">Adicionar nova imagem</h3>
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-semibold text-[#55657f]">
                    URL da imagem
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-4 py-3 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                      value={newImageSrc}
                      onChange={(event) => setNewImageSrc(event.target.value)}
                      placeholder="https://.../imagem.jpg"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#55657f]">
                    Texto alt
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#d7dde9] bg-white px-4 py-3 text-sm text-[#2f3a4a] outline-none focus:border-[#8fa0c3]"
                      value={newImageAlt}
                      onChange={(event) => setNewImageAlt(event.target.value)}
                      placeholder="Descrição da imagem"
                    />
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addImage}
                    className="rounded-full bg-[#83b5e0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6d97c9]"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddImage}
                    className="rounded-full border border-[#83b5e0] bg-white px-5 py-3 text-sm font-bold text-[#5c6a8a] transition hover:bg-[#f0f5ff]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}
            <Carousel key={images.map((image) => image.src).join("|")} className="relative mx-auto w-full" opts={{ loop: true }}>
              <CarouselContent className="pl-4">
                {images.map((image, index) => (
                  <CarouselItem key={image.src + index}>
                    <div className="relative mx-auto min-w-[52vw] max-w-[190px] overflow-hidden rounded-2xl bg-transparent shadow-sm sm:min-w-[200px] sm:max-w-[240px] sm:aspect-[3/5] lg:min-w-[240px] lg:max-w-[280px] lg:aspect-[3/5] min-[2560px]:min-w-[420px] min-[2560px]:max-w-[520px]">
                      <div className="aspect-[2/3] sm:aspect-[3/5] lg:aspect-[3/5]">
                        <img
                          src={resolveImageSrc(image.src)}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                          style={{ objectPosition: "center 65%", transform: "scale(1.01)" }}
                        />
                      </div>
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => startEditImage(index)}
                          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#8a5b6e] shadow-sm"
                        >
                          Editar
                        </button>
                      ) : null}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="!-left-7 sm:!-left-4" aria-label="Anterior" />
              <CarouselNext className="!-right-7 sm:!-right-4" aria-label="Próximo" />
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}
