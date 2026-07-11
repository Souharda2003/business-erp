import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import "../css/analytics.css";

const COLORS = [
  "#d4af37",

  "#16a34a",

  "#2563eb",

  "#dc2626",

  "#9333ea",

  "#f97316",
];

function IncomePieChart({ data }) {
  return (
    <div className="chartBox">
      <h2>Income Distribution</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomePieChart;
