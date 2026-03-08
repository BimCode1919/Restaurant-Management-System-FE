import { useEffect, useState } from "react"
import { Staff } from "../types"
import { adminApi } from "../services/adminApi"

export const useStaff = () => {

  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)

  const fetchStaff = async () => {

    setLoading(true)

    try {

      const res = await adminApi.getAllStaff()
      console.log("STAFF:", res)
      setStaff(res.data as Staff[])

    } catch (err) {

      console.error("Fetch staff failed", err)

    } finally {

      setLoading(false)

    }

  }

  const deleteStaff = async (id: number) => {

    if (!confirm("Delete this staff?")) return

    await adminApi.deleteStaff(id)

    fetchStaff()

  }

  useEffect(() => {
    fetchStaff()
  }, [])

  return {
    staff,
    loading,
    deleteStaff
  }

}