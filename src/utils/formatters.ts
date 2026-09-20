export function formatBRL(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function formatDateLongBR(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getCategoryTheme(colorName: string) {
  switch (colorName) {
    case 'amber':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
        pill: 'border-amber-300 text-amber-900 bg-amber-50',
        accent: 'text-amber-700',
        text: 'text-amber-700',
        bar: 'bg-amber-500',
        dot: 'bg-amber-500',
      };
    case 'blue':
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        badge: 'bg-sky-100 text-sky-800',
        pill: 'border-sky-300 text-sky-900 bg-sky-50',
        accent: 'text-sky-700',
        text: 'text-sky-700',
        bar: 'bg-sky-500',
        dot: 'bg-sky-500',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
        pill: 'border-emerald-300 text-emerald-900 bg-emerald-50',
        accent: 'text-emerald-700',
        text: 'text-emerald-700',
        bar: 'bg-emerald-500',
        dot: 'bg-emerald-500',
      };
    case 'purple':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        badge: 'bg-purple-100 text-purple-800',
        pill: 'border-purple-300 text-purple-900 bg-purple-50',
        accent: 'text-purple-700',
        text: 'text-purple-700',
        bar: 'bg-purple-500',
        dot: 'bg-purple-500',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-800',
        pill: 'border-indigo-300 text-indigo-900 bg-indigo-50',
        accent: 'text-indigo-700',
        text: 'text-indigo-700',
        bar: 'bg-indigo-500',
        dot: 'bg-indigo-500',
      };
    case 'rose':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
        pill: 'border-rose-300 text-rose-900 bg-rose-50',
        accent: 'text-rose-700',
        text: 'text-rose-700',
        bar: 'bg-rose-500',
        dot: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-stone-50 text-stone-800 border-stone-200',
        badge: 'bg-stone-100 text-stone-800',
        pill: 'border-stone-300 text-stone-900 bg-stone-50',
        accent: 'text-stone-700',
        text: 'text-stone-700',
        bar: 'bg-stone-500',
        dot: 'bg-stone-500',
      };
  }
}
