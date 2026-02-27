import { Box, Flex, Grid, Text, Input, Button } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import { useSettings, fetchAirtableTable } from "../hooks/useSettings"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "Active" | "Lead" | "Inactive"
  lastContact: string
  avatar: string
}

const mockContacts: Contact[] = [
  { id: 1, name: "Budi Santoso", email: "budi@majubersama.co.id", phone: "+62 812-3456-7890", company: "PT Maju Bersama", position: "CEO", status: "Active", lastContact: "20 Feb 2026", avatar: "BS" },
  { id: 2, name: "Siti Rahayu", email: "siti@berkah.id", phone: "+62 821-9876-5432", company: "CV Berkah Jaya", position: "Direktur", status: "Lead", lastContact: "19 Feb 2026", avatar: "SR" },
  { id: 3, name: "Andi Wijaya", email: "andi@teknusa.com", phone: "+62 813-1111-2222", company: "PT Teknologi Nusantara", position: "CTO", status: "Active", lastContact: "18 Feb 2026", avatar: "AW" },
  { id: 4, name: "Dewi Kusuma", email: "dewi@makmur.co.id", phone: "+62 878-3333-4444", company: "Toko Makmur", position: "Manager", status: "Inactive", lastContact: "10 Feb 2026", avatar: "DK" },
  { id: 5, name: "Rudi Hermawan", email: "rudi@sentosa.id", phone: "+62 856-5555-6666", company: "UD Sentosa", position: "Owner", status: "Active", lastContact: "16 Feb 2026", avatar: "RH" },
  { id: 6, name: "Nina Permata", email: "nina@globalindo.com", phone: "+62 819-7777-8888", company: "PT Global Indo", position: "Sales Director", status: "Lead", lastContact: "15 Feb 2026", avatar: "NP" },
  { id: 7, name: "Hendra Gunawan", email: "hendra@cahaya.id", phone: "+62 811-9999-0000", company: "CV Cahaya Abadi", position: "CFO", status: "Active", lastContact: "14 Feb 2026", avatar: "HG" },
  { id: 8, name: "Rina Susanti", email: "rina@prima.co.id", phone: "+62 822-1234-5678", company: "PT Prima Sejahtera", position: "HR Manager", status: "Lead", lastContact: "12 Feb 2026", avatar: "RS" },
]

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  Active: { bg: "#ECFDF5", color: "#10B981", label: "Aktif" },
  Lead: { bg: "#EFF6FF", color: "#2563EB", label: "Lead" },
  Inactive: { bg: "#F1F5F9", color: "#64748B", label: "Tidak Aktif" },
}

interface AirtableContactFields {
  Name?: string
  Email?: string
  Phone?: string
  Company?: string
  Position?: string
  Status?: string
  LastContact?: string
}

