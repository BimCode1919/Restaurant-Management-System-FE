import { useEffect, useState } from "react"
import { Ingredient } from "../types"
import { adminApi } from "../services/adminApi" // Update this path to match your project structure

export const useInventory = () => {

  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchIngredients = async () => {

    setLoading(true)

    try {

        const res = await adminApi.getAllIngredients()

        setIngredients(res.data as Ingredient[])

    } catch (err) {
        console.error("Fetch ingredients failed", err)
    } finally {
        setLoading(false)
    }

    }

  const deleteIngredient = async (id: number) => {

    if (!window.confirm("Delete this ingredient?")) return

    try {

      await adminApi.deleteIngredient(id)

      fetchIngredients()

    } catch (err) {
      console.error(err)
    }

  }

    useEffect(() => {
    fetchIngredients()
    }, [])

  return {
    ingredients,
    loading,
    search,
    setSearch,
    deleteIngredient,
    fetchIngredients
  }
}