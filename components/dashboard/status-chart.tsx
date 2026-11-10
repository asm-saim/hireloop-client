"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { STATUS_COLOR } from "@/components/dashboard/status-badge"
import {
  APPLICATION_STATUSES,
  STATUS_LABEL,
  type ApplicationStatus,
} from "@/server/models"

/** Donut chart of application statuses, with an accessible legend of counts. */
export function StatusChart({
  counts,
}: {
  counts: Record<ApplicationStatus, number>
}) {
  const data = APPLICATION_STATUSES.map((s) => ({
    key: s,
    name: STATUS_LABEL[s],
    value: counts[s],
  }))
  const total = data.reduce((n, d) => n + d.value, 0)
  const visible = data.filter((d) => d.value > 0)

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative h-56" aria-hidden>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 224, height: 224 }}
        >
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={visible.length > 1 ? 3 : 0}
              stroke="none"
            >
              {visible.map((d) => (
                <Cell key={d.key} fill={STATUS_COLOR[d.key]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#151516",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-jakarta text-4xl font-semibold tracking-[-0.04em] text-white">
              {total}
            </p>
            <p className="text-xs text-white/60">applications</p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {data.map((d) => (
          <li
            key={d.key}
            className="flex items-center justify-between gap-3 text-sm text-white"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[d.key] }}
              />
              {d.name}
            </span>
            <span className="font-medium">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
