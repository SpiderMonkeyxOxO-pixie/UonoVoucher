interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search games…', label = 'Search games' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 16l-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <label htmlFor="game-search" className="visually-hidden">
        {label}
      </label>
      <input
        id="game-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
