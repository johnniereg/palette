export function PaintFilter({
  searchTerm,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedType,
  onTypeChange,
  selectedFamily,
  onFamilyChange,
  showOnlyOwned,
  onShowOnlyOwnedChange,
  brands,
  types,
  families
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4 sticky top-0 z-10">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search Paints
        </label>
        <input
          type="text"
          placeholder="Paint name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Paint Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Colour Family Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Colour Family
        </label>
        <select
          value={selectedFamily}
          onChange={(e) => onFamilyChange(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Families</option>
          {families.map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>
      </div>

      {/* Owned Filter */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="ownedFilter"
          checked={showOnlyOwned}
          onChange={(e) => onShowOnlyOwnedChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="ownedFilter" className="text-sm font-medium text-slate-700">
          Only Paints I Own
        </label>
      </div>
    </div>
  )
}
