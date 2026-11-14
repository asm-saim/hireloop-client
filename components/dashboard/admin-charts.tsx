"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const tooltipStyle = {
  contentStyle: {
    background: "#151516",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
  },
  itemStyle: { color: "#fff" },
  labelStyle: { color: "rgba(255,255,255,0.7)" },
}
const axis = { stroke: "rgba(255,255,255,0.5)", tick: { fontSize: 12 } }

export function JobsByCategoryChart({
  data,
}: {
  data: { category: string; count: number }[]
}) {
  return (
    <div>
      <div className="h-64" aria-hidden>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="category" {...axis} interval={0} />
            <YAxis allowDecimals={false} {...axis} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              {...tooltipStyle}
              formatter={(v) => [v, "Jobs"]}
            />
            <Bar
              dataKey="count"
              fill="#5c53fe"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only">
        {data.map((d) => (
          <li key={d.category}>
            {d.category}: {d.count} jobs
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SignupsChart({
  data,
}: {
  data: { date: string; label: string; count: number }[]
}) {
  const total = data.reduce((n, d) => n + d.count, 0)
  return (
    <div>
      <div className="h-64" aria-hidden>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height: 256 }}
        >
          <LineChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" {...axis} interval={6} />
            <YAxis
              allowDecimals={false}
              domain={[0, (max: number) => Math.max(1, max)]}
              {...axis}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.2)" }}
              {...tooltipStyle}
              formatter={(v) => [v, "New users"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#36c4e0"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">{total} new users in the last 30 days.</p>
    </div>
  )
}
