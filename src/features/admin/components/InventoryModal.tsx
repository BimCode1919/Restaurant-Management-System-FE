import { useState, useEffect } from "react"
import { Ingredient } from "../types"
import { adminApi } from "../services/adminApi"

interface Props {
  ingredient?: Ingredient | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const InventoryModal = ({
  ingredient,
  isOpen,
  onClose,
  onSuccess
}: Props) => {

  const [name, setName] = useState("")
  const [stockQuantity, setStockQuantity] = useState(0)
  const [unit, setUnit] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name)
      setStockQuantity(ingredient.stockQuantity)
      setUnit(ingredient.unit)
    } else {
      setName("")
      setStockQuantity(0)
      setUnit("")
    }
  }, [ingredient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        name,
        stockQuantity,
        unit
      }

      if (ingredient) {
        await adminApi.updateIngredient(ingredient.id, data)
      } else {
        await adminApi.createIngredient(data)
      }

      await onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to save ingredient:', error)
      alert('Failed to save ingredient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">

        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-burgundy">
              {ingredient ? 'edit_note' : 'add_circle'}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-dark-gray">
              {ingredient ? 'Update Ingredient' : 'Add New Ingredient'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors material-symbols-outlined text-gray-400"
          >
            close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Ingredient Name */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">
              Ingredient Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Fresh Tomatoes"
              className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy focus:border-transparent outline-none transition-all border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stock Quantity */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                min="0"
                step="0.1"
                required
                placeholder="0"
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="w-full border-gray-200 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-burgundy outline-none bg-white"
              >
                <option value="">Select Unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="l">Liters (l)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pieces">Pieces</option>
                <option value="boxes">Boxes</option>
                <option value="cans">Cans</option>
                <option value="bottles">Bottles</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-burgundy hover:bg-opacity-90'} text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-burgundy/20 active:scale-95 transition-all mt-4`}
          >
            {loading ? 'Saving...' : ingredient ? 'Save Updates' : 'Add Ingredient'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default InventoryModal