import { Box, Flex, Grid, Text, Button } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import { useSettings, fetchAirtableTable } from "../hooks/useSettings"

interface Activity {
  id: number
  type: "call" | "email" | "meeting" | "task" | "note"
  title: string
  description: string
  contact: string
  company: string
  date: string
  time: string
  completed: boolean
}

const typeConfig: Record<Activity["type"], { icon: string; bg: string; color: string; label: string }> = {
  call: { icon: "📞", bg: "#EFF6FF", color: "#2563EB", label: "Panggilan" },
  email: { icon: "✉️", bg: "#F5F3FF", color: "#8B5CF6", label: "Email" },
  meeting: { icon: "🗓️", bg: "#ECFDF5", color: "#10B981", label: "Meeting" },
  task: { icon: "✅", bg: "#FFFBEB", color: "#F59E0B", label: "Tugas" },
  note: { icon: "📝", bg: "#F0F9FF", color: "#0EA5E9", label: "Catatan" },
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: "call",
    title: "Follow-up proposal ERP",
    description: "Mendiskusikan timeline implementasi dan kebutuhan modul tambahan",
    contact: "Budi Santoso",
    company: "PT Maju Bersama",
    date: "20 Feb 2026",
    time: "10:30",
    completed: true,
  },
  {
    id: 2,
    type: "meeting",
    title: "Demo product Teknologi Nusantara",
    description: "Presentasi fitur baru dan roadmap Q2 2026",
    contact: "Andi Wijaya",
    company: "PT Teknologi Nusantara",
    date: "20 Feb 2026",
    time: "14:00",
    completed: false,
  },
  {
    id: 3,
    type: "email",
    title: "Kirim penawaran harga SaaS",
    description: "Mengirimkan proposal harga untuk paket enterprise 50 user",
    contact: "Siti Rahayu",
    company: "CV Berkah Jaya",
    date: "19 Feb 2026",
    time: "09:15",
    completed: true,
  },
  { id: 4, type: "task", title: "Update CRM data kontak", description: "Memperbarui informasi kontak dari hasil meeting minggu lalu", contact: "Nina Permata", company: "PT Global Indo", date: "19 Feb 2026", time: "16:00", completed: true },
  {
    id: 5,
    type: "note",
    title: "Catatan hasil negosiasi",
    description: "Klien meminta diskon 10% untuk kontrak 2 tahun. Perlu approval manager.",
    contact: "Rudi Hermawan",
    company: "UD Sentosa",
    date: "18 Feb 2026",
    time: "11:45",
    completed: true,
  },
  {
    id: 6,
    type: "meeting",
    title: "Kick-off project upgrade server",
    description: "Rapat awal dengan tim teknis dan manajemen klien untuk pembahasan scope",
    contact: "Dewi Kusuma",
    company: "Toko Makmur",
    date: "18 Feb 2026",
    time: "13:30",
    completed: false,
  },
  {
    id: 7,
    type: "call",
    title: "Panggilan perkenalan lead baru",
    description: "Menjelaskan solusi CRM kepada calon klien dari referral Andi",
    contact: "Rina Susanti",
    company: "PT Prima Sejahtera",
    date: "17 Feb 2026",
    time: "15:00",
    completed: true,
  },
  {
    id: 8,
    type: "task",
    title: "Persiapkan kontrak paket maintenance",
    description: "Menyiapkan dokumen kontrak dan SLA untuk CV Cahaya Abadi",
    contact: "Hendra Gunawan",
    company: "CV Cahaya Abadi",
    date: "17 Feb 2026",
    time: "17:00",
    completed: false,
  },
]

interface AirtableActivityFields {
  Title?: string
  Type?: string
  Description?: string
  Contact?: string
  Company?: string
  Date?: string
  Time?: string
  Completed?: boolean
}

