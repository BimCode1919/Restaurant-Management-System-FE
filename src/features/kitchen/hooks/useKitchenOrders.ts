import { useState, useEffect } from "react";
import { kitchenApi } from "../services/kitchenApi";

export const useKitchenOrders = (store: any) => {
  const [preparingOrders, setPreparingOrders] = useState<any[]>([]);
  const [readyOrders, setReadyOrders] = useState<any[]>([]);

  const loadData = async () => {
    try {
      // Gọi cả 2 cùng lúc cho nhanh má ơi
      const [resPrep, resReady]: any = await Promise.all([
        kitchenApi.getPreparingOrders(),
        kitchenApi.getReadyOrders()
      ]);

      // Gán dữ liệu (res.data là mảng từ API trả về)
      if (resPrep?.data) setPreparingOrders(resPrep.data);
      if (resReady?.data) setReadyOrders(resReady.data);
      
    } catch (error) {
      console.error("Lỗi cập nhật bếp:", error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); 
    return () => clearInterval(interval);
  }, []);

  return {
    preparingOrders,
    readyOrders,
    refresh: loadData 
  };
};