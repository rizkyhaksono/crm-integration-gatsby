import * as React from "react"

export type IntegrationPlatform = "airtable" | "hubspot" | "salesforce" | "erp" | "webhook" | "custom_api" | "none"

export interface AirtableConfig {
  apiKey: string
  baseId: string
  contactsTable: string
  dealsTable: string
  activitiesTable: string
  companiesTable: string
}

export interface HubSpotConfig {
  apiKey: string
  portalId: string
}

export interface SalesforceConfig {
  instanceUrl: string
  clientId: string
  clientSecret: string
  accessToken: string
}

export interface ERPConfig {
  baseUrl: string
  apiKey: string
  authType: "bearer" | "basic" | "api_key"
  username: string
  password: string
  modulesEnabled: string[]
}

export interface WebhookConfig {
  incomingUrl: string
  outgoingUrl: string
  secret: string
  events: string[]
}

export interface CustomAPIConfig {
  baseUrl: string
  apiKey: string
  authHeader: string
  contactsEndpoint: string
  dealsEndpoint: string
  activitiesEndpoint: string
  companiesEndpoint: string
}

export interface IntegrationSettings {
  platform: IntegrationPlatform
  airtable: AirtableConfig
  hubspot: HubSpotConfig
  salesforce: SalesforceConfig
  erp: ERPConfig
  webhook: WebhookConfig
  customApi: CustomAPIConfig
}

const STORAGE_KEY = "nateecrm_integration_settings"

const defaultSettings: IntegrationSettings = {
  platform: "none",
  airtable: {
    apiKey: "",
    baseId: "",
    contactsTable: "Contacts",
    dealsTable: "Deals",
    activitiesTable: "Activities",
    companiesTable: "Companies",
  },
  hubspot: {
    apiKey: "",
    portalId: "",
  },
  salesforce: {
    instanceUrl: "",
    clientId: "",
    clientSecret: "",
    accessToken: "",
  },
  erp: {
    baseUrl: "",
    apiKey: "",
    authType: "bearer",
    username: "",
    password: "",
    modulesEnabled: [],
  },
  webhook: {
    incomingUrl: "",
    outgoingUrl: "",
    secret: "",
    events: [],
  },
  customApi: {
    baseUrl: "",
    apiKey: "",
    authHeader: "Authorization",
    contactsEndpoint: "/contacts",
    dealsEndpoint: "/deals",
    activitiesEndpoint: "/activities",
    companiesEndpoint: "/companies",
  },
}

export function useSettings() {
  const [settings, setSettingsState] = React.useState<IntegrationSettings>(defaultSettings)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<IntegrationSettings>
        // Merge with defaults to ensure all keys exist after schema updates
        setSettingsState({ ...defaultSettings, ...parsed })
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  const saveSettings = React.useCallback((next: IntegrationSettings) => {
    setSettingsState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors
    }
  }, [])

  return { settings, saveSettings, loaded }
}

// ---------------------------------------------------------------------------
// Airtable fetch helpers
// ---------------------------------------------------------------------------

interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export async function fetchAirtableTable<T>(
  apiKey: string,
  baseId: string,
  tableName: string,
  maxRecords = 100
): Promise<AirtableRecord<T>[]> {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=${maxRecords}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Airtable error: ${res.status}`)
  }
  const data: AirtableResponse<T> = await res.json()
  return data.records
}
