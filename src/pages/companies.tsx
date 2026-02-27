import { Box, Flex, Grid, Text, Input, Button } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

interface Company {
  id: number
  name: string
  industry: string
  website: string
  phone: string
  address: string
  contactCount: number
  dealCount: number
  revenue: string
  status: "Active" | "Prospect" | "Inactive"
  createdAt: string
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  Active: { bg: "#ECFDF5", color: "#10B981", label: "Aktif" },
  Prospect: { bg: "#EFF6FF", color: "#2563EB", label: "Prospek" },
  Inactive: { bg: "#F1F5F9", color: "#64748B", label: "Tidak Aktif" },
}

const mockCompanies: Company[] = [
  { id: 1, name: "PT Maju Bersama", industry: "Manufaktur", website: "majubersama.co.id", phone: "+62 21-555-0001", address: "Jakarta Selatan", contactCount: 5, dealCount: 3, revenue: "Rp 1.2M", status: "Active", createdAt: "10 Jan 2026" },
  { id: 2, name: "CV Berkah Jaya", industry: "Retail", website: "berkah.id", phone: "+62 21-555-0002", address: "Bandung", contactCount: 3, dealCount: 2, revenue: "Rp 450Jt", status: "Active", createdAt: "15 Jan 2026" },
  { id: 3, name: "PT Teknologi Nusantara", industry: "Teknologi", website: "teknusa.com", phone: "+62 21-555-0003", address: "Jakarta Pusat", contactCount: 8, dealCount: 4, revenue: "Rp 2.1M", status: "Active", createdAt: "05 Des 2025" },
  { id: 4, name: "Toko Makmur", industry: "Retail", website: "makmur.co.id", phone: "+62 21-555-0004", address: "Surabaya", contactCount: 2, dealCount: 1, revenue: "Rp 180Jt", status: "Inactive", createdAt: "20 Nov 2025" },
  { id: 5, name: "UD Sentosa", industry: "Distribusi", website: "sentosa.id", phone: "+62 21-555-0005", address: "Semarang", contactCount: 4, dealCount: 2, revenue: "Rp 650Jt", status: "Active", createdAt: "01 Feb 2026" },
  { id: 6, name: "PT Global Indo", industry: "Konsultan", website: "globalindo.com", phone: "+62 21-555-0006", address: "Jakarta Barat", contactCount: 6, dealCount: 3, revenue: "Rp 1.8M", status: "Prospect", createdAt: "12 Feb 2026" },
  { id: 7, name: "CV Cahaya Abadi", industry: "Manufaktur", website: "cahaya.id", phone: "+62 21-555-0007", address: "Yogyakarta", contactCount: 3, dealCount: 1, revenue: "Rp 320Jt", status: "Active", createdAt: "28 Jan 2026" },
  { id: 8, name: "PT Prima Sejahtera", industry: "Jasa", website: "prima.co.id", phone: "+62 21-555-0008", address: "Medan", contactCount: 4, dealCount: 2, revenue: "Rp 580Jt", status: "Prospect", createdAt: "18 Feb 2026" },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CompaniesPage: React.FC<PageProps> = ({ location }) => {
  const [search, setSearch] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")

  const filtered = mockCompanies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <Layout currentPath={location.pathname} title="Companies">
      {/* Header bar */}
      <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 6 }}>
        <Flex sx={{ gap: 3, alignItems: "center" }}>
          <Input
            placeholder="Cari perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ border: "1px solid", borderColor: "border", borderRadius: "md", p: "8px 16px", fontSize: 3, color: "text", width: 260, bg: "white" }}
          />
          <Flex sx={{ gap: 2 }}>
            {["All", "Active", "Prospect", "Inactive"].map((s) => (
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
        <Button sx={{ bg: "primary", color: "white", border: "none", borderRadius: "md", p: "10px 20px", fontSize: 3, fontWeight: "semibold", cursor: "pointer" }}>+ Tambah Perusahaan</Button>
      </Flex>

      {/* Stats */}
      <Grid sx={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 4, mb: 6 }}>
        {[
          { label: "Total Perusahaan", value: mockCompanies.length, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Perusahaan Aktif", value: mockCompanies.filter((c) => c.status === "Active").length, color: "#10B981", bg: "#ECFDF5" },
          { label: "Prospek", value: mockCompanies.filter((c) => c.status === "Prospect").length, color: "#8B5CF6", bg: "#F5F3FF" },
          { label: "Total Kontak", value: mockCompanies.reduce((s, c) => s + c.contactCount, 0), color: "#F59E0B", bg: "#FFFBEB" },
        ].map((stat) => (
          <Flex key={stat.label} sx={{ bg: "white", borderRadius: "lg", p: "20px 24px", border: "1px solid", borderColor: "border", alignItems: "center", gap: 4 }}>
            <Flex sx={{ width: 44, height: 44, borderRadius: "xl", backgroundColor: stat.bg, alignItems: "center", justifyContent: "center" }}>
              <Text sx={{ fontSize: 5, fontWeight: "extrabold", color: stat.color }}>{stat.value}</Text>
            </Flex>
            <Text sx={{ fontSize: 3, fontWeight: "semibold", color: "muted" }}>{stat.label}</Text>
          </Flex>
        ))}
      </Grid>

      {/* Company cards grid */}
      <Grid sx={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
        {filtered.map((company) => {
          const sc = statusConfig[company.status]
          return (
            <Box key={company.id} sx={{ bg: "white", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "border", boxShadow: "card" }}>
              <Flex sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <Flex sx={{ alignItems: "center", gap: 3 }}>
                  <Flex sx={{ width: 44, height: 44, borderRadius: "lg", bg: "primaryMid", color: "primary", alignItems: "center", justifyContent: "center", fontSize: 5, fontWeight: "bold", flexShrink: 0 }}>{company.name.charAt(0)}</Flex>
                  <Box>
                    <Text sx={{ fontSize: 4, fontWeight: "bold", color: "text", display: "block" }}>{company.name}</Text>
                    <Text sx={{ fontSize: 1, color: "muted" }}>
                      {company.industry} · {company.address}
                    </Text>
                  </Box>
                </Flex>
                <Box as="span" sx={{ backgroundColor: sc.bg, color: sc.color, p: "3px 12px", borderRadius: "pill", fontSize: 1, fontWeight: "semibold" }}>
                  {sc.label}
                </Box>
              </Flex>

              <Grid sx={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 3, mb: 4 }}>
                <Box sx={{ bg: "surface", borderRadius: "md", p: 3, textAlign: "center" }}>
                  <Text sx={{ fontSize: 5, fontWeight: "extrabold", color: "primary", display: "block" }}>{company.contactCount}</Text>
                  <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold" }}>Kontak</Text>
                </Box>
                <Box sx={{ bg: "surface", borderRadius: "md", p: 3, textAlign: "center" }}>
                  <Text sx={{ fontSize: 5, fontWeight: "extrabold", color: "purple", display: "block" }}>{company.dealCount}</Text>
                  <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold" }}>Deals</Text>
                </Box>
                <Box sx={{ bg: "surface", borderRadius: "md", p: 3, textAlign: "center" }}>
                  <Text sx={{ fontSize: 3, fontWeight: "extrabold", color: "success", display: "block" }}>{company.revenue}</Text>
                  <Text sx={{ fontSize: 0, color: "muted", fontWeight: "semibold" }}>Revenue</Text>
                </Box>
              </Grid>

              <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Flex sx={{ gap: 3, fontSize: 1, color: "muted" }}>
                  <Text>🌐 {company.website}</Text>
                  <Text>📞 {company.phone}</Text>
                </Flex>
                <Flex sx={{ gap: 2 }}>
                  <Button sx={{ p: "6px 12px", fontSize: 1, borderRadius: "sm", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", cursor: "pointer", fontWeight: "semibold" }}>Detail</Button>
                  <Button sx={{ p: "6px 12px", fontSize: 1, borderRadius: "sm", border: "1px solid", borderColor: "border", bg: "white", color: "muted", cursor: "pointer", fontWeight: "semibold" }}>Edit</Button>
                </Flex>
              </Flex>
            </Box>
          )
        })}
      </Grid>

      {filtered.length === 0 && <Box sx={{ textAlign: "center", p: "48px 0", color: "subtle", fontSize: 3 }}>Tidak ada perusahaan yang ditemukan.</Box>}
    </Layout>
  )
}

export default CompaniesPage

export const Head: HeadFC = () => <title>Companies | nateeCRM</title>
