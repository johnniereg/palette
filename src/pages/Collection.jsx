import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import { PaintCard } from '../components/PaintCard'
import { PaintFilter } from '../components/PaintFilter'
import { paints } from '../data/paints'

export function Collection() {
  const { user } = useAuth()
  const { ownedPaints, loading, toggleOwned, updateNotes } = useCollection(user?.uid)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('')
  const [showOnlyOwned, setShowOnlyOwned] = useState(false)

  // Get unique values for filters
  const brands = useMemo(() => {
    return [...new Set(paints.map((p) => p.brand))].sort()
  }, [])

  const types = useMemo(() => {
    return [...new Set(paints.map((p) => p.type))].sort()
  }, [])

  const families = useMemo(() => {
    return [...new Set(paints.map((p) => p.colourFamily))].sort()
  }, [])

  // Filter paints
  const filteredPaints = useMemo(() => {
    return paints.filter((paint) => {
      const matchesSearch = paint.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesBrand = !selectedBrand || paint.brand === selectedBrand
      const matchesType = !selectedType || paint.type === selectedType
      const matchesFamily =
        !selectedFamily || paint.colourFamily === selectedFamily
      const matchesOwned =
        !showOnlyOwned || ownedPaints[paint.id]

      return (
        matchesSearch &&
        matchesBrand &&
        matchesType &&
        matchesFamily &&
        matchesOwned
      )
    })
  }, [
    searchTerm,
    selectedBrand,
    selectedType,
    selectedFamily,
    showOnlyOwned,
    ownedPaints
  ])

  const ownedCount = Object.keys(ownedPaints).length

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
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Paint Collection
          </h1>
          <p className="text-slate-600">
            {ownedCount} paint{ownedCount !== 1 ? 's' : ''} owned · {filteredPaints.length} showing
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
              showOnlyOwned={showOnlyOwned}
              onShowOnlyOwnedChange={setShowOnlyOwned}
              brands={brands}
              types={types}
              families={families}
            />
          </div>

          {/* Paint grid */}
          <div className="lg:col-span-3">
            {filteredPaints.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-slate-600 text-lg">
                  No paints match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPaints.map((paint) => (
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
