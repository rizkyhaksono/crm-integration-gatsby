import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

interface Deal {
  id: number
  title: string
  company: string
  value: string
  stage: Stage
  owner: string
  probability: number
  closeDate: string
}

type Stage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"

const stageConfig: Record<Stage, { bg: string; color: string; border: string }> = {
  Lead: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  Qualified: { bg: "#F5F3FF", color: "#8B5CF6", border: "#DDD6FE" },
  Proposal: { bg: "#FFFBEB", color: "#F59E0B", border: "#FDE68A" },
  Negotiation: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" },
  "Closed Won": { bg: "#ECFDF5", color: "#10B981", border: "#A7F3D0" },
  "Closed Lost": { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
}

const kanbanStages: Stage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"]

const mockDeals: Deal[] = [
  { id: 1, title: "Implementasi ERP", company: "PT Maju Bersama", value: "Rp 450M", stage: "Negotiation", owner: "BS", probability: 75, closeDate: "28 Feb 2026" },
  { id: 2, title: "Langganan SaaS Tahunan", company: "CV Berkah Jaya", value: "Rp 120M", stage: "Proposal", owner: "SR", probability: 55, closeDate: "15 Mar 2026" },
  { id: 3, title: "Integrasi API", company: "PT Teknologi Nusantara", value: "Rp 85M", stage: "Qualified", owner: "AW", probability: 40, closeDate: "30 Mar 2026" },
  { id: 4, title: "Lisensi Enterprise", company: "UD Sentosa", value: "Rp 200M", stage: "Lead", owner: "RH", probability: 20, closeDate: "30 Apr 2026" },
  { id: 5, title: "Proyek Digitalisasi", company: "PT Global Indo", value: "Rp 750M", stage: "Proposal", owner: "NP", probability: 60, closeDate: "20 Mar 2026" },
  { id: 6, title: "Paket Maintenance", company: "CV Cahaya Abadi", value: "Rp 65M", stage: "Closed Won", owner: "HG", probability: 100, closeDate: "10 Feb 2026" },
  { id: 7, title: "Konsultasi IT", company: "PT Prima Sejahtera", value: "Rp 35M", stage: "Lead", owner: "RS", probability: 15, closeDate: "15 Apr 2026" },
  { id: 8, title: "Upgrade Server", company: "Toko Makmur", value: "Rp 180M", stage: "Negotiation", owner: "DK", probability: 80, closeDate: "05 Mar 2026" },
]

const DealsPage: React.FC<PageProps> = ({ location }) => {
  const [view, setView] = React.useState<"kanban" | "list">("kanban")

  const totalValue = "Rp 1.885M"
  const totalDeals = mockDeals.length
  const wonDeals = mockDeals.filter((d) => d.stage === "Closed Won").length

  return (
    <Layout currentPath={location.pathname} title="Deals">
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["kanban", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: view === v ? "#2563EB" : "#E2E8F0",
                backgroundColor: view === v ? "#2563EB" : "#FFFFFF",
                color: view === v ? "#FFFFFF" : "#64748B",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {v === "kanban" ? "Papan Kanban" : "Daftar"}
            </button>
          ))}
        </div>
        <button
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Tambah Deal
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Pipeline", value: totalValue, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Total Deals", value: String(totalDeals), color: "#8B5CF6", bg: "#F5F3FF" },
          { label: "Deals Menang", value: String(wonDeals), color: "#10B981", bg: "#ECFDF5" },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "#FFFFFF", borderRadius: 10, padding: "20px 24px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {view === "kanban" ? (
        /* Kanban view */
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
          {kanbanStages.map((stage) => {
            const stageDeals = mockDeals.filter((d) => d.stage === stage)
            const sc = stageConfig[stage]
            return (
              <div
                key={stage}
                style={{
                  minWidth: 240,
                  width: 240,
                  flexShrink: 0,
                  backgroundColor: "#F8FAFC",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: sc.color }}>{stage}</span>
                  <span
                    style={{
                      backgroundColor: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                      borderRadius: 20,
                      padding: "1px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {stageDeals.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 8,
                        padding: "14px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>{deal.title}</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>{deal.company}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#2563EB" }}>{deal.value}</span>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            backgroundColor: "#DBEAFE",
                            color: "#2563EB",
                            fontSize: 10,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {deal.owner}
                        </div>
                      </div>
                      {/* Probability bar */}
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", marginBottom: 4 }}>
                          <span>Probabilitas</span>
                          <span>{deal.probability}%</span>
                        </div>
                        <div style={{ height: 4, backgroundColor: "#E2E8F0", borderRadius: 99 }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${deal.probability}%`,
                              backgroundColor: deal.probability >= 70 ? "#10B981" : deal.probability >= 40 ? "#F59E0B" : "#2563EB",
                              borderRadius: 99,
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: "#94A3B8" }}>Tutup: {deal.closeDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List view */
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["Deal", "Perusahaan", "Nilai", "Tahap", "Probabilitas", "Tanggal Tutup", "Owner"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockDeals.map((deal, i) => {
                const sc = stageConfig[deal.stage]
                return (
                  <tr key={deal.id} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFBFF" }}>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, fontSize: 13, color: "#1E293B" }}>{deal.title}</td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#64748B" }}>{deal.company}</td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", fontSize: 14, fontWeight: 800, color: "#2563EB" }}>{deal.value}</td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{deal.stage}</span>
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, backgroundColor: "#E2E8F0", borderRadius: 99 }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${deal.probability}%`,
                              backgroundColor: deal.probability >= 70 ? "#10B981" : deal.probability >= 40 ? "#F59E0B" : "#2563EB",
                              borderRadius: 99,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B", width: 32 }}>{deal.probability}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#64748B" }}>{deal.closeDate}</td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#DBEAFE", color: "#2563EB", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {deal.owner}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

export default DealsPage

export const Head: HeadFC = () => <title>Deals | NexusCRM</title>
