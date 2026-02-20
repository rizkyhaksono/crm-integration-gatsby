import * as React from "react"
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
  return <span style={{ backgroundColor: s.bg, color: s.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{status}</span>
}

const IndexPage: React.FC<PageProps> = ({ location }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: "24px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: "#1E293B",
    margin: "0 0 20px 0",
  }

  return (
    <Layout currentPath={location.pathname} title="Dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        {statCards.map((card) => (
          <div key={card.label} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</span>
              <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{card.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>{card.value}</div>
            <div style={{ fontSize: 13, color: card.trend === "up" ? "#10B981" : "#EF4444" }}>
              {card.trend === "up" ? "" : ""} {card.change} dari bulan lalu
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={sectionTitleStyle}>Kontak Terbaru</h2>
            <a href="/contacts/" style={{ fontSize: 13, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              Lihat semua{" "}
            </a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nama", "Perusahaan", "Status", "Tanggal"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px 0", borderBottom: "1px solid #E2E8F0" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "12px 12px 12px 0", borderBottom: "1px solid #E2E8F0", fontSize: 13, color: "#64748B" }}>{c.company}</td>
                  <td style={{ padding: "12px 12px 12px 0", borderBottom: "1px solid #E2E8F0" }}>{statusBadge(c.status)}</td>
                  <td style={{ padding: "12px 0", borderBottom: "1px solid #E2E8F0", fontSize: 12, color: "#64748B" }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={sectionTitleStyle}>Pipeline Deals</h2>
            <a href="/deals/" style={{ fontSize: 13, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              Lihat semua{" "}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pipeline.map((p) => {
              const maxCount = Math.max(...pipeline.map((x) => x.count))
              const pct = (p.count / maxCount) * 100
              return (
                <div key={p.stage}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{p.stage}</span>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.count}</span>
                      <span style={{ fontSize: 11, color: "#64748B", marginLeft: 8 }}>{p.value}</span>
                    </div>
                  </div>
                  <div style={{ height: 8, backgroundColor: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, backgroundColor: p.color, borderRadius: 99 }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24, padding: "16px", backgroundColor: "#EFF6FF", borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginBottom: 4 }}>TOTAL PIPELINE</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>Rp 1.85M</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginBottom: 4 }}>WIN RATE</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>28.4%</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Dashboard | NexusCRM</title>
