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

      const billsRes = await adminApi.getBills();
      const ordersRes = await adminApi.getOrders();
      const tablesRes = await adminApi.getTables();
      const batchesRes = await adminApi.getExpiringBatches();

      const bills = billsRes.data.data || [];
      const orders = ordersRes.data.data || [];
      const tables = tablesRes.data.data || [];
      const batches = batchesRes.data.data || [];

      const today = new Date().toISOString().slice(0,10);

      const revenueToday = bills
        .filter((b:any)=>b.createdAt?.startsWith(today))
        .reduce((sum:number,b:any)=>sum+b.totalAmount,0);

      const ordersToday = orders.filter((o:any)=>
        o.createdAt?.startsWith(today)
      ).length;

      const activeTables = tables.filter(
        (t:any)=>t.status==="OCCUPIED"
      ).length;

      const lowStock = batches.length;

      setStats({
        revenueToday,
        ordersToday,
        activeTables,
        lowStock
      });

      // chart
      const chart = bills.slice(-7).map((b:any)=>({
        name: b.createdAt?.slice(5,10),
        revenue: b.totalAmount
      }));

      setSalesData(chart);

      // recent orders
      const recent = orders.slice(-5).map((o:any)=>({
        id: o.id,
        table: o.tableId,
        total: o.totalAmount,
        status: o.status
      }));

      setRecentOrders(recent);

    } catch(err){
      console.error("Dashboard error:",err);
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