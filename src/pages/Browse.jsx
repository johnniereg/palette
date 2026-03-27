import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import { PaintCard } from '../components/PaintCard'
import { PaintFilter } from '../components/PaintFilter'
import { paints } from '../data/paints'

export function Browse() {
  const { user } = useAuth()
  const { ownedPaints, loading, toggleOwned, updateNotes } = useCollection(user?.uid)

  const [searchTerm,     setSearchTerm]     = useState('')
  const [selectedBrand,  setSelectedBrand]  = useState('')
  const [selectedType,   setSelectedType]   = useState('')
  const [selectedFamily, setSelectedFamily] = useState('')

  const brands = useMemo(() =>
    [...new Set(paints.map(p => p.brand))].sort()
  , [])

  const types = useMemo(() =>
    [...new Set(paints.map(p => p.type))].sort()
  , [])

  const families = useMemo(() =>
    [...new Set(paints.map(p => p.colourFamily))].sort()
  , [])

  const filteredPaints = useMemo(() => {
    return paints.filter(paint => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        paint.name.toLowerCase().includes(q) ||
        paint.description.toLowerCase().includes(q)
      const matchesBrand  = !selectedBrand  || paint.brand        === selectedBrand
      const matchesType   = !selectedType   || paint.type         === selectedType
      const matchesFamily = !selectedFamily || paint.colourFamily === selectedFamily
      return matchesSearch && matchesBrand && matchesType && matchesFamily
    })
  }, [searchTerm, selectedBrand, selectedType, selectedFamily])

  const ownedCount = Object.keys(ownedPaints).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Browse Paints
          </h1>
          <p className="text-slate-500 text-sm">
            {paints.length} paints in database · {ownedCount} in your collection · {filteredPaints.length} showing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <PaintFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedFamily={selectedFamily}
              onFamilyChange={setSelectedFamily}
              showOnlyOwned={false}
              onShowOnlyOwnedChange={() => {}}
              brands={brands}
              types={types}
              families={families}
              hideSwitchOwned
            />
          </div>

          {/* Paint grid */}
          <div className="lg:col-span-3">
            {filteredPaints.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <p className="text-slate-500">No paints match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPaints.map(paint => (
                  <PaintCard
                    key={paint.id}
                    paint={paint}
                    isOwned={!!ownedPaints[paint.id]}
                    onToggleOwned={toggleOwned}
                    onNotesChange={updateNotes}
                    ownedData={ownedPaints[paint.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
