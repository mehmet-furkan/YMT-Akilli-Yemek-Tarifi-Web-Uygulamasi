interface ServingStepperProps {
  servings: number;
  originalServings: number;
  onChange: (next: number) => void;
}

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 20;

/**
 * Porsiyon sayısını ayarlamak için ±1 stepper.
 * Aralık dışına çıkmaya engel olur, orijinalden farklıysa kullanıcıya hatırlatır.
 * onChange callback'i parent'taki state'i günceller — multiplier orada hesaplanır.
 */
export function ServingStepper({
  servings,
  originalServings,
  onChange,
}: ServingStepperProps) {
  const canDecrement = servings > MIN_SERVINGS;
  const canIncrement = servings < MAX_SERVINGS;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Porsiyon azalt"
          disabled={!canDecrement}
          onClick={() => onChange(servings - 1)}
          className="w-7 h-7 rounded-full border-2 border-amber-400 text-amber-600 font-bold text-base flex items-center justify-center transition-colors hover:bg-amber-50 active:bg-amber-100 disabled:border-stone-200 disabled:text-stone-300 disabled:cursor-not-allowed select-none"
        >
          −
        </button>

        <span
          aria-live="polite"
          className="font-semibold min-w-[40px] text-center text-stone-800 tabular-nums"
        >
          {servings}
        </span>

        <button
          type="button"
          aria-label="Porsiyon artır"
          disabled={!canIncrement}
          onClick={() => onChange(servings + 1)}
          className="w-7 h-7 rounded-full border-2 border-amber-400 text-amber-600 font-bold text-base flex items-center justify-center transition-colors hover:bg-amber-50 active:bg-amber-100 disabled:border-stone-200 disabled:text-stone-300 disabled:cursor-not-allowed select-none"
        >
          +
        </button>
      </div>
      <span className="text-xs text-stone-400">
        {servings !== originalServings ? `(orijinal: ${originalServings})` : "Kişi"}
      </span>
    </div>
  );
}
