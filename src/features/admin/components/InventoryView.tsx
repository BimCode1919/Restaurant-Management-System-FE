import { Ingredient } from "@/types";
import { Search, Plus, Edit2, Trash2 } from "lucide-react"; // Bạn có thể cài đặt lucide-react để có icon đẹp

interface Props {
  ingredients: Ingredient[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export const InventoryView = ({
  ingredients,
  loading,
  search,
  setSearch,
  onEdit,
  onDelete,
  onAddNew
}: Props) => {

  const filtered = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 font-sans text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Inventory</h2>
        <p className="text-sm text-gray-400 font-medium">SUN MAR 08 2026</p>
      </div>

      {/* Controls Section */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            placeholder="Search ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm transition-all"
          />
        </div>

        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#a32020] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Ingredient
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 italic">Loading inventory data...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-gray-400">#{i.id}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-700">{i.name}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-600">
                    <span className={i.stockQuantity < 10 ? "text-red-500" : ""}>
                      {i.stockQuantity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{i.unit}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(i)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(i.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400">No ingredients found.</div>
        )}
      </div>
    </div>
  );
};
