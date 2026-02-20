import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

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

const upcomingTasks = mockActivities.filter((a) => !a.completed)
const todayActivities = mockActivities.filter((a) => a.date === "20 Feb 2026")

const ActivitiesPage: React.FC<PageProps> = ({ location }) => {
  const [activeFilter, setActiveFilter] = React.useState<"all" | Activity["type"]>("all")

  const filtered = activeFilter === "all" ? mockActivities : mockActivities.filter((a) => a.type === activeFilter)

  return (
    <Layout currentPath={location.pathname} title="Activities">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Main timeline */}
        <div>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveFilter("all")}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: activeFilter === "all" ? "#2563EB" : "#E2E8F0",
                backgroundColor: activeFilter === "all" ? "#2563EB" : "#FFFFFF",
                color: activeFilter === "all" ? "#FFFFFF" : "#64748B",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Semua
            </button>
            {(Object.entries(typeConfig) as [Activity["type"], (typeof typeConfig)[Activity["type"]]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: activeFilter === key ? cfg.color : "#E2E8F0",
                  backgroundColor: activeFilter === key ? cfg.bg : "#FFFFFF",
                  color: activeFilter === key ? cfg.color : "#64748B",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{cfg.icon}</span>
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Activity timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: 19,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: "#E2E8F0",
                zIndex: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {filtered.map((activity, i) => {
                const cfg = typeConfig[activity.type]
                return (
                  <div key={activity.id} style={{ display: "flex", gap: 16, position: "relative", zIndex: 1 }}>
                    {/* Timeline dot */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: activity.completed ? cfg.bg : "#FFFFFF",
                        border: `2px solid ${activity.completed ? cfg.color : "#E2E8F0"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Card */}
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                        borderRadius: 10,
                        padding: "16px 20px",
                        border: `1px solid ${activity.completed ? "#E2E8F0" : "#BFDBFE"}`,
                        marginBottom: 12,
                        opacity: activity.completed ? 0.85 : 1,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                              padding: "2px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {cfg.label}
                          </span>
                          {activity.completed ? (
                            <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600, backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: 20 }}>Selesai</span>
                          ) : (
                            <span style={{ fontSize: 11, color: "#F59E0B", fontWeight: 600, backgroundColor: "#FFFBEB", padding: "2px 8px", borderRadius: 20 }}>Pending</span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>
                          {activity.date} • {activity.time}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>{activity.title}</div>
                      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10, lineHeight: 1.5 }}>{activity.description}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: "#DBEAFE",
                            color: "#2563EB",
                            fontSize: 9,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {activity.contact
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{activity.contact}</span>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>—</span>
                        <span style={{ fontSize: 12, color: "#64748B" }}>{activity.company}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick add */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", margin: "0 0 14px 0" }}>Tambah Aktivitas</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(Object.entries(typeConfig) as [string, (typeof typeConfig)[Activity["type"]]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 8,
                    border: `1px solid ${cfg.color}33`,
                    backgroundColor: cfg.bg,
                    color: cfg.color,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", margin: "0 0 14px 0" }}>
              Tugas Pending
              <span style={{ marginLeft: 8, backgroundColor: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 20, fontSize: 11 }}>{upcomingTasks.length}</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingTasks.map((task) => {
                const cfg = typeConfig[task.type]
                return (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      backgroundColor: "#F8FAFC",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>
                        {task.date} • {task.time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today summary */}
          <div style={{ backgroundColor: "#1E3A8A", borderRadius: 12, padding: 20, color: "#FFFFFF" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px 0", color: "#BFDBFE" }}>Hari Ini</h3>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{todayActivities.length}</div>
            <div style={{ fontSize: 13, color: "#93C5FD", marginBottom: 16 }}>Aktivitas terjadwal</div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
              {todayActivities.map((a) => (
                <div key={a.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span>{typeConfig[a.type].icon}</span>
                  <span style={{ fontSize: 12, color: "#BFDBFE", flex: 1 }}>{a.time}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ActivitiesPage

export const Head: HeadFC = () => <title>Activities | NexusCRM</title>
