import React, { useEffect, useState } from 'react';
import { Staff } from '../types';
import { adminApi } from '../services/adminApi';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingStaff?: Staff | null;
}

const StaffModal = ({ isOpen, onClose, onSuccess, editingStaff }: StaffModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '', // Thêm trường phone vào state
    role: 'STAFF',
    password: '',
  });

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        fullName: editingStaff.fullName || '',
        email: editingStaff.email || '',
        phone: (editingStaff as any).phone || '', // Ép kiểu tạm thời nếu interface Staff chưa có phone
        role: editingStaff.role || 'STAFF',
        password: '', 
      });
    } else {
      setFormData({ fullName: '', email: '', phone: '', role: 'STAFF', password: '' });
    }
  }, [editingStaff, isOpen]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Map tên Role từ <select> sang ID tương ứng trong DB của bạn
    const roleMapping: Record<string, number> = {
        'ADMIN': 1,
        'STAFF': 2,
        'CHEF': 3,
        'MANAGER': 6,
        'CASHIER': 5
    };

    // 2. Kiểm tra mật khẩu (Sửa lỗi image_2edcda.png)
    // Backend yêu cầu: Chữ hoa, chữ thường, số, ký tự đặc biệt và >= 8 ký tự
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!editingStaff && !passwordRegex.test(formData.password)) {
        alert("Password must contain: 8+ chars, uppercase, lowercase, number, and special character (@$!%*?&)");
        return;
    }

    setLoading(true);
    
    try {
        const payload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            roleId: roleMapping[formData.role] // Gửi ID số thay vì chuỗi
        };

        if (editingStaff) {
            // Khi sửa, không gửi password (như bạn yêu cầu)
            await adminApi.updateStaff(editingStaff.id, payload);
        } else {
            // Khi tạo mới, gửi kèm password đã validate
            await adminApi.createStaff({
                ...payload,
                password: formData.password
            });
        }
        onSuccess();
        onClose();
    } catch (error: any) {
        const msg = error.response?.data?.details || error.response?.data?.message;
        alert("Lỗi: " + JSON.stringify(msg));
    } finally {
        setLoading(false);
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-[#801b1b] p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">{editingStaff ? 'Edit Staff Member' : 'Add New Staff'}</h3>
          <button onClick={onClose} className="hover:text-gray-300 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Nguyen Van A"
            />
          </div>

          {/* Phone Number - MỚI THÊM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0912345678"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              disabled={!!editingStaff}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none ${editingStaff ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#801b1b]'}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          {!editingStaff && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none bg-white"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
                <option value="STAFF">Staff Member</option>
                <option value="CHEF">Chef</option>
                <option value="ADMIN">Administrator</option>
                <option value="CASHIER">Cashier</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-[#801b1b] text-white rounded-lg hover:bg-[#a32424] disabled:opacity-50">
              {loading ? 'Saving...' : editingStaff ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;