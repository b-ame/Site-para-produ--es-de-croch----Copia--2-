import { useEffect, useState } from "react";
import { X } from "lucide-react";

const LOCAL_STORAGE_KEY = "croche-gallery-items";
const LOCAL_STORAGE_DELETED_KEY = "croche-gallery-deleted";

type CrocheItemType = "Amigurumi" | "Chaveiro";

type CrocheItem = {
  id: number;
  title: string;
  type: CrocheItemType;
  material: string;
  description: string;
  price: string;
  img: string;
  isCustom?: boolean;
};

const CROCHE_ITEMS: CrocheItem[] = [
  {
    id: 1,
    title: "Coelhinho com Cenoura",
    type: "Amigurumi",
    material: "Fio de algodão",
    description: "Amigurumi delicado, feito ponto a ponto e acompanhado da sua cenourinha.",
    price: "Sob consulta",
    img: "./EM BREVE.png",
  },
  {
    id: 2,
    title: "Alien Azul",
    type: "Amigurumi",
    material: "Fio acrílico",
    description: "Pequeno alien azul em crochê, cheio de personalidade e detalhes feitos à mão.",
    price: "Sob consulta",
    img: "./EM BREVE.png",
  },
  {
    id: 3,
    title: "Coelhinho Jardineiro",
    type: "Amigurumi",
    material: "Fio de algodão",
    description: "Um coelhinho jardineiro criado para encantar quem ama peças fofas e únicas.",
    price: "Sob consulta",
    img: "./EM BREVE.png",
  },
  {
    id: 4,
    title: "Mochila de Crochê",
    type: "Chaveiro",
    material: "Fio de algodão",
    description: "Chaveiro leve e divertido para levar um toque artesanal para todo lugar.",
    price: "Sob consulta",
    img: "./EM BREVE.png",
  },



];

const TYPE_COLORS: Record<string, string> = {
  Amigurumi: "#8E63B5",
  Chaveiro: "#C97A8A",
};

