import { Box, Flex, Grid, Text } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

const statCards = [
  { label: "Total Contacts", value: "1,284", change: "+12%", trend: "up", color: "#2563EB", bg: "#EFF6FF", icon: "" },
  { label: "Active Deals", value: "342", change: "+8%", trend: "up", color: "#10B981", bg: "#ECFDF5", icon: "" },
  { label: "Revenue (MTD)", value: "Rp 4.2M", change: "+23%", trend: "up", color: "#8B5CF6", bg: "#F5F3FF", icon: "" },
  { label: "Open Tasks", value: "57", change: "-5%", trend: "down", color: "#F59E0B", bg: "#FFFBEB", icon: "" },
]

const recentContacts = [
  { name: "Budi Santoso", company: "PT Maju Bersama", email: "budi@majubersama.co.id", status: "Active", date: "20 Feb 2026" },
  { name: "Siti Rahayu", company: "CV Berkah Jaya", email: "siti@berkah.id", status: "Lead", date: "19 Feb 2026" },
  { name: "Andi Wijaya", company: "PT Teknologi Nusantara", email: "andi@teknusa.com", status: "Active", date: "18 Feb 2026" },
  { name: "Dewi Kusuma", company: "Toko Makmur", email: "dewi@makmur.co.id", status: "Inactive", date: "17 Feb 2026" },
  { name: "Rudi Hermawan", company: "UD Sentosa", email: "rudi@sentosa.id", status: "Active", date: "16 Feb 2026" },
]

const pipeline = [
  { stage: "Lead", count: 128, value: "Rp 640M", color: "#2563EB" },
  { stage: "Qualified", count: 84, value: "Rp 420M", color: "#8B5CF6" },
  { stage: "Proposal", count: 52, value: "Rp 312M", color: "#F59E0B" },
  { stage: "Negotiation", count: 28, value: "Rp 196M", color: "#EF4444" },
  { stage: "Closed Won", count: 50, value: "Rp 280M", color: "#10B981" },
]

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: "#ECFDF5", color: "#10B981" },
    Lead: { bg: "#EFF6FF", color: "#2563EB" },
    Inactive: { bg: "#F1F5F9", color: "#64748B" },
  }
  const s = map[status] || map["Inactive"]
  return (
    <Box
      as="span"
      sx={{
        backgroundColor: s.bg,
        color: s.color,
        p: "2px 10px",
        borderRadius: "pill",
        fontSize: 0,
        fontWeight: "semibold",
      }}
    >
      {status}
    </Box>
  )
}

const IndexPage: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout currentPath={location.pathname} title="Dashboard">
      {/* Stat cards */}
      <Grid sx={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 5, mb: 7 }}>
        {statCards.map((card) => (
          <Box
            key={card.label}
            sx={{
              bg: "white",
              borderRadius: "xl",
              p: 6,
              border: "1px solid",
              borderColor: "border",
              boxShadow: "card",
            }}
          >
            <Flex sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}>
              <Text sx={{ fontSize: 0, fontWeight: "semibold", color: "muted", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</Text>
              <Flex
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "lg",
                  backgroundColor: card.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 6,
                }}
              >
                {card.icon}
              </Flex>
            </Flex>
            <Text sx={{ fontSize: 9, fontWeight: "extrabold", color: "text", mb: 2, display: "block" }}>{card.value}</Text>
            <Text sx={{ fontSize: 2, color: card.trend === "up" ? "success" : "danger" }}>
              {card.trend === "up" ? "▲" : "▼"} {card.change} dari bulan lalu
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Bottom two-column grid */}
      <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {/* Recent contacts */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 5 }}>
            <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text" }}>Kontak Terbaru</Text>
            <Link to="/contacts/" sx={{ fontSize: 2, color: "primary", textDecoration: "none", fontWeight: "semibold" }}>
              Lihat semua →
            </Link>
          </Flex>
          <Box as="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr">
                {["Nama", "Perusahaan", "Status", "Tanggal"].map((h) => (
                  <Box
                    as="th"
                    key={h}
                    sx={{
                      textAlign: "left",
                      fontSize: 0,
                      fontWeight: "semibold",
                      color: "muted",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      pb: 3,
                      borderBottom: "1px solid",
                      borderColor: "border",
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {recentContacts.map((c) => (
                <Box as="tr" key={c.name}>
                  <Box as="td" sx={{ p: "12px 0", borderBottom: "1px solid", borderColor: "border" }}>
                    <Text sx={{ fontWeight: "semibold", fontSize: 2, color: "text", display: "block" }}>{c.name}</Text>
                    <Text sx={{ fontSize: 0, color: "muted" }}>{c.email}</Text>
                  </Box>
                  <Box as="td" sx={{ p: "12px 12px 12px 0", borderBottom: "1px solid", borderColor: "border", fontSize: 2, color: "muted" }}>
                    {c.company}
                  </Box>
                  <Box as="td" sx={{ p: "12px 12px 12px 0", borderBottom: "1px solid", borderColor: "border" }}>
                    {statusBadge(c.status)}
                  </Box>
                  <Box as="td" sx={{ p: "12px 0", borderBottom: "1px solid", borderColor: "border", fontSize: 1, color: "muted" }}>
                    {c.date}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Pipeline deals */}
        <Box sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 5 }}>
            <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text" }}>Pipeline Deals</Text>
            <Link to="/deals/" sx={{ fontSize: 2, color: "primary", textDecoration: "none", fontWeight: "semibold" }}>
              Lihat semua →
            </Link>
          </Flex>
          <Flex sx={{ flexDirection: "column", gap: 4 }}>
            {pipeline.map((p) => {
              const maxCount = Math.max(...pipeline.map((x) => x.count))
              const pct = (p.count / maxCount) * 100
              return (
                <Box key={p.stage}>
                  <Flex sx={{ justifyContent: "space-between", mb: 2 }}>
                    <Text sx={{ fontSize: 2, fontWeight: "semibold", color: "text" }}>{p.stage}</Text>
                    <Box>
                      <Text as="span" sx={{ fontSize: 2, fontWeight: "bold", color: p.color }}>
                        {p.count}
                      </Text>
                      <Text as="span" sx={{ fontSize: 0, color: "muted", ml: 2 }}>
                        {p.value}
                      </Text>
                    </Box>
                  </Flex>
                  <Box sx={{ height: "8px", bg: "border", borderRadius: "pill", overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${pct}%`, backgroundColor: p.color, borderRadius: "pill" }} />
                  </Box>
                </Box>
              )
            })}
          </Flex>
          <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 3, mt: 6, p: 4, bg: "primaryLight", borderRadius: "lg" }}>
            <Box>
              <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold", mb: 1, display: "block" }}>TOTAL PIPELINE</Text>
              <Text sx={{ fontSize: 7, fontWeight: "extrabold", color: "primary" }}>Rp 1.85M</Text>
            </Box>
            <Box>
              <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold", mb: 1, display: "block" }}>WIN RATE</Text>
              <Text sx={{ fontSize: 7, fontWeight: "extrabold", color: "success" }}>28.4%</Text>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Dashboard | nateeCRM</title>
