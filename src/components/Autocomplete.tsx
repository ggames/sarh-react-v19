// Autocomplete.tsx
import React, { useEffect, useRef, useState } from "react";

type Item<T> = T;

type AutocompleteProps<T> = {
  // valor externo (opcional). Si se pasa, el componente actúa como controlado.
  value?: string;
  // callback cuando cambia el texto
  onChange?: (value: string) => void;
  // callback cuando seleccionan un item
  onSelect: (item: Item<T>) => void;
  // función que recibe el query y devuelve promesa con items
  fetchItems: (query: string, signal?: AbortSignal) => Promise<Item<T>[]>;
  // cómo renderizar cada item
  renderItem?: (item: Item<T>, isHighlighted: boolean) => React.ReactNode;
  // cómo mostrar texto en el input cuando un item está seleccionado
  itemToString?: (item: Item<T> | null) => string;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
  className?: string; // wrapper class
  inputClassName?: string;
  listClassName?: string;
  getItemId?: (index: number) => string;
};

export function Autocomplete<T>({
  value,
  onChange,
  onSelect,
  fetchItems,
  renderItem,
//  itemToString = (i) => (i == null ? "" : String(i)),
  placeholder = "Buscar...",
  debounceMs = 300,
  minChars = 2,
  className = "",
  inputClassName = "",
  listClassName = "",
  getItemId,
}: AutocompleteProps<T>) {
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const controlled = value !== undefined;
  const query = controlled ? value! : internalValue;

  const [items, setItems] = useState<Item<T>[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const cacheRef = useRef<Map<string, Item<T>[]>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const justSelectedRef = useRef(false);  

  // actualizar estado interno si es controlado externamente
  useEffect(() => {
    if (controlled) setInternalValue(value ?? "");
  }, [value, controlled]);

  // debounce fetch
  useEffect(() => {

    
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (query.length < minChars) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    const cached = cacheRef.current.get(query);
    if (cached) {
      setItems(cached);
      setOpen(true);
      setLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      // cancelar anterior
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      fetchItems(query, ac.signal)
        .then((res) => {
          if (!mounted) return;
          cacheRef.current.set(query, res);
          setItems(res);
          setOpen(true);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("fetchItems error:", err);
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    }, debounceMs);

    return () => {
      mounted = false;
      clearTimeout(handler);
      // do not abort here to allow current request finish if wanted
    };
   
  }, [query, minChars, debounceMs, fetchItems]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!controlled) setInternalValue(v);
    onChange?.(v);
    setHighlightedIndex(-1);
  }

  function handleSelect(item: Item<T>) {

      justSelectedRef.current = true;
    if (abortRef.current) abortRef.current.abort();
    // actualizar texto del input con itemToString
    //const text = itemToString(item);
    if (!controlled) setInternalValue("");
    onChange?.("");
    onSelect(item);
    setOpen(false);
    setHighlightedIndex(-1);
    setItems([]);
   
   
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(items.length - 1, i + 1));
      scrollIntoView(highlightedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(0, i - 1));
      scrollIntoView(highlightedIndex - 1);
    } else if (e.key === "Enter") {
      if (open && highlightedIndex >= 0 && highlightedIndex < items.length) {
        e.preventDefault();
        handleSelect(items[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function scrollIntoView(index: number) {
    const id = getItemId ? getItemId(index) : `ac-item-${index}`;
    const el = document.getElementById(id);
    if (el && listRef.current) {
      el.scrollIntoView({ block: "nearest" });
    }
  }

  // close on click outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="autocomplete-list"
        aria-autocomplete="list"
        aria-activedescendant={
          highlightedIndex >= 0 ? getItemId?.(highlightedIndex) ?? `ac-item-${highlightedIndex}` : undefined
        }
        className={`${inputClassName}`}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (items.length > 0) setOpen(true);
        }}
      />

      {loading && (
        <div className="absolute right-2 top-2 text-sm select-none">...</div>
      )}

      {open && items.length > 0 && (
        <ul
          id="autocomplete-list"
          ref={listRef}
          role="listbox"
          className={`absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow ${listClassName}`}
        >
          {items.map((it, idx) => {
            const highlighted = idx === highlightedIndex;
            const id = getItemId ? getItemId(idx) : `ac-item-${idx}`;
            return (
              <li
                key={id}
                id={id}
                role="option"
                aria-selected={highlighted}
                className={`cursor-pointer px-3 py-2 ${highlighted ? "bg-slate-100" : ""}`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseDown={(e) => {
                  // mouseDown en lugar de click para evitar que el input pierda el focus antes del seleccion
                  e.preventDefault();
                  handleSelect(it);
                }}
              >
                {renderItem ? renderItem(it, highlighted) : <div>{String(it)}</div>}
              </li>
            );
          })}
        </ul>
      )}

      {open && !loading && items.length === 0 && (
        <div className="absolute z-40 mt-1 w-full rounded border bg-white px-3 py-2 text-sm text-gray-500">
          No hay resultados
        </div>
      )}
    </div>
  );
}
export default Autocomplete;