export function CrochePage() {
  const [selectedItem, setSelectedItem] = useState<CrocheItem | null>(null);
  const [filter, setFilter] = useState<"todos" | CrocheItemType>("todos");
  const [savedItems, setSavedItems] = useState<CrocheItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    type: "Amigurumi" as CrocheItemType,
    material: "",
    description: "",
    price: "Sob consulta",
    img: "",
  });

  useEffect(() => {
    setIsAdmin(new URLSearchParams(window.location.search).get("admin") === "1");
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as (typeof CROCHE_ITEMS)[number][];
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

  const allItems = [...CROCHE_ITEMS.filter((item) => !savedItems.some((saved) => saved.id === item.id) && !deletedIds.includes(item.id)), ...savedItems];
  const visibleItems = filter === "todos" ? allItems : allItems.filter((item) => item.type === filter);
  const canSubmit = newItem.title.trim() && newItem.img.trim();
  const canDeleteCurrentItem = editingId !== null;

  const resetForm = () => {
    setEditingId(null);
    setNewItem({ title: "", type: "Amigurumi", material: "", description: "", price: "Sob consulta", img: "" });
  };

  const deleteCurrentItem = () => {
    if (editingId === null) return;
    handleDeleteItem(editingId);
    resetForm();
    setShowForm(false);
  };

  const handleSaveItem = () => {
    if (!canSubmit) return;
    const item: CrocheItem = {
      id: editingId ?? Date.now(),
      title: newItem.title.trim(),
      type: newItem.type,
      material: newItem.material.trim() || "Material personalizado",
      description: newItem.description.trim() || "Peça em crochê adicionada ao ateliê.",
      price: newItem.price.trim() || "Sob consulta",
      img: newItem.img.trim(),
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

  const handleEditItem = (item: CrocheItem) => {
    setEditingId(item.id);
    setNewItem({
      title: item.title,
      type: item.type,
      material: item.material,
      description: item.description,
      price: item.price || "Sob consulta",
      img: item.img,
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

  return (
    <div className="relative mx-auto max-w-[1400px] px-5 py-8 pl-8 pr-14 sm:px-8 lg:px-10 xl:px-16 min-[2560px]:max-w-[3300px] min-[2560px]:px-16 min-[2560px]:py-14">

      <div className="mb-8 text-center">
        <p className="text-xs tracking-widest uppercase mb-2 min-[2560px]:text-lg" style={{ color: "#8E63B5" }}>
          galeria
        </p>
        <h2 className="text-3xl font-bold min-[2560px]:text-6xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--foreground)" }}>
          Crochê
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6d4e8e] min-[2560px]:max-w-4xl min-[2560px]:text-xl min-[2560px]:leading-9">
          Peças feitas à mão, ponto a ponto, para levar delicadeza, cor e um toque especial ao seu dia.
        </p>
        <div className="mx-auto mt-3 h-0.5 w-14 rounded bg-[#8E63B5]" />
      </div>

      {isAdmin ? (
        <div className="mb-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-full bg-[#8E63B5] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#7a4ca8]"
          >
            {showForm ? "Cancelar" : "Adicionar imagem"}
          </button>
        </div>
      ) : null}

      {isAdmin && showForm ? (
        <div className="mb-7 rounded-[2rem] border border-[#e7e2f2] bg-[#f8f2ff] p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[#6d4e8e]">Nova imagem para a galeria</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#6d4e8e]">
              Título
              <input
                className="mt-2 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.title}
                onChange={(event) => setNewItem((prev) => ({ ...prev, title: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#6d4e8e]">
              Link da imagem
              <input
                className="mt-2 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.img}
                onChange={(event) => setNewItem((prev) => ({ ...prev, img: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#6d4e8e]">
              Tipo
              <select
                className="mt-2 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.type}
                onChange={(event) => setNewItem((prev) => ({ ...prev, type: event.target.value as CrocheItemType }))}
              >
                <option value="Amigurumi">Amigurumi</option>
                <option value="Chaveiro">Chaveiro</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-[#6d4e8e]">
              Material
              <input
                className="mt-2 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.material}
                onChange={(event) => setNewItem((prev) => ({ ...prev, material: event.target.value }))}
              />
            </label>
            <label className="text-xs font-semibold text-[#6d4e8e]">
              Preço
              <input
                className="mt-2 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.price}
                onChange={(event) => setNewItem((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="Sob consulta"
              />
            </label>
            <label className="text-xs font-semibold text-[#6d4e8e] sm:col-span-2">
              Descrição
              <textarea
                className="mt-2 h-24 w-full rounded-2xl border border-[#e5dff1] bg-white px-3 py-2 text-sm text-[#3c2a57] outline-none focus:border-[#8e63b5]"
                value={newItem.description}
                onChange={(event) => setNewItem((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#5f4c7f]">A imagem é salva no navegador e permanece após atualizar a página.</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#8E63B5] bg-white px-4 py-2 text-xs font-bold text-[#5f4c7f] transition hover:bg-[#f3e8ff]"
                >
                  Cancelar edição
                </button>
              ) : null}
              {canDeleteCurrentItem ? (
                <button
                  type="button"
                  onClick={deleteCurrentItem}
                  className="rounded-full border border-[#b24b59] bg-white px-4 py-2 text-xs font-bold text-[#b24b59] transition hover:bg-[#fee6ea]"
                >
                  Excluir imagem
                </button>
              ) : null}
              <button
                disabled={!canSubmit}
                onClick={handleSaveItem}
                className="rounded-full bg-[#8E63B5] px-4 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingId ? "Salvar alterações" : "Salvar imagem"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-7 flex flex-wrap justify-center gap-2 min-[2560px]:gap-4">
        {[
          { id: "todos", label: "Todos" },
          { id: "Amigurumi", label: "Amigurumis" },
          { id: "Chaveiro", label: "Chaveiros" },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id as typeof filter)}
            className="rounded-full px-4 py-2 text-xs font-bold transition min-[2560px]:px-6 min-[2560px]:py-3 min-[2560px]:text-xl"
            style={{
              background: filter === category.id ? "#8E63B5" : "#f1eafa",
              color: filter === category.id ? "#fff" : "#79559c",
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 min-[2560px]:gap-12">
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
                  className="rounded-full bg-white/90 p-2 text-[#6d4e8e] shadow-sm"
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
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group overflow-hidden rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 12px rgba(58,36,20,0.07)",
              }}
            >
              <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: "5 / 4", background: "var(--muted)" }}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: TYPE_COLORS[item.type] ?? "#BF7A4A",
                    color: "#fff",
                    opacity: 0.92,
                  }}
                >
                  {item.type}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs mt-1 min-[2560px]:text-lg" style={{ color: "var(--muted-foreground)" }}>
                  {item.material}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {selectedItem && <CrochetModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

function CrochetModal({ item, onClose }: { item: CrocheItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#392530]/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100dvh-4rem)] w-[86vw] max-w-3xl overflow-y-auto rounded-2xl bg-[#fffaf8] shadow-2xl sm:w-full sm:grid sm:grid-cols-[1.15fr_.85fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[#f1eafa] p-4">
          <div className="mx-auto aspect-square h-auto max-h-[min(38dvh,22rem)] w-full rounded-xl sm:max-h-[min(72dvh,34rem)]" style={{ background: "#ffffff" }} />
        </div>

        <div className="p-4 sm:p-7">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#73525d]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8E63B5] min-[2560px]:text-lg">
            {item.type} · {item.material}
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#593d47] sm:mt-3 sm:text-2xl min-[2560px]:text-5xl" style={{ fontFamily: "Playfair Display, serif" }}>
            {item.title}
          </h3>
          <div className="mt-4 rounded-2xl bg-white/95 p-4 shadow-sm shadow-[#6346a033] sm:mt-5 sm:rounded-3xl sm:p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[.18em] text-[#66417b]">Detalhes</h4>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#44335f]">
              <span className="rounded-full bg-[#ede8fb] px-3 py-1 text-[12px] font-semibold text-[#483e6a]">{item.material}</span>
              <span className="rounded-full bg-[#f2ecff] px-3 py-1 text-[12px] font-semibold text-[#483e6a]">{item.type}</span>
            </div>
            <div className="mt-4 text-sm text-[#6f5970]">
              <p className="font-semibold text-[#5c4e7a]">Preço</p>
              <p className="mt-1">Sob consulta</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6f5970]">Para encomendar, enviar mensagem no direct do Instagram.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
