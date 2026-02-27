import { Box, Flex, Grid, Text, Input, Button, Label } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import { useSettings } from "../hooks/useSettings"

const SettingsPage: React.FC<PageProps> = ({ location }) => {
  const { settings } = useSettings()
  const [profile, setProfile] = React.useState({ name: "Admin User", email: "admin@nateecrm.com", phone: "+62 812-0000-0000", role: "Administrator" })
  const [notifications, setNotifications] = React.useState({ emailNotif: true, dealAlerts: true, taskReminders: true, weeklyReport: false })
  const [profileSaved, setProfileSaved] = React.useState(false)

  const handleProfileSave = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const isConnected = settings.platform !== "none"

  const inputSx = { border: "1px solid", borderColor: "border", borderRadius: "md", p: "10px 14px", fontSize: 3, color: "text", width: "100%", bg: "white", boxSizing: "border-box" as const, fontFamily: "body" }
  const labelSx = { fontSize: 2, fontWeight: "semibold", color: "#374151", mb: 2, display: "block" }

  return (
    <Layout currentPath={location.pathname} title="Settings">
      <Box sx={{ maxWidth: 760 }}>
        {/* Integration status banner */}
        <Flex
          sx={{
            p: "14px 20px",
            borderRadius: "lg",
            mb: 7,
            alignItems: "center",
            gap: 3,
            bg: isConnected ? "successLight" : "surface",
            border: "1px solid",
            borderColor: isConnected ? "#A7F3D0" : "border",
          }}
        >
          <Box sx={{ width: "10px", height: "10px", borderRadius: "circle", bg: isConnected ? "success" : "subtle", flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Text as="span" sx={{ fontSize: 3, fontWeight: "bold", color: isConnected ? "successDark" : "muted" }}>
              {isConnected ? `Terhubung ke ${settings.platform}` : "Belum ada integrasi aktif"}
            </Text>
          </Box>
          <Link to="/integrations/" style={{ textDecoration: "none" }}>
            <Button sx={{ p: "6px 14px", borderRadius: "sm", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", fontSize: 2, fontWeight: "semibold", cursor: "pointer" }}>
              {isConnected ? "Kelola Integrasi" : "Hubungkan Platform"}
            </Button>
          </Link>
        </Flex>

        {/* Profile card */}
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
              Profil
            </Text>
            <Text sx={{ fontSize: 2, color: "muted", mt: 1, display: "block" }}>Informasi akun dan data personal</Text>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Flex sx={{ alignItems: "center", gap: 5, mb: 2 }}>
                <Flex sx={{ width: 64, height: 64, borderRadius: "circle", bg: "primary", color: "white", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 7, flexShrink: 0 }}>
                  {profile.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </Flex>
                <Box>
                  <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", display: "block" }}>{profile.name}</Text>
                  <Text sx={{ fontSize: 2, color: "muted" }}>{profile.role}</Text>
                </Box>
              </Flex>

              <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <Box>
                  <Label sx={labelSx}>Nama Lengkap</Label>
                  <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} sx={inputSx} />
                </Box>
                <Box>
                  <Label sx={labelSx}>Email</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} sx={inputSx} />
                </Box>
              </Grid>

              <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <Box>
                  <Label sx={labelSx}>No. Telepon</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} sx={inputSx} />
                </Box>
                <Box>
                  <Label sx={labelSx}>Role</Label>
                  <Input value={profile.role} disabled sx={{ ...inputSx, bg: "surface", color: "muted" }} />
                </Box>
              </Grid>

              <Button onClick={handleProfileSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {profileSaved ? "✓ Tersimpan!" : "Simpan Profil"}
              </Button>
            </Grid>
          </Box>
        </Box>

        {/* Notifications card */}
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
              Notifikasi
            </Text>
            <Text sx={{ fontSize: 2, color: "muted", mt: 1, display: "block" }}>Atur preferensi notifikasi</Text>
          </Box>
          <Box sx={{ p: 6 }}>
            <Flex sx={{ flexDirection: "column", gap: 4 }}>
              {[
                { key: "emailNotif" as const, label: "Notifikasi Email", desc: "Terima notifikasi via email untuk update penting" },
                { key: "dealAlerts" as const, label: "Alert Deal", desc: "Notifikasi ketika deal berubah status atau mendekati closing date" },
                { key: "taskReminders" as const, label: "Pengingat Tugas", desc: "Ingatkan tugas yang mendekati deadline" },
                { key: "weeklyReport" as const, label: "Laporan Mingguan", desc: "Terima ringkasan performa mingguan via email" },
              ].map(({ key, label, desc }) => (
                <Flex key={key} sx={{ justifyContent: "space-between", alignItems: "center", p: "14px 20px", bg: "surface", borderRadius: "lg", border: "1px solid", borderColor: "border" }}>
                  <Box>
                    <Text sx={{ fontSize: 3, fontWeight: "semibold", color: "text", display: "block" }}>{label}</Text>
                    <Text sx={{ fontSize: 1, color: "muted" }}>{desc}</Text>
                  </Box>
                  <Box
                    as="button"
                    onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                    sx={{
                      width: 48,
                      height: 26,
                      borderRadius: "pill",
                      bg: notifications[key] ? "primary" : "border",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background-color 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "circle",
                        bg: "white",
                        position: "absolute",
                        top: "3px",
                        left: notifications[key] ? "25px" : "3px",
                        transition: "left 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Data management card */}
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card" }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
              Manajemen Data
            </Text>
            <Text sx={{ fontSize: 2, color: "muted", mt: 1, display: "block" }}>Export, import, dan kelola data CRM</Text>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <Flex sx={{ p: 5, border: "1px solid", borderColor: "border", borderRadius: "lg", flexDirection: "column", gap: 3 }}>
                <Flex sx={{ alignItems: "center", gap: 2 }}>
                  <Text sx={{ fontSize: 5 }}>📤</Text>
                  <Text sx={{ fontSize: 3, fontWeight: "bold", color: "text" }}>Export Data</Text>
                </Flex>
                <Text sx={{ fontSize: 2, color: "muted", lineHeight: "body" }}>Export semua data CRM ke format CSV atau JSON</Text>
                <Flex sx={{ gap: 2 }}>
                  <Button sx={{ p: "8px 16px", borderRadius: "md", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", fontSize: 2, fontWeight: "semibold", cursor: "pointer" }}>Export CSV</Button>
                  <Button sx={{ p: "8px 16px", borderRadius: "md", border: "1px solid", borderColor: "border", bg: "white", color: "muted", fontSize: 2, fontWeight: "semibold", cursor: "pointer" }}>Export JSON</Button>
                </Flex>
              </Flex>
              <Flex sx={{ p: 5, border: "1px solid", borderColor: "border", borderRadius: "lg", flexDirection: "column", gap: 3 }}>
                <Flex sx={{ alignItems: "center", gap: 2 }}>
                  <Text sx={{ fontSize: 5 }}>📥</Text>
                  <Text sx={{ fontSize: 3, fontWeight: "bold", color: "text" }}>Import Data</Text>
                </Flex>
                <Text sx={{ fontSize: 2, color: "muted", lineHeight: "body" }}>Import data dari CSV atau dari platform CRM lain</Text>
                <Button sx={{ p: "8px 16px", borderRadius: "md", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", fontSize: 2, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                  Import CSV
                </Button>
              </Flex>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default SettingsPage

export const Head: HeadFC = () => <title>Settings | nateeCRM</title>
