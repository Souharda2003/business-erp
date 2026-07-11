import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import "../css/analytics.css";

function AnalyticsLineChart({ data }) {
  return (
    <div className="chartBox">
      <h2>Monthly Business Trend</h2>

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" stroke="#333" />

          <XAxis dataKey="name" stroke="#d4af37" />

          <YAxis stroke="#d4af37" />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#d4af37"
            strokeWidth={4}
            dot={{
              r: 7,

              fill: "#d4af37",
            }}
            activeDot={{
              r: 10,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsLineChart;
