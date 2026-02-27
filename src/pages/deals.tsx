import { Box, Flex, Grid, Text, Button } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import { useSettings, fetchAirtableTable } from "../hooks/useSettings"

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

function probBarColor(probability: number): string {
  if (probability >= 70) return "#10B981"
  if (probability >= 40) return "#F59E0B"
  return "#2563EB"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

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

interface AirtableDealFields {
  Title?: string
  Company?: string
  Value?: number | string
  Stage?: string
  Owner?: string
  Probability?: number
  CloseDate?: string
}

const DealsPage: React.FC<PageProps> = ({ location }) => {
  const { settings, loaded } = useSettings()
  const [view, setView] = React.useState<"kanban" | "list">("kanban")
  const [deals, setDeals] = React.useState<Deal[]>(mockDeals)
  const [apiLoading, setApiLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [dataSource, setDataSource] = React.useState<"mock" | "airtable">("mock")

  React.useEffect(() => {
    if (!loaded) return
    if (settings.platform !== "airtable" || !settings.airtable.apiKey || !settings.airtable.baseId) {
      setDeals(mockDeals)
      setDataSource("mock")
      return
    }
    setApiLoading(true)
    setApiError(null)
    fetchAirtableTable<AirtableDealFields>(settings.airtable.apiKey, settings.airtable.baseId, settings.airtable.dealsTable)
      .then((records) => {
        const validStages = new Set<Stage>(["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"])
        const mapped: Deal[] = records.map((r, i) => {
          const f = r.fields
          const valueNum = typeof f.Value === "number" ? f.Value : Number.parseFloat(String(f.Value || "0"))
          let valueFmt: string
          if (valueNum >= 1_000_000_000) {
            valueFmt = `Rp ${(valueNum / 1_000_000_000).toFixed(0)}M`
          } else if (valueNum >= 1_000_000) {
            valueFmt = `Rp ${(valueNum / 1_000_000).toFixed(0)}Jt`
          } else {
            valueFmt = `Rp ${valueNum.toLocaleString("id-ID")}`
          }
          const ownerName = f.Owner || "?"
          const ownerInitials = getInitials(ownerName)
          return {
            id: i + 1,
            title: f.Title || "(Tanpa Judul)",
            company: f.Company || "-",
            value: valueFmt,
            stage: (validStages.has(f.Stage as Stage) ? f.Stage : "Lead") as Stage,
            owner: ownerInitials,
            probability: typeof f.Probability === "number" ? f.Probability : 0,
            closeDate: f.CloseDate ? new Date(f.CloseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
          }
        })
        setDeals(mapped)
        setDataSource("airtable")
      })
      .catch((err) => {
        setApiError(err.message || "Gagal mengambil data dari Airtable.")
        setDeals(mockDeals)
        setDataSource("mock")
      })
      .finally(() => setApiLoading(false))
  }, [loaded, settings])

  const totalValueNum = deals.reduce((sum, d) => {
    const match = d.value.replaceAll(/\D/gu, "")
    return sum + Number.parseInt(match || "0", 10)
  }, 0)
  const totalValue = dataSource === "airtable" ? `Rp ${totalValueNum.toLocaleString("id-ID")}` : "Rp 1.885M"
  const totalDeals = deals.length
  const wonDeals = deals.filter((d) => d.stage === "Closed Won").length

  return (
    <Layout currentPath={location.pathname} title="Deals">
      {/* Error banner */}
      {apiError && (
        <Box sx={{ p: "12px 16px", bg: "dangerLight", border: "1px solid #FECACA", borderRadius: "md", mb: 4, fontSize: 2, color: "dangerDark" }}>
          ⚠️ {apiError} —{" "}
          <Link to="/settings/" sx={{ color: "primary", fontWeight: "semibold" }}>
            Periksa konfigurasi
          </Link>
        </Box>
      )}
      {apiLoading && <Box sx={{ p: "12px 16px", bg: "primaryLight", border: "1px solid", borderColor: "primaryMid", borderRadius: "md", mb: 4, fontSize: 2, color: "primaryDark" }}>⏳ Mengambil data dari Airtable...</Box>}
      {!apiLoading && (
        <Flex sx={{ alignItems: "center", gap: 2, mb: 4 }}>
          <Box sx={{ width: "8px", height: "8px", borderRadius: "circle", bg: dataSource === "airtable" ? "success" : "subtle" }} />
          <Text sx={{ fontSize: 1, color: "muted" }}>
            {dataSource === "airtable" ? `Data live dari Airtable · ${deals.length} deals` : "Menampilkan data demo · "}
            {dataSource === "mock" && (
              <Link to="/settings/" sx={{ color: "primary", fontWeight: "semibold" }}>
                Hubungkan Airtable →
              </Link>
            )}
          </Text>
        </Flex>
      )}

      {/* Top bar */}
      <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Flex sx={{ gap: 2 }}>
          {(["kanban", "list"] as const).map((v) => (
            <Button
              key={v}
              onClick={() => setView(v)}
              sx={{
                p: "8px 20px",
                borderRadius: "md",
                border: "1px solid",
                borderColor: view === v ? "primary" : "border",
                bg: view === v ? "primary" : "white",
                color: view === v ? "white" : "muted",
                fontSize: 2,
                fontWeight: "semibold",
                cursor: "pointer",
              }}
            >
              {v === "kanban" ? "Papan Kanban" : "Daftar"}
            </Button>
          ))}
        </Flex>
        <Button sx={{ bg: "primary", color: "white", border: "none", borderRadius: "md", p: "10px 20px", fontSize: 3, fontWeight: "semibold", cursor: "pointer" }}>+ Tambah Deal</Button>
      </Flex>

      {/* Summary cards */}
      <Grid sx={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 4, mb: 7 }}>
        {[
          { label: "Total Pipeline", value: totalValue, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Total Deals", value: String(totalDeals), color: "#8B5CF6", bg: "#F5F3FF" },
          { label: "Deals Menang", value: String(wonDeals), color: "#10B981", bg: "#ECFDF5" },
        ].map((s) => (
          <Flex key={s.label} sx={{ bg: "white", borderRadius: "lg", p: "20px 24px", border: "1px solid", borderColor: "border", alignItems: "center", gap: 4 }}>
            <Flex sx={{ width: 44, height: 44, borderRadius: "xl", backgroundColor: s.bg, alignItems: "center", justifyContent: "center" }}>
              <Text sx={{ fontSize: 4, fontWeight: "extrabold", color: s.color }}>{s.value}</Text>
            </Flex>
            <Text sx={{ fontSize: 3, fontWeight: "semibold", color: "muted" }}>{s.label}</Text>
          </Flex>
        ))}
      </Grid>

      {view === "kanban" ? (
        /* Kanban view */
        <Flex sx={{ gap: 4, overflowX: "auto", pb: 4 }}>
          {kanbanStages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage)
            const sc = stageConfig[stage]
            return (
              <Box key={stage} sx={{ minWidth: 240, width: 240, flexShrink: 0, bg: "surface", borderRadius: "xl", p: 3, border: "1px solid", borderColor: "border" }}>
                <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Text sx={{ fontSize: 2, fontWeight: "bold", color: sc.color }}>{stage}</Text>
                  <Box as="span" sx={{ backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: "pill", p: "1px 8px", fontSize: 0, fontWeight: "bold" }}>
                    {stageDeals.length}
                  </Box>
                </Flex>
                <Flex sx={{ flexDirection: "column", gap: 2 }}>
                  {stageDeals.map((deal) => {
                    const probColor = probBarColor(deal.probability)
                    return (
                      <Box key={deal.id} sx={{ bg: "white", borderRadius: "md", p: 4, border: "1px solid", borderColor: "border", boxShadow: "sm", cursor: "pointer" }}>
                        <Text sx={{ fontSize: 2, fontWeight: "bold", color: "text", display: "block", mb: 1 }}>{deal.title}</Text>
                        <Text sx={{ fontSize: 0, color: "muted", display: "block", mb: 2 }}>{deal.company}</Text>
                        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Text as="span" sx={{ fontSize: 3, fontWeight: "extrabold", color: "primary" }}>
                            {deal.value}
                          </Text>
                          <Flex sx={{ width: 26, height: 26, borderRadius: "circle", bg: "primaryMid", color: "primary", fontSize: "10px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>{deal.owner}</Flex>
                        </Flex>
                        {/* Probability bar */}
                        <Box sx={{ mt: 2 }}>
                          <Flex sx={{ justifyContent: "space-between", fontSize: "10px", color: "subtle", mb: 1 }}>
                            <span>Probabilitas</span>
                            <span>{deal.probability}%</span>
                          </Flex>
                          <Box sx={{ height: "4px", bg: "border", borderRadius: "pill" }}>
                            <Box sx={{ height: "100%", width: `${deal.probability}%`, backgroundColor: probColor, borderRadius: "pill" }} />
                          </Box>
                        </Box>
                        <Text sx={{ mt: 2, fontSize: "10px", color: "subtle", display: "block" }}>Tutup: {deal.closeDate}</Text>
                      </Box>
                    )
                  })}
                </Flex>
              </Box>
            )
          })}
        </Flex>
      ) : (
        /* List view */
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", overflow: "hidden" }}>
          <Box as="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr" sx={{ bg: "surface" }}>
                {["Deal", "Perusahaan", "Nilai", "Tahap", "Probabilitas", "Tanggal Tutup", "Owner"].map((h) => (
                  <Box as="th" key={h} sx={{ textAlign: "left", p: "14px 20px", fontSize: 0, fontWeight: "bold", color: "muted", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid", borderColor: "border" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {deals.map((deal, i) => {
                const sc = stageConfig[deal.stage]
                const probColor = probBarColor(deal.probability)
                return (
                  <Box as="tr" key={deal.id} sx={{ bg: i % 2 === 0 ? "white" : "#FAFBFF" }}>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontWeight: "bold", fontSize: 2, color: "text" }}>
                      {deal.title}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {deal.company}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 3, fontWeight: "extrabold", color: "primary" }}>
                      {deal.value}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Box as="span" sx={{ backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, p: "3px 10px", borderRadius: "pill", fontSize: 1, fontWeight: "semibold" }}>
                        {deal.stage}
                      </Box>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Flex sx={{ alignItems: "center", gap: 2 }}>
                        <Box sx={{ flex: 1, height: "6px", bg: "border", borderRadius: "pill" }}>
                          <Box sx={{ height: "100%", width: `${deal.probability}%`, backgroundColor: probColor, borderRadius: "pill" }} />
                        </Box>
                        <Text sx={{ fontSize: 1, fontWeight: "semibold", color: "muted", width: 32 }}>{deal.probability}%</Text>
                      </Flex>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {deal.closeDate}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Flex sx={{ width: 30, height: 30, borderRadius: "circle", bg: "primaryMid", color: "primary", fontSize: "11px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>{deal.owner}</Flex>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Layout>
  )
}

export default DealsPage

export const Head: HeadFC = () => <title>Deals | nateeCRM</title>