const ContactsPage: React.FC<PageProps> = ({ location }) => {
  const { settings, loaded } = useSettings()
  const [search, setSearch] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")
  const [contacts, setContacts] = React.useState<Contact[]>(mockContacts)
  const [apiLoading, setApiLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [dataSource, setDataSource] = React.useState<"mock" | "airtable">("mock")

  React.useEffect(() => {
    if (!loaded) return
    if (settings.platform !== "airtable" || !settings.airtable.apiKey || !settings.airtable.baseId) {
      setContacts(mockContacts)
      setDataSource("mock")
      return
    }
    setApiLoading(true)
    setApiError(null)
    fetchAirtableTable<AirtableContactFields>(settings.airtable.apiKey, settings.airtable.baseId, settings.airtable.contactsTable)
      .then((records) => {
        const mapped: Contact[] = records.map((r, i) => {
          const f = r.fields
          const name = f.Name || "(Tanpa Nama)"
          const initials = getInitials(name)
          return {
            id: i + 1,
            name,
            email: f.Email || "-",
            phone: f.Phone || "-",
            company: f.Company || "-",
            position: f.Position || "-",
            status: (["Active", "Lead", "Inactive"].includes(f.Status || "") ? f.Status : "Active") as Contact["status"],
            lastContact: f.LastContact ? new Date(f.LastContact).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
            avatar: initials,
          }
        })
        setContacts(mapped)
        setDataSource("airtable")
      })
      .catch((err) => {
        setApiError(err.message || "Gagal mengambil data dari Airtable.")
        setContacts(mockContacts)
        setDataSource("mock")
      })
      .finally(() => setApiLoading(false))
  }, [loaded, settings])

  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <Layout currentPath={location.pathname} title="Contacts">
      {/* Error banner */}
      {apiError && (
        <Box sx={{ p: "12px 16px", bg: "dangerLight", border: "1px solid #FECACA", borderRadius: "md", mb: 4, fontSize: 2, color: "dangerDark", display: "flex", alignItems: "center", gap: 2 }}>
          ⚠️ {apiError} —{" "}
          <Link to="/settings/" sx={{ color: "primary", fontWeight: "semibold" }}>
            Periksa konfigurasi
          </Link>
        </Box>
      )}
      {/* Loading banner */}
      {apiLoading && (
        <Box sx={{ p: "12px 16px", bg: "primaryLight", border: "1px solid", borderColor: "primaryMid", borderRadius: "md", mb: 4, fontSize: 2, color: "primaryDark", display: "flex", alignItems: "center", gap: 2 }}>
          ⏳ Mengambil data dari Airtable...
        </Box>
      )}
      {/* Data source indicator */}
      {!apiLoading && (
        <Flex sx={{ alignItems: "center", gap: 2, mb: 4 }}>
          <Box sx={{ width: "8px", height: "8px", borderRadius: "circle", bg: dataSource === "airtable" ? "success" : "subtle" }} />
          <Text sx={{ fontSize: 1, color: "muted" }}>
            {dataSource === "airtable" ? `Data live dari Airtable · ${contacts.length} kontak` : "Menampilkan data demo · "}
            {dataSource === "mock" && (
              <Link to="/settings/" sx={{ color: "primary", fontWeight: "semibold" }}>
                Hubungkan Airtable →
              </Link>
            )}
          </Text>
        </Flex>
      )}

      {/* Header bar */}
      <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Flex sx={{ gap: 3, alignItems: "center" }}>
          <Input
            placeholder="Cari kontak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ border: "1px solid", borderColor: "border", borderRadius: "md", p: "8px 16px", fontSize: 3, color: "text", width: 260, bg: "white" }}
          />
          <Flex sx={{ gap: 2 }}>
            {["All", "Active", "Lead", "Inactive"].map((s) => (
              <Button
                key={s}
                onClick={() => setFilterStatus(s)}
                sx={{
                  p: "8px 16px",
                  borderRadius: "md",
                  border: "1px solid",
                  borderColor: filterStatus === s ? "primary" : "border",
                  bg: filterStatus === s ? "primaryLight" : "white",
                  color: filterStatus === s ? "primary" : "muted",
                  fontSize: 2,
                  fontWeight: "semibold",
                  cursor: "pointer",
                }}
              >
                {s === "All" ? "Semua" : statusConfig[s]?.label || s}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Button
          sx={{
            bg: "primary",
            color: "white",
            border: "none",
            borderRadius: "md",
            p: "10px 20px",
            fontSize: 3,
            fontWeight: "semibold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          + Tambah Kontak
        </Button>
      </Flex>

      {/* Stats row */}
      <Grid sx={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 4, mb: 6 }}>
        {[
          { label: "Total Kontak", value: contacts.length, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Kontak Aktif", value: contacts.filter((c) => c.status === "Active").length, color: "#10B981", bg: "#ECFDF5" },
          { label: "Lead Baru", value: contacts.filter((c) => c.status === "Lead").length, color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((stat) => (
          <Flex key={stat.label} sx={{ bg: "white", borderRadius: "lg", p: "20px 24px", border: "1px solid", borderColor: "border", alignItems: "center", gap: 4 }}>
            <Flex sx={{ width: 44, height: 44, borderRadius: "xl", backgroundColor: stat.bg, alignItems: "center", justifyContent: "center" }}>
              <Text sx={{ fontSize: 5, fontWeight: "extrabold", color: stat.color }}>{stat.value}</Text>
            </Flex>
            <Text sx={{ fontSize: 3, fontWeight: "semibold", color: "muted" }}>{stat.label}</Text>
          </Flex>
        ))}
      </Grid>

      {/* Table */}
      <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box as="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box as="thead">
              <Box as="tr" sx={{ bg: "surface" }}>
                {["Kontak", "Perusahaan", "No. Telepon", "Status", "Kontak Terakhir", "Aksi"].map((h) => (
                  <Box
                    as="th"
                    key={h}
                    sx={{
                      textAlign: "left",
                      p: "14px 20px",
                      fontSize: 0,
                      fontWeight: "bold",
                      color: "muted",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
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
              {filtered.map((contact, i) => {
                const sc = statusConfig[contact.status]
                return (
                  <Box as="tr" key={contact.id} sx={{ bg: i % 2 === 0 ? "white" : "#FAFBFF" }}>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Flex sx={{ alignItems: "center", gap: 3 }}>
                        <Flex
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "circle",
                            bg: "primaryMid",
                            color: "primary",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 2,
                            fontWeight: "bold",
                            flexShrink: 0,
                          }}
                        >
                          {contact.avatar}
                        </Flex>
                        <Box>
                          <Text sx={{ fontWeight: "bold", fontSize: 3, color: "text", display: "block" }}>{contact.name}</Text>
                          <Text sx={{ fontSize: 1, color: "muted" }}>{contact.email}</Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Text sx={{ fontSize: 2, fontWeight: "semibold", color: "text", display: "block" }}>{contact.company}</Text>
                      <Text sx={{ fontSize: 1, color: "muted" }}>{contact.position}</Text>
                    </Box>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {contact.phone}
                    </Box>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Box as="span" sx={{ backgroundColor: sc.bg, color: sc.color, p: "3px 12px", borderRadius: "pill", fontSize: 1, fontWeight: "semibold" }}>
                        {sc.label}
                      </Box>
                    </Box>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight", fontSize: 2, color: "muted" }}>
                      {contact.lastContact}
                    </Box>
                    <Box as="td" sx={{ p: "16px 20px", borderBottom: "1px solid", borderColor: "borderLight" }}>
                      <Flex sx={{ gap: 2 }}>
                        <Button sx={{ p: "6px 12px", fontSize: 1, borderRadius: "sm", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", cursor: "pointer", fontWeight: "semibold" }}>Edit</Button>
                        <Button sx={{ p: "6px 12px", fontSize: 1, borderRadius: "sm", border: "1px solid", borderColor: "#FEE2E2", bg: "dangerLight", color: "danger", cursor: "pointer", fontWeight: "semibold" }}>Hapus</Button>
                      </Flex>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
          {filtered.length === 0 && <Box sx={{ textAlign: "center", p: "48px 0", color: "subtle", fontSize: 3 }}>Tidak ada kontak yang ditemukan.</Box>}
        </Box>
      </Box>
    </Layout>
  )
}

export default ContactsPage

export const Head: HeadFC = () => <title>Contacts | nateeCRM</title>
