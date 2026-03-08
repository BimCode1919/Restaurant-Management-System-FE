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

  const handleSubmit = async () => {

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
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-bold mb-4">
          {ingredient ? "Edit Ingredient" : "Create Ingredient"}
        </h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Stock"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(Number(e.target.value))}
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <div className="flex justify-end gap-2">

          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Save
          </button>

        </div>

      </div>

    </div>
  )
}

export default InventoryModal