import { useState } from 'react'

export function PaintCard({ paint, isOwned, onToggleOwned, onNotesChange, ownedData }) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(ownedData?.notes || '')

  const handleSaveNotes = () => {
    onNotesChange(paint.id, notes)
    setShowNotes(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
      {/* Colour swatch */}
      <div
        className="h-24 w-full"
        style={{ backgroundColor: paint.hex }}
        title={`Hex: ${paint.hex}`}
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base break-words">
              {paint.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">{paint.brand}</p>
          </div>
          <button
            onClick={() => onToggleOwned(paint.id)}
            className={`flex-shrink-0 px-3 py-1 rounded text-sm font-medium transition-colors ${
              isOwned
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isOwned ? '✓ Own' : 'Add'}
          </button>
        </div>

        {/* Type and Colour Family */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
            {paint.type}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {paint.colourFamily}
          </span>
        </div>

        {/* Colour Description - PROMINENT */}
        <p className="text-sm font-semibold text-slate-800 mb-3 leading-relaxed">
          {paint.description}
        </p>

        {/* Hex for reference */}
        <p className="text-xs text-slate-500 mb-3">
          Hex: <code className="font-mono">{paint.hex}</code>
        </p>

        {/* Notes */}
        {isOwned && (
          <div className="border-t border-slate-200 pt-3">
            {!showNotes ? (
              <button
                onClick={() => setShowNotes(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {ownedData?.notes ? '✎ Edit notes' : '+ Add notes'}
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 'Good for highlighting', 'Thin 2:1 with medium'"
                  className="w-full text-sm border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="flex-1 text-sm bg-blue-600 text-white rounded py-1 hover:bg-blue-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowNotes(false)
                      setNotes(ownedData?.notes || '')
                    }}
                    className="flex-1 text-sm bg-slate-200 text-slate-700 rounded py-1 hover:bg-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {ownedData?.notes && !showNotes && (
              <p className="text-xs text-slate-600 mt-2 italic">
                {ownedData.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