const ActivitiesPage: React.FC<PageProps> = ({ location }) => {
  const { settings, loaded } = useSettings()
  const [activeFilter, setActiveFilter] = React.useState<"all" | Activity["type"]>("all")
  const [activities, setActivities] = React.useState<Activity[]>(mockActivities)
  const [apiLoading, setApiLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [dataSource, setDataSource] = React.useState<"mock" | "airtable">("mock")

  React.useEffect(() => {
    if (!loaded) return
    if (settings.platform !== "airtable" || !settings.airtable.apiKey || !settings.airtable.baseId) {
      setActivities(mockActivities)
      setDataSource("mock")
      return
    }
    setApiLoading(true)
    setApiError(null)
    fetchAirtableTable<AirtableActivityFields>(settings.airtable.apiKey, settings.airtable.baseId, settings.airtable.activitiesTable)
      .then((records) => {
        const validTypes = new Set(["call", "email", "meeting", "task", "note"])
        const mapped: Activity[] = records.map((r, i) => {
          const f = r.fields
          return {
            id: i + 1,
            type: (validTypes.has((f.Type || "").toLowerCase()) ? (f.Type || "").toLowerCase() : "task") as Activity["type"],
            title: f.Title || "(Tanpa Judul)",
            description: f.Description || "",
            contact: f.Contact || "-",
            company: f.Company || "-",
            date: f.Date ? new Date(f.Date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
            time: f.Time || "",
            completed: !!f.Completed,
          }
        })
        setActivities(mapped)
        setDataSource("airtable")
      })
      .catch((err) => {
        setApiError(err.message || "Gagal mengambil data dari Airtable.")
        setActivities(mockActivities)
        setDataSource("mock")
      })
      .finally(() => setApiLoading(false))
  }, [loaded, settings])

  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  const upcomingTasks = activities.filter((a) => !a.completed)
  const todayActivities = activities.filter((a) => a.date === today)

  const filtered = activeFilter === "all" ? activities : activities.filter((a) => a.type === activeFilter)

  return (
    <Layout currentPath={location.pathname} title="Activities">
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
            {dataSource === "airtable" ? `Data live dari Airtable · ${activities.length} aktivitas` : "Menampilkan data demo · "}
            {dataSource === "mock" && (
              <Link to="/settings/" sx={{ color: "primary", fontWeight: "semibold" }}>
                Hubungkan Airtable →
              </Link>
            )}
          </Text>
        </Flex>
      )}

      <Grid sx={{ gridTemplateColumns: "1fr 300px", gap: 6 }}>
        {/* Main timeline */}
        <Box>
          {/* Filter tabs */}
          <Flex sx={{ gap: 2, mb: 6, flexWrap: "wrap" }}>
            <Button
              onClick={() => setActiveFilter("all")}
              sx={{
                p: "7px 16px",
                borderRadius: "md",
                border: "1px solid",
                borderColor: activeFilter === "all" ? "primary" : "border",
                bg: activeFilter === "all" ? "primary" : "white",
                color: activeFilter === "all" ? "white" : "muted",
                fontSize: 2,
                fontWeight: "semibold",
                cursor: "pointer",
              }}
            >
              Semua
            </Button>
            {(Object.entries(typeConfig) as [Activity["type"], (typeof typeConfig)[Activity["type"]]][]).map(([key, cfg]) => (
              <Button
                key={key}
                onClick={() => setActiveFilter(key)}
                sx={{
                  p: "7px 16px",
                  borderRadius: "md",
                  border: "1px solid",
                  borderColor: activeFilter === key ? cfg.color : "border",
                  bg: activeFilter === key ? cfg.bg : "white",
                  color: activeFilter === key ? cfg.color : "muted",
                  fontSize: 2,
                  fontWeight: "semibold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span>{cfg.icon}</span>
                {cfg.label}
              </Button>
            ))}
          </Flex>

          {/* Activity timeline */}
          <Box sx={{ position: "relative" }}>
            {/* Vertical line */}
            <Box sx={{ position: "absolute", left: "19px", top: 0, bottom: 0, width: "2px", bg: "border", zIndex: 0 }} />
            <Flex sx={{ flexDirection: "column", gap: 1 }}>
              {filtered.map((activity) => {
                const cfg = typeConfig[activity.type]
                return (
                  <Flex key={activity.id} sx={{ gap: 4, position: "relative", zIndex: 1 }}>
                    {/* Timeline dot */}
                    <Flex
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "circle",
                        bg: activity.completed ? cfg.bg : "white",
                        border: `2px solid ${activity.completed ? cfg.color : "#E2E8F0"}`,
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 5,
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {cfg.icon}
                    </Flex>

                    {/* Card */}
                    <Box
                      sx={{
                        flex: 1,
                        bg: "white",
                        borderRadius: "lg",
                        p: "16px 20px",
                        border: "1px solid",
                        borderColor: activity.completed ? "border" : "primaryMid",
                        mb: 3,
                        opacity: activity.completed ? 0.85 : 1,
                      }}
                    >
                      <Flex sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Flex sx={{ alignItems: "center", gap: 2 }}>
                          <Box as="span" sx={{ bg: cfg.bg, color: cfg.color, p: "2px 10px", borderRadius: "pill", fontSize: 0, fontWeight: "bold" }}>
                            {cfg.label}
                          </Box>
                          {activity.completed ? (
                            <Box as="span" sx={{ fontSize: 0, color: "success", fontWeight: "semibold", bg: "successLight", p: "2px 8px", borderRadius: "pill" }}>
                              Selesai
                            </Box>
                          ) : (
                            <Box as="span" sx={{ fontSize: 0, color: "warning", fontWeight: "semibold", bg: "warningLight", p: "2px 8px", borderRadius: "pill" }}>
                              Pending
                            </Box>
                          )}
                        </Flex>
                        <Text sx={{ fontSize: 1, color: "subtle" }}>
                          {activity.date} • {activity.time}
                        </Text>
                      </Flex>
                      <Text sx={{ fontSize: 3, fontWeight: "bold", color: "text", display: "block", mb: 1 }}>{activity.title}</Text>
                      <Text sx={{ fontSize: 2, color: "muted", display: "block", mb: 2, lineHeight: "body" }}>{activity.description}</Text>
                      <Flex sx={{ alignItems: "center", gap: 2 }}>
                        <Flex sx={{ width: 24, height: 24, borderRadius: "circle", bg: "primaryMid", color: "primary", fontSize: "9px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
                          {activity.contact
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </Flex>
                        <Text as="span" sx={{ fontSize: 1, fontWeight: "semibold", color: "text" }}>
                          {activity.contact}
                        </Text>
                        <Text as="span" sx={{ fontSize: 1, color: "subtle" }}>
                          —
                        </Text>
                        <Text as="span" sx={{ fontSize: 1, color: "muted" }}>
                          {activity.company}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                )
              })}
            </Flex>
          </Box>
        </Box>

        {/* Right sidebar */}
        <Flex sx={{ flexDirection: "column", gap: 5 }}>
          {/* Quick add */}
          <Box sx={{ bg: "white", borderRadius: "xl", p: 5, border: "1px solid", borderColor: "border" }}>
            <Text as="h3" sx={{ fontSize: 3, fontWeight: "bold", color: "text", m: "0 0 14px 0" }}>
              Tambah Aktivitas
            </Text>
            <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <Button
                  key={key}
                  sx={{
                    p: "10px 8px",
                    borderRadius: "md",
                    border: "1px solid",
                    borderColor: `${cfg.color}33`,
                    bg: cfg.bg,
                    color: cfg.color,
                    fontSize: 1,
                    fontWeight: "semibold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span>{cfg.icon}</span>
                  {cfg.label}
                </Button>
              ))}
            </Grid>
          </Box>

          {/* Upcoming tasks */}
          <Box sx={{ bg: "white", borderRadius: "xl", p: 5, border: "1px solid", borderColor: "border" }}>
            <Flex as="h3" sx={{ fontSize: 3, fontWeight: "bold", color: "text", m: "0 0 14px 0", alignItems: "center", gap: 2 }}>
              Tugas Pending
              <Box as="span" sx={{ bg: "primaryLight", color: "primary", p: "2px 8px", borderRadius: "pill", fontSize: 0 }}>
                {upcomingTasks.length}
              </Box>
            </Flex>
            <Flex sx={{ flexDirection: "column", gap: 2 }}>
              {upcomingTasks.map((task) => {
                const cfg = typeConfig[task.type]
                return (
                  <Flex key={task.id} sx={{ gap: 2, p: "10px 12px", bg: "surface", borderRadius: "md", border: "1px solid", borderColor: "border" }}>
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Text sx={{ fontSize: 1, fontWeight: "bold", color: "text", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</Text>
                      <Text sx={{ fontSize: 0, color: "subtle" }}>
                        {task.date} • {task.time}
                      </Text>
                    </Box>
                  </Flex>
                )
              })}
            </Flex>
          </Box>

          {/* Today summary */}
          <Box sx={{ bg: "sidebar", borderRadius: "xl", p: 5, color: "white" }}>
            <Text as="h3" sx={{ fontSize: 3, fontWeight: "bold", m: "0 0 14px 0", color: "sidebarText" }}>
              Hari Ini
            </Text>
            <Text sx={{ fontSize: 10, fontWeight: "extrabold", display: "block", mb: 1 }}>{todayActivities.length}</Text>
            <Text sx={{ fontSize: 2, color: "#93C5FD", display: "block", mb: 4 }}>Aktivitas terjadwal</Text>
            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", pt: 4 }}>
              {todayActivities.map((a) => (
                <Flex key={a.id} sx={{ gap: 2, alignItems: "center", mb: 2 }}>
                  <span>{typeConfig[a.type].icon}</span>
                  <Text as="span" sx={{ fontSize: 1, color: "sidebarText", flex: 1 }}>
                    {a.time}
                  </Text>
                  <Text as="span" sx={{ fontSize: 1, fontWeight: "semibold", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                    {a.title}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        </Flex>
      </Grid>
    </Layout>
  )
}

export default ActivitiesPage

export const Head: HeadFC = () => <title>Activities | nateeCRM</title>
