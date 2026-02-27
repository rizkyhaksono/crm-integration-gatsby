import { Box, Flex, Grid, Text, Button, Input } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

interface Task {
  id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "high" | "medium" | "low"
  assignee: string
  dueDate: string
  contact: string
  deal: string
}

const priorityConfig: Record<Task["priority"], { bg: string; color: string; border: string; label: string }> = {
  high: { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA", label: "Tinggi" },
  medium: { bg: "#FFFBEB", color: "#F59E0B", border: "#FDE68A", label: "Sedang" },
  low: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", label: "Rendah" },
}

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
}

const statusColors: Record<Task["status"], { headerBg: string; headerColor: string }> = {
  todo: { headerBg: "#EFF6FF", headerColor: "#2563EB" },
  in_progress: { headerBg: "#FFFBEB", headerColor: "#F59E0B" },
  done: { headerBg: "#ECFDF5", headerColor: "#10B981" },
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Follow-up proposal ERP ke PT Maju Bersama",
    description: "Kirim revised proposal dengan timeline baru",
    status: "todo",
    priority: "high",
    assignee: "BS",
    dueDate: "28 Feb 2026",
    contact: "Budi Santoso",
    deal: "Implementasi ERP",
  },
  { id: 2, title: "Siapkan materi demo untuk CV Berkah Jaya", description: "Buat slide deck dan demo environment", status: "todo", priority: "medium", assignee: "SR", dueDate: "01 Mar 2026", contact: "Siti Rahayu", deal: "Langganan SaaS" },
  { id: 3, title: "Update pricing sheet Q2 2026", description: "Revisi harga paket enterprise dan tambah tier baru", status: "todo", priority: "low", assignee: "AW", dueDate: "05 Mar 2026", contact: "-", deal: "-" },
  { id: 4, title: "Kirim kontrak ke UD Sentosa", description: "Kontrak paket maintenance 1 tahun", status: "in_progress", priority: "high", assignee: "RH", dueDate: "26 Feb 2026", contact: "Rudi Hermawan", deal: "Lisensi Enterprise" },
  {
    id: 5,
    title: "Setup integration testing environment",
    description: "Siapkan staging server untuk test API integration",
    status: "in_progress",
    priority: "medium",
    assignee: "AW",
    dueDate: "02 Mar 2026",
    contact: "Andi Wijaya",
    deal: "Integrasi API",
  },
  {
    id: 6,
    title: "Review SLA dokumen CV Cahaya Abadi",
    description: "Periksa terms & conditions dan coverage",
    status: "in_progress",
    priority: "low",
    assignee: "HG",
    dueDate: "28 Feb 2026",
    contact: "Hendra Gunawan",
    deal: "Paket Maintenance",
  },
  {
    id: 7,
    title: "Closing call dengan PT Global Indo",
    description: "Final negotiation untuk proyek digitalisasi",
    status: "done",
    priority: "high",
    assignee: "NP",
    dueDate: "20 Feb 2026",
    contact: "Nina Permata",
    deal: "Proyek Digitalisasi",
  },
  { id: 8, title: "Onboarding klien baru PT Prima Sejahtera", description: "Setup akun dan training admin", status: "done", priority: "medium", assignee: "RS", dueDate: "18 Feb 2026", contact: "Rina Susanti", deal: "Konsultasi IT" },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TasksPage: React.FC<PageProps> = ({ location }) => {
  const [view, setView] = React.useState<"kanban" | "list">("kanban")
  const [tasks] = React.useState<Task[]>(mockTasks)

  const columns: Task["status"][] = ["todo", "in_progress", "done"]

  return (
    <Layout currentPath={location.pathname} title="Tasks">
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
        <Button sx={{ bg: "primary", color: "white", border: "none", borderRadius: "md", p: "10px 20px", fontSize: 3, fontWeight: "semibold", cursor: "pointer" }}>+ Tambah Tugas</Button>
      </Flex>

      {/* Stats */}
      <Grid sx={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 4, mb: 7 }}>
        {[
          { label: "Total Tugas", value: tasks.length, color: "#2563EB", bg: "#EFF6FF" },
          { label: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#8B5CF6", bg: "#F5F3FF" },
          { label: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Selesai", value: tasks.filter((t) => t.status === "done").length, color: "#10B981", bg: "#ECFDF5" },
        ].map((s) => (
          <Flex key={s.label} sx={{ bg: "white", borderRadius: "lg", p: "20px 24px", border: "1px solid", borderColor: "border", alignItems: "center", gap: 4 }}>
            <Flex sx={{ width: 44, height: 44, borderRadius: "xl", backgroundColor: s.bg, alignItems: "center", justifyContent: "center" }}>
              <Text sx={{ fontSize: 5, fontWeight: "extrabold", color: s.color }}>{s.value}</Text>
            </Flex>
            <Text sx={{ fontSize: 3, fontWeight: "semibold", color: "muted" }}>{s.label}</Text>
          </Flex>
        ))}
      </Grid>

      {view === "kanban" ? (
        /* Kanban view */
        <Grid sx={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
          {columns.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status)
            const sc = statusColors[status]
            return (
              <Box key={status} sx={{ bg: "surface", borderRadius: "xl", p: 4, border: "1px solid", borderColor: "border" }}>
                <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 4, p: "10px 14px", bg: sc.headerBg, borderRadius: "md" }}>
                  <Text sx={{ fontSize: 3, fontWeight: "bold", color: sc.headerColor }}>{statusLabels[status]}</Text>
                  <Box as="span" sx={{ bg: "white", color: sc.headerColor, p: "2px 10px", borderRadius: "pill", fontSize: 1, fontWeight: "bold", border: "1px solid", borderColor: sc.headerColor + "40" }}>
                    {columnTasks.length}
                  </Box>
                </Flex>
                <Flex sx={{ flexDirection: "column", gap: 3 }}>
                  {columnTasks.map((task) => {
                    const pc = priorityConfig[task.priority]
                    return (
                      <Box key={task.id} sx={{ bg: "white", borderRadius: "lg", p: 5, border: "1px solid", borderColor: "border", boxShadow: "sm", cursor: "pointer" }}>
                        <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                          <Box as="span" sx={{ bg: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, p: "2px 10px", borderRadius: "pill", fontSize: 0, fontWeight: "bold" }}>
                            {pc.label}
                          </Box>
                          <Flex sx={{ width: 28, height: 28, borderRadius: "circle", bg: "primaryMid", color: "primary", fontSize: "10px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>{task.assignee}</Flex>
                        </Flex>
                        <Text sx={{ fontSize: 3, fontWeight: "bold", color: "text", display: "block", mb: 2 }}>{task.title}</Text>
                        <Text sx={{ fontSize: 1, color: "muted", display: "block", mb: 3, lineHeight: "body" }}>{task.description}</Text>
                        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Text sx={{ fontSize: 0, color: "subtle" }}>📅 {task.dueDate}</Text>
                          {task.contact !== "-" && <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold" }}>👤 {task.contact}</Text>}
                        </Flex>
                        {task.deal !== "-" && <Text sx={{ fontSize: 0, color: "primary", mt: 2, display: "block", fontWeight: "semibold" }}>💼 {task.deal}</Text>}
                      </Box>
                    )
                  })}
                </Flex>
              </Box>
            )
          })}
        </Grid>
      ) : (
        /* List view */
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", overflow: "hidden" }}>
          <Box as="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr" sx={{ bg: "surface" }}>
                {["Tugas", "Status", "Prioritas", "Assignee", "Deadline", "Kontak", "Deal"].map((h) => (
                  <Box as="th" key={h} sx={{ textAlign: "left", p: "14px 20px", fontSize: 0, fontWeight: "bold", color: "muted", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid", borderColor: "border" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {tasks.map((task, i) => {
                const pc = priorityConfig[task.priority]
                const sc = statusColors[task.status]
                return (
                  <Box as="tr" key={task.id} sx={{ bg: i % 2 === 0 ? "white" : "#FAFBFF" }}>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Text sx={{ fontWeight: "bold", fontSize: 2, color: "text", display: "block" }}>{task.title}</Text>
                      <Text sx={{ fontSize: 1, color: "muted" }}>{task.description}</Text>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Box as="span" sx={{ bg: sc.headerBg, color: sc.headerColor, p: "3px 10px", borderRadius: "pill", fontSize: 1, fontWeight: "semibold" }}>
                        {statusLabels[task.status]}
                      </Box>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Box as="span" sx={{ bg: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, p: "3px 10px", borderRadius: "pill", fontSize: 1, fontWeight: "semibold" }}>
                        {pc.label}
                      </Box>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Flex sx={{ width: 30, height: 30, borderRadius: "circle", bg: "primaryMid", color: "primary", fontSize: "11px", fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>{task.assignee}</Flex>
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {task.dueDate}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {task.contact}
                    </Box>
                    <Box as="td" sx={{ p: "14px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "primary", fontWeight: "semibold" }}>
                      {task.deal}
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

export default TasksPage

export const Head: HeadFC = () => <title>Tasks | nateeCRM</title>
