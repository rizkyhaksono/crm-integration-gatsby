// ---------------------------------------------------------------------------
// Integration Adapter Layer
// ---------------------------------------------------------------------------
// Pluggable connectors for multi-platform CRM integration.
// Each adapter implements `IntegrationAdapter` and is instantiated by the
// `getAdapter()` factory based on user settings.
// ---------------------------------------------------------------------------

import type { IntegrationSettings, AirtableConfig, HubSpotConfig, SalesforceConfig, ERPConfig, WebhookConfig, CustomAPIConfig } from "../hooks/useSettings"
import { fetchAirtableTable } from "../hooks/useSettings"

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface CRMContact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "Active" | "Lead" | "Inactive"
  lastContact: string
}

export interface CRMDeal {
  id: string
  title: string
  company: string
  value: number
  valueFmt: string
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"
  owner: string
  probability: number
  closeDate: string
}

export interface CRMActivity {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note"
  title: string
  description: string
  contact: string
  company: string
  date: string
  time: string
  completed: boolean
}

export interface CRMCompany {
  id: string
  name: string
  industry: string
  website: string
  phone: string
  address: string
  contactCount: number
  dealCount: number
  revenue: number
  revenueFmt: string
  status: "Active" | "Prospect" | "Inactive"
  createdAt: string
}

// ---------------------------------------------------------------------------
// Adapter interface
// ---------------------------------------------------------------------------

