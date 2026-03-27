import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import { OwnedPaintCard } from '../components/OwnedPaintCard'
import { paints } from '../data/paints'

const TYPE_ORDER = ['Base', 'Primer', 'Layer', 'Shade', 'Contrast', 'Dry', 'Technical']

const SORT_OPTIONS = [
  { value: 'colourFamily', label: 'Colour Family' },
  { value: 'type',         label: 'Paint Type'    },
  { value: 'brand',        label: 'Brand'         },
  { value: 'name',         label: 'Name (A–Z)'    },
]

export function MyPaints() {
  const { user } = useAuth()
  const { ownedPaints, loading, toggleOwned, updateNotes } = useCollection(user?.uid)

  const [searchTerm,     setSearchTerm]     = useState('')
  const [selectedType,   setSelectedType]   = useState('All')
  const [selectedFamily, setSelectedFamily] = useState('')
  const [selectedBrand,  setSelectedBrand]  = useState('')
  const [sortBy,         setSortBy]         = useState('colourFamily')

  // Only paints the user owns
  const ownedPaintList = useMemo(() => {
    return paints.filter(p => ownedPaints[p.id])
  }, [ownedPaints])

  // Type pills — only show types actually present in the collection
  const availableTypes = useMemo(() => {
    const present = new Set(ownedPaintList.map(p => p.type))
    return ['All', ...TYPE_ORDER.filter(t => present.has(t))]
  }, [ownedPaintList])

  // Brand and colour family options scoped to owned paints
  const brands = useMemo(() =>
    [...new Set(ownedPaintList.map(p => p.brand))].sort()
  , [ownedPaintList])

  const families = useMemo(() =>
    [...new Set(ownedPaintList.map(p => p.colourFamily))].sort()
  , [ownedPaintList])

  // Filtered + sorted list
  const filteredPaints = useMemo(() => {
    const result = ownedPaintList.filter(p => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colourFamily.toLowerCase().includes(q)
      const matchesType   = selectedType   === 'All' || p.type        === selectedType
      const matchesFamily = !selectedFamily            || p.colourFamily === selectedFamily
      const matchesBrand  = !selectedBrand             || p.brand        === selectedBrand
      return matchesSearch && matchesType && matchesFamily && matchesBrand
    })

    result.sort((a, b) => {
      if (sortBy === 'colourFamily') {
        return a.colourFamily.localeCompare(b.colourFamily) || a.name.localeCompare(b.name)
      }
      if (sortBy === 'type') {
        const ai = TYPE_ORDER.indexOf(a.type)
        const bi = TYPE_ORDER.indexOf(b.type)
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name)
      }
      if (sortBy === 'brand') {
        return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
      }
      return a.name.localeCompare(b.name)
    })

    return result
  }, [ownedPaintList, searchTerm, selectedType, selectedFamily, selectedBrand, sortBy])

  // Group paints for sectioned display
  const groupedPaints = useMemo(() => {
    if (sortBy === 'name') return [{ label: null, items: filteredPaints }]
    const key = sortBy === 'colourFamily' ? 'colourFamily'
              : sortBy === 'type'         ? 'type'
              :                             'brand'
    const map = {}
    filteredPaints.forEach(p => {
      if (!map[p[key]]) map[p[key]] = []
      map[p[key]].push(p)
    })
    return Object.entries(map).map(([label, items]) => ({ label, items }))
  }, [filteredPaints, sortBy])

  const hasFilters = searchTerm || selectedType !== 'All' || selectedFamily || selectedBrand

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('All')
    setSelectedFamily('')
    setSelectedBrand('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading your collection...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">My Paints</h1>
          <p className="text-slate-500 text-sm">
            {ownedPaintList.length} paint{ownedPaintList.length !== 1 ? 's' : ''} in your collection
            {filteredPaints.length !== ownedPaintList.length && (
              <span> · {filteredPaints.length} showing</span>
            )}
          </p>
        </div>

        {ownedPaintList.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-500 text-lg mb-2">Your collection is empty.</p>
            <p className="text-slate-400 text-sm">Head to Browse to add paints you own.</p>
          </div>
        ) : (
          <>
            {/* Type quick-filter pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedType === type
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Filter / sort bar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Name, colour, or description…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Colour Family */}
                <div className="min-w-[150px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Colour Family</label>
                  <select
                    value={selectedFamily}
                    onChange={e => setSelectedFamily(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
                  >
                    <option value="">All Colours</option>
                    {families.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="min-w-[140px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
                  >
                    <option value="">All Brands</option>
                    {brands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="min-w-[150px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Group & Sort</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear filters */}
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-300 rounded-lg hover:border-slate-500 transition mt-auto"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Paint groups */}
            {filteredPaints.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-500">No paints match your filters.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedPaints.map(group => (
                  <div key={group.label ?? 'all'}>
                    {group.label && (
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-base font-semibold text-slate-700">{group.label}</h2>
                        <span className="text-xs text-slate-400">{group.items.length}</span>
                        <div className="flex-1 border-t border-slate-200" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.items.map(paint => (
                        <OwnedPaintCard
                          key={paint.id}
                          paint={paint}
                          ownedData={ownedPaints[paint.id]}
                          onRemove={toggleOwned}
                          onNotesChange={updateNotes}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
