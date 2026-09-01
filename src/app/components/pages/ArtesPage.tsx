import { useEffect, useState } from "react";
import { X } from "lucide-react";

const LOCAL_STORAGE_KEY = "artes-gallery-items";
const LOCAL_STORAGE_DELETED_KEY = "artes-gallery-deleted";

type ArtItemType = "Quadro" | "Pedra" | "Concha" | "Imã";

type ArtItem = {
  id: number;
  title: string;
  medium: string;
  type: ArtItemType;
  year: string;
  description: string;
  dimensions?: string;
  price: string;
  images: string[];
  isCustom?: boolean;
};

const ART_ITEMS: ArtItem[] = [
  {
    id: 1,
    title: "Natureza em Repouso",
    medium: "Carvão sobre tela",
    type: "Quadro",
    year: "2026",
    description: "Pintura feita com carvão preto e branco sobre papel kraft, emoldurada com moldura preta de acetato.",
    dimensions: "24 × 17 cm",
    price: "R$ 90,00",
    images: [
      "./vaso.jpeg?v=20260901-2",
      "./vaso.jpeg?v=20260901-2",
      "./vaso.jpeg?v=20260901-2",
    ],
  },
  {
    id: 2,
    title: "Pedra Van Gogh",
    medium: "Acrílica sobre pedra decorativa",
    type: "Pedra",
    year: "2026",
    description: "Pintura com tinta acrílica sob pedra decorativa",
    dimensions: "5 × 6 cm",
    price: "R$ 30,00",
    images: [
      "./pedra.jpeg?v=20260901-2",
      "./pedra2.jpeg?v=20260901-2",
    ],
  },
  {
    id: 3,
    title: "Asas do Oceano",
    medium: "Acrílica & guache",
    type: "Concha",
    year: "2026",
    description: "Pintura com tinta acrílica sob concha natural decorativa, com aplicação de enfeites decorativos.",
    dimensions: "6 × 6 cm",
    price: "R$ 25,00",
    images: [
      "./concha.jpeg?v=20260901-2",
      "./concha2.jpeg?v=20260901-2",
    ],
  },
  {
    id: 4,
    title: "Noite Aconchegante",
    medium: "Acrílica sobre tela",
    type: "Quadro",
    year: "2026",
    description: "Pintura realizada com tinta acrílica e giz pastel oleoso sobre papel Canson, emoldurada com moldura preta de acetato.",
    dimensions: "24 × 18 cm",
    price: "R$ 60,00",
    images: [
      "./casa.jpeg?v=20260901-2",
      "./casa2.jpeg?v=20260901-2",
    ],
  },
  {
    id: 5,
    title: "Passarinho de inverno",
    medium: "Aquarela",
    type: "Imã",
    year: "2026",
    description: "Pintura realizada com tinta acrílica sobre tela, com quatro mini ímãs fixados na parte posterior.",
    dimensions: "15 × 15 cm",
    price: "R$ 45,00",
    images: [
      "./bird.jpeg?v=20260901-2",
      "./bird2.jpeg?v=20260901-2",
    ],
  },
  {
    id: 6,
    title: "A cereja",
    medium: "Aquarela & tinta",
    type: "Quadro",
    year: "2026",
    description: "Pintura realizada com tinta a óleo e tinta guache sobre papel Canson, emoldurada com moldura preta de acetato.",
    dimensions: "17 × 22 cm",
    price: "R$ 60,00",
    images: [
      "./cereja.jpeg?v=20260901-3",
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  Quadro: "#D77D95",
  Pedra: "#7FB9E3",
  Concha: "#D9A54A",
  "Imã": "#8CAE83",
};

const DEFAULT_ART_ITEM = {
  title: "",
  medium: "",
  type: "Quadro" as ArtItemType,
  year: "2025",
  description: "",
  price: "Sob consulta",
  imagesText: "",
};

function getItemImages(item: ArtItem) {
  return item.images && item.images.length > 0 ? item.images : [];
}

export function ArtesPage() {
  const [selectedItem, setSelectedItem] = useState<ArtItem | null>(null);
  const [filter, setFilter] = useState<"todos" | ArtItemType>("todos");
  const [savedItems, setSavedItems] = useState<ArtItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    medium: "",
    type: "Quadro" as ArtItemType,
    year: "2025",
    description: "",
    price: "Sob consulta",
    imagesText: "",
  });

  useEffect(() => {
    setIsAdmin(new URLSearchParams(window.location.search).get("admin") === "1");
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ArtItem[];
        if (Array.isArray(parsed)) {
          setSavedItems(parsed);
        }
      } catch {
        // ignore invalid localStorage data
      }
    }

    const rawDeleted = window.localStorage.getItem(LOCAL_STORAGE_DELETED_KEY);
    if (rawDeleted) {
      try {
        const parsedDeleted = JSON.parse(rawDeleted) as number[];
        if (Array.isArray(parsedDeleted)) {
          setDeletedIds(parsedDeleted);
        }
      } catch {
        // ignore invalid localStorage data
      }
    }
  }, []);

  const allItems = [...ART_ITEMS.filter((item) => !savedItems.some((saved) => saved.id === item.id) && !deletedIds.includes(item.id)), ...savedItems];
  const visibleItems = filter === "todos" ? allItems : allItems.filter((item) => item.type === filter);
  const canSubmit = newItem.title.trim() && newItem.imagesText.trim();
  const canDeleteCurrentItem = editingId !== null;

  const resetForm = () => {
    setEditingId(null);
    setNewItem({ title: "", medium: "", type: "Quadro", year: "2025", description: "", price: "Sob consulta", imagesText: "" });
  };

  const deleteCurrentItem = () => {
    if (editingId === null) return;
    handleDeleteItem(editingId);
    resetForm();
    setShowForm(false);
  };

  const handleSaveItem = () => {
    if (!canSubmit) return;
    const item: ArtItem = {
      id: editingId ?? Date.now(),
      title: newItem.title.trim(),
      medium: newItem.medium.trim() || "Arte personalizada",
      type: newItem.type,
      year: newItem.year.trim() || "2025",
      description: newItem.description.trim() || "Peça adicionada ao ateliê.",
      price: newItem.price.trim() || "Sob consulta",
      images: newItem.imagesText
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean),
      isCustom: true,
    };

    const next = savedItems.some((saved) => saved.id === editingId)
      ? savedItems.map((saved) => (saved.id === editingId ? item : saved))
      : [...savedItems, item];
    const nextDeletedIds = editingId !== null ? deletedIds.filter((id) => id !== editingId) : deletedIds;

    setSavedItems(next);
    setDeletedIds(nextDeletedIds);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(nextDeletedIds));
    resetForm();
    setShowForm(false);
  };

  const handleEditItem = (item: ArtItem) => {
    setEditingId(item.id);
    setNewItem({
      title: item.title,
      medium: item.medium,
      type: item.type,
      year: item.year,
      description: item.description,
      price: item.price || "Sob consulta",
      imagesText: item.images.join("\n"),
    });
    setShowForm(true);
  };

  const handleDeleteItem = (itemId: number) => {
    if (savedItems.some((item) => item.id === itemId)) {
      const next = savedItems.filter((item) => item.id !== itemId);
      setSavedItems(next);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    } else {
      const nextDeleted = [...deletedIds, itemId];
      setDeletedIds(nextDeleted);
      window.localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(nextDeleted));
    }
  };

  const previewImages = newItem.imagesText
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="relative mx-auto max-w-[1400px] px-5 py-8 pl-8 pr-14 sm:px-8 lg:px-10 min-[2560px]:max-w-[3300px] min-[2560px]:px-16 min-[2560px]:py-14">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs uppercase tracking-widest min-[2560px]:text-lg" style={{ color: "#D77D95" }}>galeria</p>
        <h2 className="text-3xl font-bold min-[2560px]:text-6xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--foreground)" }}>
          Artes
        </h2>
        <p className="mt-2 text-sm min-[2560px]:text-2xl" style={{ color: "var(--muted-foreground)" }}>
          Peças únicas, feitas à mão com carinho, para presentear alguém especial ou transformar o seu cantinho em um lugar ainda mais acolhedor
        </p>
        <div className="mx-auto mt-4 h-0.5 w-12 rounded" style={{ background: "#D77D95" }} />
      </div>
      {isAdmin ? (
        <div className="mb-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-full bg-[#D77D95] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b95b7b]"
          >
            {showForm ? "Cancelar" : "Adicionar imagem"}
          </button>
        </div>
      ) : null}

      {isAdmin && showForm ? (
        <div className="mb-7 rounded-[2rem] border border-[#f4dde4] bg-[#fff5f7] p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[#8f5c74]">Nova imagem para a galeria</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#7a5665]">
              Título
              <input
                className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.title}
                onChange={(event) => setNewItem((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#7a5665] sm:col-span-2">
              URLs das imagens (uma por linha)
              <textarea
                className="mt-2 h-28 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.imagesText}
                onChange={(event) => setNewItem((prev) => ({ ...prev, imagesText: event.target.value }))}
                placeholder="https://.../imagem1.jpg\nhttps://.../imagem2.jpg"
              />
            </label>
            <label className="text-xs font-semibold text-[#7a5665]">
              Tipo
              <select
                className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.type}
                onChange={(event) => setNewItem((prev) => ({ ...prev, type: event.target.value as ArtItemType }))}
              >
                <option value="Quadro">Quadro</option>
                <option value="Pedra">Pedra</option>
                <option value="Concha">Concha</option>
                <option value="Imã">Imã</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-[#7a5665]">
              Ano
              <input
                className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.year}
                onChange={(event) => setNewItem((prev) => ({ ...prev, year: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#7a5665] sm:col-span-2">
              Medium
              <input
                className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.medium}
                onChange={(event) => setNewItem((prev) => ({ ...prev, medium: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#7a5665]">
              Preço
              <input
                className="mt-2 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.price}
                onChange={(event) => setNewItem((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="Sob consulta"
              />
            </label>
            <label className="text-xs font-semibold text-[#7a5665] sm:col-span-2">
              Descrição
              <textarea
                className="mt-2 h-24 w-full rounded-2xl border border-[#ebdfe5] bg-white px-3 py-2 text-sm text-[#3f2b34] outline-none focus:border-[#d77d95]"
                value={newItem.description}
                onChange={(event) => setNewItem((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {previewImages.map((src, index) => (
              <div key={index} className="h-24 overflow-hidden rounded-2xl border border-[#ebdfe5] bg-white">
                <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#7d5f6f]">A imagem é salva no navegador e permanece após atualizar a página.</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#d77b95] bg-white px-4 py-2 text-xs font-bold text-[#7d5f6f] transition hover:bg-[#f9e6ef]"
                >
                  Cancelar edição
                </button>
              ) : null}
              {canDeleteCurrentItem ? (
                <button
                  type="button"
                  onClick={deleteCurrentItem}
                  className="rounded-full border border-[#b24b59] bg-white px-4 py-2 text-xs font-bold text-[#b24b59] transition hover:bg-[#fde7ec]"
                >
                  Excluir imagem
                </button>
              ) : null}
              <button
                disabled={!canSubmit}
                onClick={handleSaveItem}
                className="rounded-full bg-[#D77D95] px-4 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingId ? "Salvar alterações" : "Salvar imagem"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-7 flex flex-wrap justify-center gap-2 min-[2560px]:gap-4">
        {[{ id: "todos", label: "Todos" }, { id: "Quadro", label: "Quadro" }, { id: "Pedra", label: "Pedra" }, { id: "Concha", label: "Concha" }, { id: "Imã", label: "Imã" }].map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id as typeof filter)}
            className="rounded-full px-4 py-2 text-xs font-bold transition min-[2560px]:px-6 min-[2560px]:py-3 min-[2560px]:text-xl"
            style={{ background: filter === category.id ? "#D77D95" : "#fce8f0", color: filter === category.id ? "#fff" : "#b6627e" }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[2560px]:grid-cols-5 min-[2560px]:gap-8">
        {visibleItems.map((item) => (
          <div key={item.id} className="relative group">
            {isAdmin ? (
              <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEditItem(item);
                  }}
                  className="rounded-full bg-white/90 p-2 text-[#8a5b6e] shadow-sm"
                  aria-label="Editar item"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="rounded-full bg-white/90 p-2 text-[#b24b59] shadow-sm"
                  aria-label="Excluir item"
                >
                  ×
                </button>
              </div>
            ) : null}
            <button
              onClick={() => setSelectedItem(item)}
              className="group overflow-hidden rounded-[2rem] text-left transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 20px rgba(58,36,20,0.08)",
              }}
            >
              <div className="relative overflow-hidden rounded-t-[1.75rem] flex-shrink-0" style={{ aspectRatio: "4 / 5", background: "var(--muted)" }}>
                <img
                  src={getItemImages(item)[0] || ""}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,27,0.45),transparent)] opacity-90" />
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[.2em] text-white"
                  style={{ background: TYPE_COLORS[item.type] ?? "#D77D95" }}
                >
                  {item.type}
                </span>
              </div>
              <div className="flex flex-grow flex-col space-y-3 p-5">
                <h3 className="text-lg font-semibold leading-snug min-[2560px]:text-3xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p className="text-justify text-sm leading-6 text-[#6d5162] min-[2560px]:text-xl min-[2560px]:leading-9">{item.description}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[.18em] text-[#7d5f6f] min-[2560px]:text-lg">
                  <span>{item.year}</span>
                  <span className="font-semibold">{item.price || "Sob consulta"}</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
      {selectedItem && <ArtworkModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

function ArtworkModal({ item, onClose }: { item: (typeof ART_ITEMS)[number]; onClose: () => void }) {
  const itemImages = getItemImages(item).slice(0, 2);
  const [activeImage, setActiveImage] = useState(itemImages[0] || "");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#392530]/55 p-4" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="relative max-h-[calc(100dvh-4rem)] w-[86vw] max-w-3xl overflow-y-auto rounded-2xl bg-[#fffaf8] shadow-2xl sm:w-full sm:grid sm:grid-cols-[1.15fr_.85fr]" onClick={(event) => event.stopPropagation()}>
        <div className="bg-[#f4e8e9] p-4">
          <img src={activeImage || getItemImages(item)[0] || ""} alt={item.title} className="mx-auto aspect-square h-auto max-h-[min(38dvh,22rem)] w-full rounded-xl object-cover sm:max-h-[min(72dvh,34rem)]" />
          {item.id !== 1 && item.id !== 6 && (
            <div className="mt-3 flex gap-2">
              {itemImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                  className="h-11 w-11 overflow-hidden rounded-md border-2"
                  style={{ borderColor: activeImage === image ? "#821663" : "transparent" }}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img src={image} alt="Miniatura da arte" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-7">
          <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#73525d]" aria-label="Fechar">
            <X size={18} />
          </button>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#821663] min-[2560px]:text-lg">{item.medium} · {item.year}</p>
          <h3 className="mt-2 text-xl font-bold text-[#593d47] sm:mt-3 sm:text-2xl min-[2560px]:text-5xl" style={{ fontFamily: "Playfair Display, serif" }}>
            {item.title}
          </h3>
          <div className="mt-4 rounded-2xl bg-white/95 p-4 shadow-sm shadow-[#753f5733] sm:mt-5 sm:rounded-3xl sm:p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[.18em] text-[#8f5a6c]">Sobre a peça</h4>
            <p className="mt-2 text-justify text-xs leading-6 text-[#6b515c] sm:mt-3 sm:text-sm sm:leading-7 min-[2560px]:text-xl min-[2560px]:leading-10">
              {item.description}
              {item.dimensions ? <><br /><br />Dimensões: {item.dimensions}.</> : null}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#5f434f]">
              <span className="rounded-full bg-[#f7e5eb] px-3 py-1 text-[12px] font-semibold text-[#7b4d5f]">{item.type}</span>
              <span className="rounded-full bg-[#fff1f5] px-3 py-1 text-[12px] font-semibold text-[#7b4d5f]">{item.year}</span>
            </div>
            <div className="mt-4 text-sm text-[#6b515c]">
              <p className="font-semibold text-[#593d47]">Preço</p>
              <p className="mt-1">{item.price || "Sob consulta"}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6b515c]">Para encomendar, enviar mensagem no direct do Instagram.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