export interface IntegrationAdapter {
  readonly platform: string
  fetchContacts(): Promise<CRMContact[]>
  fetchDeals(): Promise<CRMDeal[]>
  fetchActivities(): Promise<CRMActivity[]>
  fetchCompanies(): Promise<CRMCompany[]>
  testConnection(): Promise<boolean>
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function fmtRupiah(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`
  return `Rp ${n.toLocaleString("id-ID")}`
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Airtable Adapter
// ---------------------------------------------------------------------------

export class AirtableAdapter implements IntegrationAdapter {
  readonly platform = "Airtable"
  constructor(private cfg: AirtableConfig) { }

  async fetchContacts(): Promise<CRMContact[]> {
    const records = await fetchAirtableTable<Record<string, any>>(
      this.cfg.apiKey,
      this.cfg.baseId,
      this.cfg.contactsTable
    )
    return records.map((r, i) => {
      const f = r.fields
      return {
        id: r.id || String(i),
        name: f.Name || "(Tanpa Nama)",
        email: f.Email || "-",
        phone: f.Phone || "-",
        company: f.Company || "-",
        position: f.Position || "-",
        status: (["Active", "Lead", "Inactive"].includes(f.Status) ? f.Status : "Active") as CRMContact["status"],
        lastContact: f.LastContact
          ? new Date(f.LastContact).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "-",
      }
    })
  }

  async fetchDeals(): Promise<CRMDeal[]> {
    const records = await fetchAirtableTable<Record<string, any>>(
      this.cfg.apiKey,
      this.cfg.baseId,
      this.cfg.dealsTable
    )
    const validStages = new Set(["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"])
    return records.map((r, i) => {
      const f = r.fields
      const value = typeof f.Value === "number" ? f.Value : Number.parseFloat(String(f.Value || "0"))
      return {
        id: r.id || String(i),
        title: f.Title || "(Tanpa Judul)",
        company: f.Company || "-",
        value,
        valueFmt: fmtRupiah(value),
        stage: (validStages.has(f.Stage) ? f.Stage : "Lead") as CRMDeal["stage"],
        owner: f.Owner ? getInitials(f.Owner) : "?",
        probability: typeof f.Probability === "number" ? f.Probability : 0,
        closeDate: f.CloseDate
          ? new Date(f.CloseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "-",
      }
    })
  }

  async fetchActivities(): Promise<CRMActivity[]> {
    const records = await fetchAirtableTable<Record<string, any>>(
      this.cfg.apiKey,
      this.cfg.baseId,
      this.cfg.activitiesTable
    )
    const validTypes = new Set(["call", "email", "meeting", "task", "note"])
    return records.map((r, i) => {
      const f = r.fields
      return {
        id: r.id || String(i),
        type: (validTypes.has((f.Type || "").toLowerCase()) ? (f.Type || "").toLowerCase() : "task") as CRMActivity["type"],
        title: f.Title || "(Tanpa Judul)",
        description: f.Description || "",
        contact: f.Contact || "-",
        company: f.Company || "-",
        date: f.Date
          ? new Date(f.Date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "-",
        time: f.Time || "",
        completed: !!f.Completed,
      }
    })
  }

  async fetchCompanies(): Promise<CRMCompany[]> {
    const records = await fetchAirtableTable<Record<string, any>>(
      this.cfg.apiKey,
      this.cfg.baseId,
      this.cfg.companiesTable
    )
    return records.map((r, i) => {
      const f = r.fields
      const revenue = typeof f.Revenue === "number" ? f.Revenue : 0
      return {
        id: r.id || String(i),
        name: f.Name || "(Tanpa Nama)",
        industry: f.Industry || "-",
        website: f.Website || "-",
        phone: f.Phone || "-",
        address: f.Address || "-",
        contactCount: typeof f.ContactCount === "number" ? f.ContactCount : 0,
        dealCount: typeof f.DealCount === "number" ? f.DealCount : 0,
        revenue,
        revenueFmt: fmtRupiah(revenue),
        status: (["Active", "Prospect", "Inactive"].includes(f.Status) ? f.Status : "Active") as CRMCompany["status"],
        createdAt: f.CreatedAt
          ? new Date(f.CreatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "-",
      }
    })
  }

  async testConnection(): Promise<boolean> {
    const records = await fetchAirtableTable(
      this.cfg.apiKey,
      this.cfg.baseId,
      this.cfg.contactsTable,
      1
    )
    return Array.isArray(records)
  }
}

// ---------------------------------------------------------------------------
// Stub adapters (HubSpot, Salesforce, ERP, Webhook, Custom API)
// These are typed placeholders — actual API calls to be wired when credentials
// are available. They demonstrate the adapter pattern.
// ---------------------------------------------------------------------------

export class HubSpotAdapter implements IntegrationAdapter {
  readonly platform = "HubSpot"
  constructor(private cfg: HubSpotConfig) { }

  async fetchContacts(): Promise<CRMContact[]> {
    // TODO: Implement HubSpot CRM Contacts API
    throw new Error("HubSpot integration belum tersedia. Segera hadir!")
  }
  async fetchDeals(): Promise<CRMDeal[]> {
    throw new Error("HubSpot integration belum tersedia.")
  }
  async fetchActivities(): Promise<CRMActivity[]> {
    throw new Error("HubSpot integration belum tersedia.")
  }
  async fetchCompanies(): Promise<CRMCompany[]> {
    throw new Error("HubSpot integration belum tersedia.")
  }
  async testConnection(): Promise<boolean> {
    if (!this.cfg.apiKey) throw new Error("HubSpot API Key belum diisi.")
    throw new Error("HubSpot integration belum tersedia.")
  }
}

export class SalesforceAdapter implements IntegrationAdapter {
  readonly platform = "Salesforce"
  constructor(private cfg: SalesforceConfig) { }

  async fetchContacts(): Promise<CRMContact[]> {
    throw new Error("Salesforce integration belum tersedia. Segera hadir!")
  }
  async fetchDeals(): Promise<CRMDeal[]> {
    throw new Error("Salesforce integration belum tersedia.")
  }
  async fetchActivities(): Promise<CRMActivity[]> {
    throw new Error("Salesforce integration belum tersedia.")
  }
  async fetchCompanies(): Promise<CRMCompany[]> {
    throw new Error("Salesforce integration belum tersedia.")
  }
  async testConnection(): Promise<boolean> {
    if (!this.cfg.accessToken) throw new Error("Salesforce Access Token belum diisi.")
    throw new Error("Salesforce integration belum tersedia.")
  }
}

export class ERPAdapter implements IntegrationAdapter {
  readonly platform = "ERP"
  constructor(private cfg: ERPConfig) { }

  async fetchContacts(): Promise<CRMContact[]> {
    throw new Error("ERP integration belum tersedia. Konfigurasi endpoint REST/SOAP di pengaturan.")
  }
  async fetchDeals(): Promise<CRMDeal[]> {
    throw new Error("ERP integration belum tersedia.")
  }
  async fetchActivities(): Promise<CRMActivity[]> {
    throw new Error("ERP integration belum tersedia.")
  }
  async fetchCompanies(): Promise<CRMCompany[]> {
    throw new Error("ERP integration belum tersedia.")
  }
  async testConnection(): Promise<boolean> {
    if (!this.cfg.baseUrl) throw new Error("ERP Base URL belum diisi.")
    throw new Error("ERP integration belum tersedia.")
  }
}

export class WebhookAdapter implements IntegrationAdapter {
  readonly platform = "Webhook"
  constructor(private cfg: WebhookConfig) { }

  async fetchContacts(): Promise<CRMContact[]> {
    throw new Error("Webhook hanya menerima data masuk. Gunakan incoming webhook URL.")
  }
  async fetchDeals(): Promise<CRMDeal[]> {
    throw new Error("Webhook hanya menerima data masuk.")
  }
  async fetchActivities(): Promise<CRMActivity[]> {
    throw new Error("Webhook hanya menerima data masuk.")
  }
  async fetchCompanies(): Promise<CRMCompany[]> {
    throw new Error("Webhook hanya menerima data masuk.")
  }
  async testConnection(): Promise<boolean> {
    if (!this.cfg.incomingUrl && !this.cfg.outgoingUrl) throw new Error("Webhook URL belum diisi.")
    return true
  }
}

export class CustomAPIAdapter implements IntegrationAdapter {
  readonly platform = "Custom API"
  constructor(private cfg: CustomAPIConfig) { }

  private async apiFetch<T>(endpoint: string): Promise<T> {
    const url = `${this.cfg.baseUrl}${endpoint}`
    const res = await fetch(url, {
      headers: {
        [this.cfg.authHeader]: `Bearer ${this.cfg.apiKey}`,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  }

  async fetchContacts(): Promise<CRMContact[]> {
    if (!this.cfg.baseUrl) throw new Error("Custom API Base URL belum diisi.")
    const data = await this.apiFetch<any[]>(this.cfg.contactsEndpoint)
    return data.map((item, i) => ({
      id: item.id || String(i),
      name: item.name || "-",
      email: item.email || "-",
      phone: item.phone || "-",
      company: item.company || "-",
      position: item.position || "-",
      status: "Active" as const,
      lastContact: "-",
    }))
  }
  async fetchDeals(): Promise<CRMDeal[]> {
    if (!this.cfg.baseUrl) throw new Error("Custom API Base URL belum diisi.")
    const data = await this.apiFetch<any[]>(this.cfg.dealsEndpoint)
    return data.map((item, i) => ({
      id: item.id || String(i),
      title: item.title || "-",
      company: item.company || "-",
      value: item.value || 0,
      valueFmt: fmtRupiah(item.value || 0),
      stage: "Lead" as const,
      owner: "-",
      probability: 0,
      closeDate: "-",
    }))
  }
  async fetchActivities(): Promise<CRMActivity[]> {
    if (!this.cfg.baseUrl) throw new Error("Custom API Base URL belum diisi.")
    const data = await this.apiFetch<any[]>(this.cfg.activitiesEndpoint)
    return data.map((item, i) => ({
      id: item.id || String(i),
      type: "task" as const,
      title: item.title || "-",
      description: item.description || "",
      contact: item.contact || "-",
      company: item.company || "-",
      date: "-",
      time: "",
      completed: false,
    }))
  }
  async fetchCompanies(): Promise<CRMCompany[]> {
    if (!this.cfg.baseUrl) throw new Error("Custom API Base URL belum diisi.")
    const data = await this.apiFetch<any[]>(this.cfg.companiesEndpoint)
    return data.map((item, i) => ({
      id: item.id || String(i),
      name: item.name || "-",
      industry: item.industry || "-",
      website: item.website || "-",
      phone: item.phone || "-",
      address: item.address || "-",
      contactCount: 0,
      dealCount: 0,
      revenue: 0,
      revenueFmt: "Rp 0",
      status: "Active" as const,
      createdAt: "-",
    }))
  }
  async testConnection(): Promise<boolean> {
    if (!this.cfg.baseUrl) throw new Error("Custom API Base URL belum diisi.")
    await this.apiFetch(this.cfg.contactsEndpoint)
    return true
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function getAdapter(settings: IntegrationSettings): IntegrationAdapter | null {
  switch (settings.platform) {
    case "airtable":
      if (!settings.airtable.apiKey || !settings.airtable.baseId) return null
      return new AirtableAdapter(settings.airtable)
    case "hubspot":
      return new HubSpotAdapter(settings.hubspot)
    case "salesforce":
      return new SalesforceAdapter(settings.salesforce)
    case "erp":
      return new ERPAdapter(settings.erp)
    case "webhook":
      return new WebhookAdapter(settings.webhook)
    case "custom_api":
      return new CustomAPIAdapter(settings.customApi)
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Platform metadata (for UI)
// ---------------------------------------------------------------------------

export interface PlatformMeta {
  id: IntegrationSettings["platform"]
  name: string
  description: string
  icon: string
  color: string
  bg: string
  available: boolean
}

export const platformList: PlatformMeta[] = [
  { id: "airtable", name: "Airtable", description: "Database + REST API. Cocok untuk tim kecil-menengah.", icon: "🗃️", color: "#2563EB", bg: "#EFF6FF", available: true },
  { id: "hubspot", name: "HubSpot", description: "CRM lengkap dengan marketing & sales automation.", icon: "🔶", color: "#FF7A59", bg: "#FFF7ED", available: false },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM terdepan di dunia.", icon: "☁️", color: "#00A1E0", bg: "#F0F9FF", available: false },
  { id: "erp", name: "ERP System", description: "Integrasi dengan SAP, Oracle, Odoo, atau ERP lainnya via REST/SOAP.", icon: "🏭", color: "#8B5CF6", bg: "#F5F3FF", available: false },
  { id: "webhook", name: "Webhook", description: "Terima & kirim data otomatis via webhook endpoints.", icon: "🔗", color: "#10B981", bg: "#ECFDF5", available: false },
  { id: "custom_api", name: "Custom API", description: "Hubungkan ke REST API apapun dengan konfigurasi endpoint.", icon: "⚡", color: "#F59E0B", bg: "#FFFBEB", available: false },
]
