import { useState, useEffect } from "react";
import { Discount } from "../types";
import { adminApi } from "../services/adminApi";

interface Props {
  discount?: Discount | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultDiscount: any = {
  name: "",
  code: "",
  description: "",
  discountType: "ITEM_SPECIFIC",
  valueType: "PERCENTAGE",
  value: 0,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  usageLimit: 1,
  minPartySize: 1,
  maxPartySize: 0,
  tierConfig: "",
  applicableDays: "",
  applyToSpecificItems: false,
  active: true,
};

const DiscountModal = ({ discount, isOpen, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({ ...defaultDiscount });
  const [loading, setLoading] = useState(false);
  const [tierConfigError, setTierConfigError] = useState<string>("");

  useEffect(() => {
    if (discount) {
      setForm({ ...discount });
    } else {
      setForm({ ...defaultDiscount });
    }
  }, [discount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate tierConfig live if editing
    if (name === "tierConfig") {
      try {
        if (value.trim() === "") {
          setTierConfigError("Không được để trống");
        } else {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            setTierConfigError("Phải là một mảng JSON");
          } else {
            setTierConfigError("");
          }
        }
      } catch {
        setTierConfigError("Không phải JSON hợp lệ");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate tierConfig before submit
    if (form.discountType === "BILL_TIER") {
      try {
        if (form.tierConfig.trim() === "") {
          setTierConfigError("Không được để trống");
          return;
        }
        const parsed = JSON.parse(form.tierConfig);
        if (!Array.isArray(parsed)) {
          setTierConfigError("Phải là một mảng JSON");
          return;
        }
        setTierConfigError("");
      } catch {
        setTierConfigError("Không phải JSON hợp lệ");
        return;
      }
    }
    setLoading(true);
    try {
      // Build payload based on discountType
      let payload: any = {
        name: form.name,
        code: (form.code || "").trim() || `DISCOUNT${Date.now()}`,
        description: form.description,
        discountType: form.discountType,
        valueType: form.valueType,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        active: form.active,
      };

      // Add fields by discountType
      if (form.discountType === "BILL_TIER") {
        payload.tierConfig = form.tierConfig;
      }
      if (form.discountType === "PARTY_SIZE") {
        payload.minPartySize = form.minPartySize ? Number(form.minPartySize) : undefined;
        payload.maxPartySize = form.maxPartySize ? Number(form.maxPartySize) : undefined;
      }
      if (form.discountType === "HOLIDAY") {
        payload.applicableDays = form.applicableDays;
      }
      if (form.discountType === "ITEM_SPECIFIC") {
        payload.applyToSpecificItems = form.applyToSpecificItems;
      }

      // Remove undefined fields
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      if (discount) {
        await adminApi.updateDiscount(discount.id, payload);
      } else {
        await adminApi.createDiscount(payload);
      }
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save discount:", error);
      alert("Failed to save discount. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-[#801b1b] p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">{discount ? 'Update Discount' : 'Add New Discount'}</h3>
          <button onClick={onClose} className="hover:text-gray-300 text-2xl">&times;</button>
        </div>
        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {/* Discount Name & Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Name <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Discount name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Code <span className="text-gray-400">(auto if blank)</span></label>
              <input name="code" value={form.code || ""} onChange={handleChange} placeholder="e.g. SPRING2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
          </div>
          {/* Discount Type, Value Type, Value */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type <span className="text-red-500">*</span></label>
              <select name="discountType" value={form.discountType} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none bg-white">
                <option value="ITEM_SPECIFIC">Item Specific</option>
                <option value="BILL_TIER">Bill Tier</option>
                <option value="PARTY_SIZE">Party Size</option>
                <option value="HOLIDAY">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Value Type <span className="text-red-500">*</span></label>
              <select name="valueType" value={form.valueType} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none bg-white">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
                <option value="FIXED_PRICE">Fixed Price</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Value <span className="text-red-500">*</span></label>
              <input name="value" type="number" value={form.value} onChange={handleChange} required min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
          </div>
          {/* Min/Max Order, Usage Limit */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min Order Amount</label>
              <input name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={handleChange} placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Discount Amount</label>
              <input name="maxDiscountAmount" type="number" value={form.maxDiscountAmount} onChange={handleChange} placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Usage Limit</label>
              <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
          </div>
          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input name="startDate" type="datetime-local" value={form.startDate.slice(0, 16)} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input name="endDate" type="datetime-local" value={form.endDate.slice(0, 16)} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
            </div>
          </div>
          {/* PARTY_SIZE fields */}
          {form.discountType === "PARTY_SIZE" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min Party Size</label>
                <input name="minPartySize" type="number" value={form.minPartySize} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Party Size</label>
                <input name="maxPartySize" type="number" value={form.maxPartySize} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
              </div>
            </div>
          )}
          {/* BILL_TIER fields */}
          {form.discountType === "BILL_TIER" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tier Config <span className="text-red-500">*</span></label>
              <textarea name="tierConfig" value={form.tierConfig} onChange={handleChange} required rows={3}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#801b1b] ${tierConfigError ? 'border-red-500' : 'border-gray-300'}`} placeholder='[{"min":0,"max":500000,"discount":5},{"min":500001,"max":1000000,"discount":10}]' />
              <div className="text-xs text-gray-500 mt-1">
                Enter a JSON array of tiers, e.g.: {'[{"min":0,"max":500000,"discount":5},{"min":500001,"max":1000000,"discount":10}]'}
              </div>
              {tierConfigError && <div className="text-xs text-red-500 mt-1">{tierConfigError}</div>}
            </div>
          )}
          {/* HOLIDAY fields */}
          {form.discountType === "HOLIDAY" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Applicable Days</label>
              <input name="applicableDays" value={form.applicableDays} onChange={handleChange} placeholder="SATURDAY,SUNDAY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#801b1b] outline-none" />
              <div className="text-xs text-gray-500 mt-1">Enter days separated by comma (e.g. SATURDAY,SUNDAY)</div>
            </div>
          )}
          {/* ITEM_SPECIFIC fields */}
          {form.discountType === "ITEM_SPECIFIC" && (
            <div className="flex items-center gap-2">
              <input name="applyToSpecificItems" type="checkbox" checked={form.applyToSpecificItems} onChange={handleChange}
                className="h-4 w-4 text-[#801b1b] border-gray-300 rounded" />
              <label className="font-semibold text-gray-700">Apply to specific items only</label>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input name="active" type="checkbox" checked={form.active} onChange={handleChange}
              className="h-4 w-4 text-[#801b1b] border-gray-300 rounded" />
            <label className="font-semibold text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading || (form.discountType === 'BILL_TIER' && !!tierConfigError)}
              className="flex-1 px-4 py-2 bg-[#801b1b] text-white rounded-lg hover:bg-[#a32424] disabled:opacity-50">
              {loading ? "Saving..." : discount ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountModal;
