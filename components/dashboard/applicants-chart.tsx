"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const truncate = (s: string) => (s.length > 22 ? `${s.slice(0, 21)}…` : s)

/** Applicants received in the last 30 days, one bar per job post. */
export function ApplicantsChart({
  data,
}: {
  data: { title: string; applicants: number }[]
}) {
  const height = Math.max(180, data.length * 44 + 40)
  return (
    <div>
      <div style={{ height }} aria-hidden>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 480, height }}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, (max: number) => Math.max(1, max)]}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="title"
              width={150}
              tickFormatter={truncate}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.85)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                background: "#151516",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(v) => [v, "Applicants"]}
            />
            <Bar
              dataKey="applicants"
              fill="#5c53fe"
              radius={[0, 6, 6, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only">
        {data.map((d) => (
          <li key={d.title}>
            {d.title}: {d.applicants} applicants in the last 30 days
          </li>
        ))}
      </ul>
    </div>
  )
}
