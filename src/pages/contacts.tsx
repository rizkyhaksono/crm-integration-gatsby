import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"

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

const ContactsPage: React.FC<PageProps> = ({ location }) => {
  const [search, setSearch] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")

  const filtered = mockContacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  }

  const inputStyle: React.CSSProperties = {
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 14,
    color: "#1E293B",
    outline: "none",
    width: 260,
    backgroundColor: "#FFFFFF",
  }

  return (
    <Layout currentPath={location.pathname} title="Contacts">
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input placeholder="Cari kontak..." value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "Active", "Lead", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: filterStatus === s ? "#2563EB" : "#E2E8F0",
                  backgroundColor: filterStatus === s ? "#EFF6FF" : "#FFFFFF",
                  color: filterStatus === s ? "#2563EB" : "#64748B",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {s === "All" ? "Semua" : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>
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
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          + Tambah Kontak
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Kontak", value: mockContacts.length, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Kontak Aktif", value: mockContacts.filter((c) => c.status === "Active").length, color: "#10B981", bg: "#ECFDF5" },
          { label: "Lead Baru", value: mockContacts.filter((c) => c.status === "Lead").length, color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              padding: "20px 24px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["Kontak", "Perusahaan", "No. Telepon", "Status", "Kontak Terakhir", "Aksi"].map((h) => (
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
              {filtered.map((contact, i) => {
                const sc = statusConfig[contact.status]
                return (
                  <tr key={contact.id} style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFBFF" }}>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            backgroundColor: "#DBEAFE",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {contact.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>{contact.name}</div>
                          <div style={{ fontSize: 12, color: "#64748B" }}>{contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{contact.company}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{contact.position}</div>
                    </td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#64748B" }}>{contact.phone}</td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ backgroundColor: sc.bg, color: sc.color, padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#64748B" }}>{contact.lastContact}</td>
                    <td style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ padding: "6px 12px", fontSize: 12, borderRadius: 6, border: "1px solid #DBEAFE", backgroundColor: "#EFF6FF", color: "#2563EB", cursor: "pointer", fontWeight: 600 }}>Edit</button>
                        <button style={{ padding: "6px 12px", fontSize: 12, borderRadius: 6, border: "1px solid #FEE2E2", backgroundColor: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontWeight: 600 }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>Tidak ada kontak yang ditemukan.</div>}
        </div>
      </div>
    </Layout>
  )
}

export default ContactsPage

export const Head: HeadFC = () => <title>Contacts | NexusCRM</title>
