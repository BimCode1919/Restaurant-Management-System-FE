import React from "react";
import { Discount } from "../types";

interface Props {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
}

const DiscountList: React.FC<Props> = ({ discounts, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Value</th>
            <th className="p-2 text-left">Active</th>
            <th className="p-2 text-left">Start</th>
            <th className="p-2 text-left">End</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-4">No discounts found.</td>
            </tr>
          )}
          {discounts.map((d) => (
            <tr key={d.id} className="border-b">
              <td className="p-2 font-bold">{d.name}</td>
              <td className="p-2">{d.discountType}</td>
              <td className="p-2">{d.value} {d.valueType === "PERCENTAGE" ? "%" : "VNĐ"}</td>
              <td className="p-2">{d.active ? "Yes" : "No"}</td>
              <td className="p-2">{d.startDate.slice(0, 10)}</td>
              <td className="p-2">{d.endDate.slice(0, 10)}</td>
              <td className="p-2 flex gap-2">
                <button className="btn-secondary px-2 py-1" onClick={() => onEdit(d)}>Edit</button>
                <button className="btn-danger px-2 py-1" onClick={() => onDelete(d)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountList;
