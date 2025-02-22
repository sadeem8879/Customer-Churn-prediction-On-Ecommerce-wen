import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [churnData, setChurnData] = useState([]);
  
  useEffect(() => {
    fetch("/api/churn/churn-data", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setChurnData(data))
      .catch((err) => console.error("Error fetching churn data:", err));
  }, []);

  const chartData = churnData.map(user => ({
    name: user.email,
    orders: user.total_orders,
    spent: user.total_spent,
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Churn Prediction Dashboard</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8" name="Total Orders" />
          <Bar dataKey="spent" fill="#82ca9d" name="Total Spent ($)" />
        </BarChart>
      </ResponsiveContainer>

      <table className="w-full border-collapse border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">User ID</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Total Orders</th>
            <th className="border border-gray-300 px-4 py-2">Total Spent</th>
            <th className="border border-gray-300 px-4 py-2">Recency (Days)</th>
            <th className="border border-gray-300 px-4 py-2">Churn Status</th>
          </tr>
        </thead>
        <tbody>
          {churnData.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.total_orders}</td>
              <td className="border border-gray-300 px-4 py-2">${user.total_spent}</td>
              <td className="border border-gray-300 px-4 py-2">{user.recency_days}</td>
              <td className="border border-gray-300 px-4 py-2">{user.churn === 1 ? "Churned" : "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
