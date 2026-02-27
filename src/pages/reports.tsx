import { Box, Flex, Grid, Text } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

// ---------------------------------------------------------------------------
// Mock report data
// ---------------------------------------------------------------------------

const monthlyRevenue = [
  { month: "Sep", value: 320 },
  { month: "Okt", value: 450 },
  { month: "Nov", value: 380 },
  { month: "Des", value: 520 },
  { month: "Jan", value: 490 },
  { month: "Feb", value: 610 },
]

const topPerformers = [
  { name: "Budi Santoso", deals: 12, revenue: "Rp 1.2M", rate: 78 },
  { name: "Nina Permata", deals: 9, revenue: "Rp 980Jt", rate: 72 },
  { name: "Andi Wijaya", deals: 8, revenue: "Rp 850Jt", rate: 65 },
  { name: "Siti Rahayu", deals: 7, revenue: "Rp 720Jt", rate: 60 },
  { name: "Hendra Gunawan", deals: 6, revenue: "Rp 650Jt", rate: 55 },
]

const conversionFunnel = [
  { stage: "Lead", count: 284, color: "#2563EB" },
  { stage: "Qualified", count: 156, color: "#8B5CF6" },
  { stage: "Proposal", count: 89, color: "#F59E0B" },
  { stage: "Negotiation", count: 42, color: "#EA580C" },
  { stage: "Closed Won", count: 28, color: "#10B981" },
]

const revenueBySource = [
  { source: "Kontak Langsung", pct: 38, color: "#2563EB" },
  { source: "Referral", pct: 28, color: "#8B5CF6" },
  { source: "Website", pct: 18, color: "#10B981" },
  { source: "Event", pct: 10, color: "#F59E0B" },
  { source: "Lainnya", pct: 6, color: "#64748B" },
]

