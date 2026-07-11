import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function AnalyticsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
     <LineChart data={data}>

<XAxis

dataKey="month"

/>

<YAxis/>

<Tooltip/>

<Line

type="monotone"

dataKey="amount"

stroke="#2563eb"

strokeWidth={4}

/>

</LineChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsChart;