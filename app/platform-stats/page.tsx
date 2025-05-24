"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, Users, Building } from "lucide-react";

export default function PlatformStats() {
  // Mock data for charts
  const volumeData = [
    { name: "Jan", volume: 4000000 },
    { name: "Feb", volume: 3000000 },
    { name: "Mar", volume: 5000000 },
    { name: "Apr", volume: 4500000 },
    { name: "May", volume: 6000000 },
    { name: "Jun", volume: 7200000 },
  ];

  const priceData = [
    { name: "Jan", avgPrice: 45 },
    { name: "Feb", avgPrice: 52 },
    { name: "Mar", avgPrice: 48 },
    { name: "Apr", avgPrice: 61 },
    { name: "May", avgPrice: 55 },
    { name: "Jun", avgPrice: 67 },
  ];

  const sectorData = [
    { name: "Technology", value: 35, color: "#F4A261" },
    { name: "Healthcare", value: 25, color: "#E76F51" },
    { name: "Finance", value: 20, color: "#2A9D8F" },
    { name: "Energy", value: 12, color: "#264653" },
    { name: "Other", value: 8, color: "#E9C46A" },
  ];

  const platformMetrics = {
    totalAssets: 47,
    totalMarketCap: 234500000,
    totalVolume24h: 45200000,
    activeTraders: 12400,
    totalTransactions: 89650,
    avgAssetPrice: 156.78,
  };

  return (
    <Layout>
      <div className="relative overflow-hidden py-20">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Platform Analytics
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time insights into the Zenova ecosystem and tokenized asset
              performance.
            </p>
          </motion.div>

          {/* Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                icon: Building,
                label: "Total Assets",
                value: platformMetrics.totalAssets,
                suffix: "",
                color: "text-metamesh-yellow",
              },
              {
                icon: DollarSign,
                label: "Market Cap",
                value: platformMetrics.totalMarketCap / 1000000,
                suffix: "M",
                color: "text-green-400",
              },
              {
                icon: TrendingUp,
                label: "24h Volume",
                value: platformMetrics.totalVolume24h / 1000000,
                suffix: "M",
                color: "text-blue-400",
              },
              {
                icon: Users,
                label: "Active Traders",
                value: platformMetrics.activeTraders / 1000,
                suffix: "K",
                color: "text-purple-400",
              },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 glow-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  <span className="text-sm text-gray-400">{metric.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {typeof metric.value === "number" && metric.value < 1000
                    ? metric.value
                    : Math.round(metric.value * 10) / 10}
                  {metric.suffix}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Volume Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Monthly Trading Volume
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="volume" fill="#F4A261" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Price Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Average Asset Price Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#10B981"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Sector Distribution and Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sector Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Assets by Sector
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Additional Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Platform Insights
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Transactions</span>
                  <span className="text-white font-semibold">
                    {platformMetrics.totalTransactions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average Asset Price</span>
                  <span className="text-white font-semibold">
                    ${platformMetrics.avgAssetPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Platform Growth</span>
                  <span className="text-green-400 font-semibold">+23.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">AI Evaluations</span>
                  <span className="text-white font-semibold">47 Completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">98.7%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
