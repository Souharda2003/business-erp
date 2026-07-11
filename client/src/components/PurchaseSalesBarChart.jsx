import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import "../css/analytics.css";

function PurchaseSalesBarChart({ data }) {
  return (
    <div className="chartBox">
      <h2>Purchase vs Sales</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid stroke="#333" />

          <XAxis dataKey="name" stroke="#d4af37" />

          <YAxis stroke="#d4af37" />

          <Tooltip />

          <Legend />

          <Bar

dataKey="amount"

fill="#2563eb"

radius={[8,8,0,0]}

/>
</BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PurchaseSalesBarChart;
