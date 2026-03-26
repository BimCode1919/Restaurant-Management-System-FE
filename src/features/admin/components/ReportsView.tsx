import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ReportsViewProps {}

const ReportsView: React.FC<ReportsViewProps> = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    revenue: [],
    orders: [],
    popularItems: [],
    categorySales: []
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Load data for the last 30 days
      const [billsRes, ordersRes] = await Promise.allSettled([
        adminApi.getBills(),
        adminApi.getOrders()
      ]);

      const bills = billsRes.status === 'fulfilled' ? billsRes.value.data || [] : [];
      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data || [] : [];

      // Process revenue data (last 30 days)
      const revenueData = processRevenueData(bills);

      // Process orders data
      const ordersData = processOrdersData(orders);

      // Process popular items
      const popularItems = processPopularItems(orders);

      // Process category sales
      const categorySales = processCategorySales(orders);

      setReportData({
        revenue: revenueData,
        orders: ordersData,
        popularItems,
        categorySales
      });
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (bills: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().slice(0, 10);
    });

    return last30Days.map(date => {
      const dayBills = bills.filter(bill =>
        bill.createdAt?.startsWith(date)
      );
      const revenue = dayBills.reduce((sum, bill) => sum + (bill.totalPrice || 0), 0);

      return {
        date: date.slice(5), // MM-DD format
        revenue,
        orders: dayBills.length
      };
    });
  };

  const processOrdersData = (orders: any[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().slice(0, 10);
    });

    return last30Days.map(date => {
      const dayOrders = orders.filter(order =>
        order.createdAt?.startsWith(date)
      );

      return {
        date: date.slice(5),
        orders: dayOrders.length,
        atTable: dayOrders.filter(o => o.orderType === 'AT_TABLE').length,
        preOrder: dayOrders.filter(o => o.orderType === 'PRE_ORDER').length
      };
    });
  };

  const processPopularItems = (orders: any[]) => {
    const itemCount: { [key: string]: { name: string; count: number; revenue: number } } = {};

    orders.forEach(order => {
      if (order.items) {
        order.items.forEach((item: any) => {
          const key = item.itemId;
          if (!itemCount[key]) {
            itemCount[key] = {
              name: item.itemName,
              count: 0,
              revenue: 0
            };
          }
          itemCount[key].count += item.quantity || 1;
          itemCount[key].revenue += item.subtotal || 0;
        });
      }
    });

    return Object.values(itemCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const processCategorySales = (orders: any[]) => {
    const categoryCount: { [key: string]: { name: string; value: number } } = {};

    orders.forEach(order => {
      if (order.items) {
        order.items.forEach((item: any) => {
          // Since we don't have category in order items, we'll categorize by price ranges
          let category = 'Other';
          const price = item.price || 0;
          if (price < 50000) category = 'Budget';
          else if (price < 100000) category = 'Standard';
          else if (price < 150000) category = 'Premium';
          else category = 'Luxury';

          if (!categoryCount[category]) {
            categoryCount[category] = { name: category, value: 0 };
          }
          categoryCount[category].value += item.subtotal || 0;
        });
      }
    });

    return Object.values(categoryCount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-dark-gray">Reports & Analytics</h1>
          <p className="text-gray-500 mt-2">Comprehensive insights for the last 30 days</p>
        </div>
        <button
          onClick={loadReports}
          className="bg-burgundy text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined">refresh</span>
          Refresh
        </button>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-black text-dark-gray mb-6">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reportData.revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#8B5A3C" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-black text-dark-gray mb-6">Order Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.orders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#8B5A3C" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Items */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-dark-gray mb-6">Top 10 Popular Items</h2>
          <div className="space-y-4">
            {reportData.popularItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-dark-gray">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.count} orders</p>
                  </div>
                </div>
                <p className="font-black text-burgundy">${item.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-dark-gray mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.categorySales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-2xl font-black text-burgundy">
            ${reportData.revenue.reduce((sum: number, item: any) => sum + item.revenue, 0)}
          </p>
          <p className="text-sm text-gray-500 uppercase font-black tracking-widest">Total Revenue</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-2xl font-black text-burgundy">
            {reportData.orders.reduce((sum: number, item: any) => sum + item.orders, 0)}
          </p>
          <p className="text-sm text-gray-500 uppercase font-black tracking-widest">Total Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-2xl font-black text-burgundy">
            {reportData.orders.reduce((sum: number, item: any) => sum + item.atTable, 0)}
          </p>
          <p className="text-sm text-gray-500 uppercase font-black tracking-widest">At Table Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-2xl font-black text-burgundy">
            {reportData.popularItems.length > 0 ? reportData.popularItems[0].name : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 uppercase font-black tracking-widest">Best Seller</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;