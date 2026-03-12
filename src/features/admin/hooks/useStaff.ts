import { useEffect, useState } from "react"
import { Staff } from "../types"
import { adminApi } from "../services/adminApi"


export const useStaff = () => {

  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

const openAddModal = () => {
  setSelectedStaff(null);
  setIsModalOpen(true);
};

const openEditModal = (s: Staff) => {
  setSelectedStaff(s);
  setIsModalOpen(true);
};
const fetchStaff = async () => {
  setLoading(true)
  try {
    const res = await adminApi.getAllStaff()
    console.log("Real Data:", res) // Bạn sẽ thấy nó là mảng luôn
    
    // Sửa dòng này: gán thẳng res vào state
    // setStaff(res as unknown as Staff[]) 
    // Trong useStaff.ts, đoạn setStaff
    const data = res as Staff[];
    const staffOnly = data.filter(u => u.role !== 'CUSTOMER');
    setStaff(staffOnly);

  } catch (err) {
    console.error("Fetch staff failed", err)
  } finally {
    setLoading(false)
  }
}

const deleteStaff = async (id: number) => {
    if (!window.confirm("Are you sure to delete this staff?")) return;

    try {
        setLoading(true);
        await adminApi.deleteStaff(id); // Chờ API xóa xong
        await fetchStaff(); // Chờ lấy lại danh sách mới
        // Có thể thêm thông báo thành công ở đây
    } catch (err) {
        console.error("Erorr:", err);
        alert("Can not delete staff. Please try again.");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchStaff()
  }, [])

  return {
    staff,
    loading,
    isModalOpen,
    setIsModalOpen, 
    selectedStaff,
    setSelectedStaff,
    openAddModal,
    openEditModal,
    fetchStaff,
    deleteStaff
  }

}