const summaryStats = [
  { label: "Total Revenue (MTD)", value: "Rp 4.2M", change: "+23%", trend: "up", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Deals Closed", value: "28", change: "+15%", trend: "up", color: "#10B981", bg: "#ECFDF5" },
  { label: "Avg Deal Size", value: "Rp 150Jt", change: "+8%", trend: "up", color: "#8B5CF6", bg: "#F5F3FF" },
  { label: "Conversion Rate", value: "9.8%", change: "-2%", trend: "down", color: "#F59E0B", bg: "#FFFBEB" },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ReportsPage: React.FC<PageProps> = ({ location }) => {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value))
  const maxFunnel = Math.max(...conversionFunnel.map((f) => f.count))

  return (
    <Layout currentPath={location.pathname} title="Reports">
      {/* Summary cards */}
      <Grid sx={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 5, mb: 7 }}>
        {summaryStats.map((stat) => (
          <Box key={stat.label} sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
            <Flex sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
              <Text sx={{ fontSize: 0, fontWeight: "semibold", color: "muted", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</Text>
              <Flex sx={{ width: 38, height: 38, borderRadius: "lg", backgroundColor: stat.bg, alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "circle", bg: stat.color }} />
              </Flex>
            </Flex>
            <Text sx={{ fontSize: 9, fontWeight: "extrabold", color: "text", mb: 2, display: "block" }}>{stat.value}</Text>
            <Text sx={{ fontSize: 2, color: stat.trend === "up" ? "success" : "danger" }}>
              {stat.trend === "up" ? "▲" : "▼"} {stat.change} dari bulan lalu
            </Text>
          </Box>
        ))}
      </Grid>

      <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 6, mb: 6 }}>
        {/* Revenue chart */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", mb: 5, display: "block" }}>Revenue Bulanan</Text>
          <Flex sx={{ alignItems: "flex-end", gap: 3, height: 200 }}>
            {monthlyRevenue.map((m) => {
              const pct = (m.value / maxRevenue) * 100
              return (
                <Flex key={m.month} sx={{ flexDirection: "column", alignItems: "center", flex: 1, gap: 2 }}>
                  <Text sx={{ fontSize: 1, fontWeight: "bold", color: "primary" }}>Rp {m.value}Jt</Text>
                  <Box
                    sx={{
                      width: "100%",
                      height: `${pct}%`,
                      bg: "primary",
                      borderRadius: "md",
                      minHeight: "8px",
                      transition: "height 0.3s ease",
                    }}
                  />
                  <Text sx={{ fontSize: 1, color: "muted", fontWeight: "semibold" }}>{m.month}</Text>
                </Flex>
              )
            })}
          </Flex>
        </Box>

        {/* Conversion funnel */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", mb: 5, display: "block" }}>Conversion Funnel</Text>
          <Flex sx={{ flexDirection: "column", gap: 4 }}>
            {conversionFunnel.map((f) => {
              const pct = (f.count / maxFunnel) * 100
              return (
                <Box key={f.stage}>
                  <Flex sx={{ justifyContent: "space-between", mb: 2 }}>
                    <Text sx={{ fontSize: 2, fontWeight: "semibold", color: "text" }}>{f.stage}</Text>
                    <Text sx={{ fontSize: 2, fontWeight: "bold", color: f.color }}>{f.count}</Text>
                  </Flex>
                  <Box sx={{ height: "10px", bg: "border", borderRadius: "pill", overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${pct}%`, backgroundColor: f.color, borderRadius: "pill", transition: "width 0.3s ease" }} />
                  </Box>
                </Box>
              )
            })}
          </Flex>
        </Box>
      </Grid>

      <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {/* Top performers */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", mb: 5, display: "block" }}>Top Performers</Text>
          <Box as="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr">
                {["Nama", "Deals", "Revenue", "Win Rate"].map((h) => (
                  <Box as="th" key={h} sx={{ textAlign: "left", fontSize: 0, fontWeight: "bold", color: "muted", textTransform: "uppercase", letterSpacing: "0.5px", pb: 3, borderBottom: "1px solid", borderColor: "border" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {topPerformers.map((p, i) => (
                <Box as="tr" key={p.name} sx={{ bg: i % 2 === 0 ? "white" : "#FAFBFF" }}>
                  <Box as="td" sx={{ p: "12px 0", borderBottom: "1px solid", borderColor: "borderLight" }}>
                    <Flex sx={{ alignItems: "center", gap: 3 }}>
                      <Flex sx={{ width: 32, height: 32, borderRadius: "circle", bg: "primaryMid", color: "primary", alignItems: "center", justifyContent: "center", fontSize: 1, fontWeight: "bold", flexShrink: 0 }}>
                        {p.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </Flex>
                      <Text sx={{ fontWeight: "semibold", fontSize: 2, color: "text" }}>{p.name}</Text>
                    </Flex>
                  </Box>
                  <Box as="td" sx={{ p: "12px 12px 12px 0", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, fontWeight: "bold", color: "text" }}>
                    {p.deals}
                  </Box>
                  <Box as="td" sx={{ p: "12px 12px 12px 0", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, fontWeight: "extrabold", color: "primary" }}>
                    {p.revenue}
                  </Box>
                  <Box as="td" sx={{ p: "12px 0", borderBottom: "1px solid", borderColor: "borderLight" }}>
                    <Flex sx={{ alignItems: "center", gap: 2 }}>
                      <Box sx={{ flex: 1, height: "6px", bg: "border", borderRadius: "pill" }}>
                        <Box sx={{ height: "100%", width: `${p.rate}%`, bg: p.rate >= 70 ? "success" : p.rate >= 50 ? "warning" : "primary", borderRadius: "pill" }} />
                      </Box>
                      <Text sx={{ fontSize: 1, fontWeight: "semibold", color: "muted", width: 32 }}>{p.rate}%</Text>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Revenue by source */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", mb: 5, display: "block" }}>Revenue berdasarkan Sumber</Text>
          <Flex sx={{ flexDirection: "column", gap: 4 }}>
            {revenueBySource.map((s) => (
              <Box key={s.source}>
                <Flex sx={{ justifyContent: "space-between", mb: 2 }}>
                  <Text sx={{ fontSize: 2, fontWeight: "semibold", color: "text" }}>{s.source}</Text>
                  <Text sx={{ fontSize: 2, fontWeight: "bold", color: s.color }}>{s.pct}%</Text>
                </Flex>
                <Box sx={{ height: "10px", bg: "border", borderRadius: "pill", overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${s.pct}%`, backgroundColor: s.color, borderRadius: "pill", transition: "width 0.3s ease" }} />
                </Box>
              </Box>
            ))}
          </Flex>

          {/* Total summary */}
          <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 3, mt: 6, p: 4, bg: "primaryLight", borderRadius: "lg" }}>
            <Box>
              <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold", mb: 1, display: "block" }}>TOTAL REVENUE</Text>
              <Text sx={{ fontSize: 7, fontWeight: "extrabold", color: "primary" }}>Rp 4.2M</Text>
            </Box>
            <Box>
              <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold", mb: 1, display: "block" }}>AVG DEAL SIZE</Text>
              <Text sx={{ fontSize: 7, fontWeight: "extrabold", color: "success" }}>Rp 150Jt</Text>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Layout>
  )
}

export default ReportsPage

export const Head: HeadFC = () => <title>Reports | nateeCRM</title>
