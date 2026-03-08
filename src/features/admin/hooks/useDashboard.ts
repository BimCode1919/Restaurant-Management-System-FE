import { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";

export const useDashboard = () => {

  const [stats, setStats] = useState({
    revenueToday: 0,
    ordersToday: 0,
    activeTables: 0,
    lowInventory: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {

    try {

      const [billsRes, ordersRes, tablesRes, ingredientsRes] =
        await Promise.all([
          adminApi.getBills(),
          adminApi.getOrders(),
          adminApi.getTables(),
          adminApi.getExpiringBatches(),
        ]);

      const bills = billsRes?.data?.data || [];
      const orders = ordersRes?.data?.data || [];
      const tables = tablesRes?.data?.data || [];
      const ingredients = ingredientsRes?.data?.data || [];

      const revenueToday = bills.reduce(
        (sum: number, bill: any) => sum + (bill.totalPrice || 0),
        0
      );

      const ordersToday = orders.length;

      const activeTables = tables.filter(
        (t: any) => t.currentBill !== null
      ).length;

      const lowInventory = ingredients.filter(
        (i: any) => i.stockQuantity < 10
      ).length;

      setStats({
        revenueToday,
        ordersToday,
        activeTables,
        lowInventory
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { stats, loading };
};