import { useState } from 'react'

export function OwnedPaintCard({ paint, ownedData, onRemove, onNotesChange }) {
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState(ownedData?.notes || '')

  const handleSaveNotes = () => {
    onNotesChange(paint.id, notes)
    setEditingNotes(false)
  }

  const handleCancel = () => {
    setNotes(ownedData?.notes || '')
    setEditingNotes(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Colour swatch */}
      <div
        className="h-20 w-full flex-shrink-0"
        style={{ backgroundColor: paint.hex }}
        aria-label={`Colour swatch for ${paint.name}`}
      />

      {/* Main content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + brand */}
        <div className="mb-2">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
            {paint.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{paint.brand}</p>
        </div>

        {/* Type + colour family badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {paint.type}
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {paint.colourFamily}
          </span>
        </div>

        {/* Colour description — primary info for colour-blind painters */}
        <p className="text-sm text-slate-800 leading-relaxed flex-1">
          {paint.description}
        </p>

        {/* Notes section */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {!editingNotes ? (
            <div>
              {ownedData?.notes ? (
                <div>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{ownedData.notes}</p>
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1.5"
                  >
                    Edit notes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-medium transition-colors"
                >
                  + Add notes
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. 'Thin 2:1 for layering', 'Great over Wraithbone'"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 text-xs bg-slate-900 text-white rounded-lg py-1.5 hover:bg-slate-700 font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 text-xs bg-slate-100 text-slate-600 rounded-lg py-1.5 hover:bg-slate-200 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Remove from collection */}
        <div className="mt-3 text-right">
          <button
            onClick={() => onRemove(paint.id)}
            className="text-xs text-slate-300 hover:text-red-500 transition-colors font-medium"
            title="Remove from collection"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
