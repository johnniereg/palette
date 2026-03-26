import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export function useCollection(uid) {
  const [ownedPaints, setOwnedPaints] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      setOwnedPaints({})
      setLoading(false)
      return
    }

    const fetchCollection = async () => {
      try {
        setError(null)
        const colRef = collection(db, `users/${uid}/collection`)
        const snapshot = await getDocs(colRef)
        const paints = {}
        snapshot.forEach((doc) => {
          paints[doc.id] = doc.data()
        })
        setOwnedPaints(paints)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [uid])

  const toggleOwned = async (paintId) => {
    if (!uid) return

    try {
      const docRef = doc(db, `users/${uid}/collection`, paintId)
      if (ownedPaints[paintId]) {
        await deleteDoc(docRef)
        setOwnedPaints((prev) => {
          const next = { ...prev }
          delete next[paintId]
          return next
        })
      } else {
        await setDoc(docRef, { owned: true, notes: '' })
        setOwnedPaints((prev) => ({
          ...prev,
          [paintId]: { owned: true, notes: '' }
        }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const updateNotes = async (paintId, notes) => {
    if (!uid) return

    try {
      const docRef = doc(db, `users/${uid}/collection`, paintId)
      await updateDoc(docRef, { notes })
      setOwnedPaints((prev) => ({
        ...prev,
        [paintId]: { ...prev[paintId], notes }
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  return { ownedPaints, loading, error, toggleOwned, updateNotes }
}
