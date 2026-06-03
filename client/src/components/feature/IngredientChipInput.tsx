import { useState, useRef, type KeyboardEvent } from "react";

interface IngredientChipInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function IngredientChipInput({
  ingredients,
  onChange,
  placeholder = "Malzeme yaz, Enter ile ekle…",
  className = "",
}: IngredientChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addIngredient(raw: string) {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;
    if (ingredients.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...ingredients, trimmed]);
    setInputValue("");
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
      return;
    }
    // Backspace ile son chip'i sil (input boşsa)
    if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  }

  return (
    <div
      className={`flex flex-wrap gap-2 items-center min-h-[52px] px-3 py-2 rounded-xl border-2 border-amber-200 bg-white focus-within:border-amber-400 transition-colors cursor-text ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {ingredients.map((ingredient, index) => (
        <span
          key={`${ingredient}-${index}`}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium select-none"
        >
          {ingredient}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeIngredient(index);
            }}
            className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-amber-300 transition-colors text-amber-600 hover:text-amber-900"
            aria-label={`${ingredient} kaldır`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addIngredient(inputValue)}
        placeholder={ingredients.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[160px] outline-none text-sm text-stone-700 placeholder:text-stone-400 bg-transparent"
        aria-label="Malzeme girişi"
      />
    </div>
  );
}
