import { useSearch } from "../context/SearchContext";

export default function HeaderSearch() {
  const { query, setQuery } = useSearch();

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2 w-full"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pizza, burger…"
        aria-label="Search menu"
        className="w-full bg-white border-2 border-ink rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sauce/50"
      />
      {/* <button
        type="submit"
        className="shrink-0 bg-ink text-cheese font-semibold text-sm px-4 py-2 rounded-md hover:bg-sauce hover:text-white transition-colors"
      >
        Search
      </button> */}
    </form>
  );
}