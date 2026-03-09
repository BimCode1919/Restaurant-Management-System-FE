import { Staff } from "../types"

interface Props {
  staff: Staff[]
  loading: boolean
  onDelete: (id: number) => void
  onEdit: (s: Staff) => void
  onAddNew: () => void
}

const StaffView = ({ staff = [], loading, onDelete, onEdit, onAddNew }: Props) => {
  // LỌC: Chỉ giữ lại những nhân viên có active === true
  // Lưu ý: Nếu interface Staff chưa có thuộc tính active, hãy ép kiểu (s as any).active
  const activeStaff = staff.filter((s) => (s as any).active === true);

  const renderRoleBadge = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-blue-100 text-blue-800",
      CHEF: "bg-orange-100 text-orange-800",
      STAFF: "bg-green-100 text-green-800",
      CASHIER: "bg-purple-100 text-purple-800", // Thêm badge cho Cashier
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roles[role] || "bg-gray-100 text-gray-800"}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
        <button 
          onClick={onAddNew}
          className="bg-[#801b1b] hover:bg-[#a32424] text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
        >
          + Add New Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 text-sm uppercase tracking-wider">
              <th className="py-4 px-4 font-medium">ID</th>
              <th className="py-4 px-4 font-medium">Staff Name</th>
              <th className="py-4 px-4 font-medium">Email Address</th>
              <th className="py-4 px-4 font-medium">Role</th>
              <th className="py-4 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">Loading staff data...</td>
              </tr>
            ) : activeStaff.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">No active staff found</td>
              </tr>
            ) : (
              activeStaff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600 font-medium">#{s.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-800">{s.fullName}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{s.email}</td>
                  <td className="py-4 px-4">
                    {renderRoleBadge(s.role)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => onEdit(s)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(s.id)}
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StaffView