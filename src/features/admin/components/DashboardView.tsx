import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  stats?: {
    revenueToday: number;
    ordersToday: number;
    activeTables: number;
    lowStock: number;
  };

  salesData?: {
    name: string;
    revenue: number;
  }[];

  recentOrders?: {
    id: string;
    table: string;
    total: number;
    status: string;
  }[];
}

const DashboardView: React.FC = () => {

  const [stats, setStats] = useState({
    revenueToday: 0,
    ordersToday: 0,
    activeTables: 0,
    lowStock: 0
  });

  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

const loadDashboard = async () => {
  try {
    // Gọi tất cả API cùng lúc, lỗi 1 cái cũng không sao
    const [billsRes, ordersRes, tablesRes, batchesRes, preparingItemsRes] = await Promise.allSettled([
      adminApi.getBills(),
      adminApi.getOrders(),
      adminApi.getTables(),
      adminApi.getExpiringBatches(),
      adminApi.getPreparingItems()
    ]);

    // Helper to get array data from backend response
    const getArrayData = (res: any) => {
      if (res.status === 'fulfilled') {
        if (res.value?.data) {
          return res.value.data;
        }
        console.warn('Dashboard: fulfilled response missing data field', res.value);
        return [];
      }

      console.warn('Dashboard: rejected response', res.reason);
      return [];
    };

    const bills = getArrayData(billsRes);
    const orders = getArrayData(ordersRes);
    const tables = getArrayData(tablesRes);
    const batches = getArrayData(batchesRes);
    const preparingItems = getArrayData(preparingItemsRes);

    // Lấy ngày hiện tại khớp với format "2026-03-09" trong DB của bạn
    const today = new Date().toISOString().slice(0, 10);

    // 1. Tính Doanh thu (Sử dụng totalPrice theo Swagger image_2fc85e.png)
    const revenueToday = bills
      .filter((b: any) => b.createdAt?.startsWith(today))
      .reduce((sum: number, b: any) => sum + (Number(b.totalPrice) || 0), 0);

    // 2. Tính số Đơn hàng hôm nay (chỉ active orders at table)
    const activeOrdersToday = orders.filter((o: any) => 
      o.createdAt?.startsWith(today) &&
      o.orderType === "AT_TABLE" &&  // Chỉ lấy orders tại bàn
      (o.orderStatus === null || o.orderStatus === "PENDING" || o.orderStatus === "PREPARING") // Active status
    );

    // 3. Tính bàn đang có khách (image_2fc573.png)
    const activeTables = tables.filter(
      (t: any) => t.status === "OCCUPIED"
    ).length;

    setStats({
      revenueToday,
      ordersToday: preparingItems.length, // Số items đang PREPARING
      activeTables,
      lowStock: batches.length
    });

    // 4. Cập nhật biểu đồ Sales Overview
    if (bills.length > 0) {
      const chart = bills.slice(-7).map((b: any) => ({
        name: b.createdAt?.slice(5, 10),
        revenue: b.totalPrice
      }));
      setSalesData(chart);
    }

    // 5. Cập nhật đơn hàng gần đây (chỉ active orders at table trong ngày)
    if (orders.length > 0) {
      const activeOrdersToday = orders.filter((o: any) => 
        o.createdAt?.startsWith(today) &&  // Chỉ lấy orders trong ngày hôm nay
        o.orderType === "AT_TABLE" &&  // Chỉ lấy orders tại bàn
        (o.orderStatus === null || o.orderStatus === "PENDING" || o.orderStatus === "PREPARING") // Active status
      );
      
      const recent = activeOrdersToday.slice(-5).map((o: any) => ({
        id: o.id,
        table: o.tableNumber || o.tableId || "N/A",
        total: o.totalAmount || 0,
        status: o.orderStatus || o.status
      }));
      setRecentOrders(recent);
    }

  } catch (err) {
    console.error("Critical Dashboard Error:", err);
  }
};

  const cards = [
    { label:"Revenue Today", value:`$${stats.revenueToday}` },
    { label:"Orders Today", value:stats.ordersToday },
    { label:"Active Tables", value:stats.activeTables },
    { label:"Low Inventory", value:stats.lowStock }
  ];

  return (
    <div className="space-y-10">

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
              {c.label}
            </p>

            <p className="text-3xl font-black mt-2 text-[#800020]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* SALES CHART */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">
          Sales Overview
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#800020"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">
          Recent Orders
        </p>

        <div className="space-y-4">
          {recentOrders.length === 0 && (
            <p className="text-gray-400 italic">
              Orders list will appear here
            </p>
          )}

          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-bold">Table {order.table}</p>
                <p className="text-xs text-gray-400">
                  Order #{order.id}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#800020]">
                  ${order.total}
                </p>
                <p className="text-xs text-gray-400">
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default DashboardView;