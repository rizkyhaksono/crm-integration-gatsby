import { Box, Flex, Grid, Text, Button, Input, Label } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout"
import { useSettings, type IntegrationSettings } from "../hooks/useSettings"
import { platformList } from "../services/integrations"

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const IntegrationsPage: React.FC<PageProps> = ({ location }) => {
  const { settings, saveSettings, loaded } = useSettings()
  const [selectedPlatform, setSelectedPlatform] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)
  const [form, setForm] = React.useState<IntegrationSettings>(settings)

  React.useEffect(() => {
    if (loaded) setForm(settings)
  }, [loaded, settings])

  const isConnected = (platformId: string) => {
    if (settings.platform !== platformId) return false
    switch (platformId) {
      case "airtable":
        return !!settings.airtable.apiKey && !!settings.airtable.baseId
      case "hubspot":
        return !!settings.hubspot.apiKey
      case "salesforce":
        return !!settings.salesforce.accessToken
      case "erp":
        return !!settings.erp.baseUrl && !!settings.erp.apiKey
      case "webhook":
        return !!settings.webhook.incomingUrl || !!settings.webhook.outgoingUrl
      case "custom_api":
        return !!settings.customApi.baseUrl
      default:
        return false
    }
  }

  const handleSave = () => {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDisconnect = (platformId: string) => {
    const reset = { ...form, platform: "none" as const }
    setForm(reset)
    saveSettings(reset)
    setSelectedPlatform(null)
  }

  const handleConnect = (platformId: string) => {
    setForm((prev) => ({ ...prev, platform: platformId as IntegrationSettings["platform"] }))
    setSelectedPlatform(platformId)
  }

  const inputSx = { border: "1px solid", borderColor: "border", borderRadius: "md", p: "10px 14px", fontSize: 3, color: "text", width: "100%", bg: "white", boxSizing: "border-box" as const, fontFamily: "body" }
  const labelSx = { fontSize: 2, fontWeight: "semibold", color: "#374151", mb: 2, display: "block" }

  return (
    <Layout currentPath={location.pathname} title="Integrations">
      {/* Connection status */}
      <Flex
        sx={{
          p: "14px 20px",
          borderRadius: "lg",
          mb: 7,
          alignItems: "center",
          gap: 3,
          bg: settings.platform !== "none" ? "successLight" : "surface",
          border: "1px solid",
          borderColor: settings.platform !== "none" ? "#A7F3D0" : "border",
        }}
      >
        <Box sx={{ width: "10px", height: "10px", borderRadius: "circle", bg: settings.platform !== "none" ? "success" : "subtle", flexShrink: 0 }} />
        <Text sx={{ fontSize: 3, fontWeight: "bold", color: settings.platform !== "none" ? "successDark" : "muted" }}>
          {settings.platform !== "none" ? `Terhubung ke ${platformList.find((p) => p.id === settings.platform)?.name || settings.platform}` : "Belum ada integrasi aktif"}
        </Text>
      </Flex>

      {/* Platform grid */}
      <Text sx={{ fontSize: 5, fontWeight: "bold", color: "text", mb: 5, display: "block" }}>Platform Tersedia</Text>
      <Grid sx={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 5, mb: 7 }}>
        {platformList.map((platform) => {
          const connected = isConnected(platform.id)
          return (
            <Box
              key={platform.id}
              sx={{
                bg: "white",
                borderRadius: "xl",
                p: 6,
                border: "2px solid",
                borderColor: connected ? "success" : selectedPlatform === platform.id ? "primary" : "border",
                boxShadow: "card",
                position: "relative",
                opacity: platform.available ? 1 : 0.7,
                cursor: platform.available ? "pointer" : "default",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": platform.available ? { borderColor: connected ? "success" : "primary", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" } : {},
              }}
              onClick={() => platform.available && handleConnect(platform.id)}
            >
              {/* Connected badge */}
              {connected && <Box sx={{ position: "absolute", top: -10, right: 12, bg: "success", color: "white", fontSize: 0, fontWeight: "bold", p: "3px 10px", borderRadius: "pill" }}>Terhubung</Box>}
              {!platform.available && <Box sx={{ position: "absolute", top: -10, right: 12, bg: "muted", color: "white", fontSize: 0, fontWeight: "bold", p: "3px 10px", borderRadius: "pill" }}>Segera Hadir</Box>}

              <Flex sx={{ alignItems: "center", gap: 3, mb: 3 }}>
                <Flex sx={{ width: 48, height: 48, borderRadius: "lg", backgroundColor: platform.bg, alignItems: "center", justifyContent: "center", fontSize: 7 }}>{platform.icon}</Flex>
                <Box>
                  <Text sx={{ fontSize: 4, fontWeight: "bold", color: "text", display: "block" }}>{platform.name}</Text>
                </Box>
              </Flex>
              <Text sx={{ fontSize: 2, color: "muted", lineHeight: "body", display: "block", mb: 4 }}>{platform.description}</Text>

              <Flex sx={{ gap: 2 }}>
                {connected ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDisconnect(platform.id)
                    }}
                    sx={{ p: "6px 14px", borderRadius: "sm", border: "1px solid #FCA5A5", bg: "dangerLight", color: "danger", fontSize: 2, fontWeight: "semibold", cursor: "pointer" }}
                  >
                    Putuskan
                  </Button>
                ) : platform.available ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConnect(platform.id)
                    }}
                    sx={{ p: "6px 14px", borderRadius: "sm", border: "1px solid", borderColor: "primaryMid", bg: "primaryLight", color: "primary", fontSize: 2, fontWeight: "semibold", cursor: "pointer" }}
                  >
                    Konfigurasi
                  </Button>
                ) : null}
              </Flex>
            </Box>
          )
        })}
      </Grid>

      {/* Configuration panel */}
      {selectedPlatform === "airtable" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>🗃️</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi Airtable
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Hubungkan Airtable sebagai sumber data CRM</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Box>
                <Label sx={labelSx}>Personal Access Token (API Key)</Label>
                <Input type="password" placeholder="pat.xxxxxxxxxxxxxxxx..." value={form.airtable.apiKey} onChange={(e) => setForm((prev) => ({ ...prev, airtable: { ...prev.airtable, apiKey: e.target.value } }))} sx={inputSx} />
              </Box>
              <Box>
                <Label sx={labelSx}>Base ID</Label>
                <Input type="text" placeholder="appXXXXXXXXXXXXXX" value={form.airtable.baseId} onChange={(e) => setForm((prev) => ({ ...prev, airtable: { ...prev.airtable, baseId: e.target.value } }))} sx={inputSx} />
              </Box>
              <Grid sx={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                {[
                  { field: "contactsTable" as const, label: "Contacts", placeholder: "Contacts" },
                  { field: "dealsTable" as const, label: "Deals", placeholder: "Deals" },
                  { field: "activitiesTable" as const, label: "Activities", placeholder: "Activities" },
                  { field: "companiesTable" as const, label: "Companies", placeholder: "Companies" },
                ].map(({ field, label, placeholder }) => (
                  <Box key={field}>
                    <Label sx={labelSx}>{label}</Label>
                    <Input type="text" placeholder={placeholder} value={form.airtable[field]} onChange={(e) => setForm((prev) => ({ ...prev, airtable: { ...prev.airtable, [field]: e.target.value } }))} sx={inputSx} />
                  </Box>
                ))}
              </Grid>
              <Flex sx={{ gap: 3 }}>
                <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer" }}>
                  {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
                </Button>
              </Flex>
            </Grid>
          </Box>
        </Box>
      )}

      {/* HubSpot config */}
      {selectedPlatform === "hubspot" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>🔶</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi HubSpot
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Integrasi akan tersedia segera</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Box>
                <Label sx={labelSx}>API Key</Label>
                <Input type="password" placeholder="hapi-xxxxxxxx-xxxx-xxxx..." value={form.hubspot.apiKey} onChange={(e) => setForm((prev) => ({ ...prev, hubspot: { ...prev.hubspot, apiKey: e.target.value } }))} sx={inputSx} />
              </Box>
              <Box>
                <Label sx={labelSx}>Portal ID</Label>
                <Input type="text" placeholder="12345678" value={form.hubspot.portalId} onChange={(e) => setForm((prev) => ({ ...prev, hubspot: { ...prev.hubspot, portalId: e.target.value } }))} sx={inputSx} />
              </Box>
              <Box sx={{ p: "14px 18px", bg: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "md", fontSize: 2, color: "#92400E" }}>
                ⏳ HubSpot integration sedang dalam pengembangan. Konfigurasi Anda akan tersimpan untuk digunakan nanti.
              </Box>
              <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}

      {/* ERP config */}
      {selectedPlatform === "erp" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>🏭</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi ERP
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Hubungkan dengan SAP, Oracle, Odoo, atau ERP lainnya</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Box>
                <Label sx={labelSx}>Base URL</Label>
                <Input type="text" placeholder="https://erp.perusahaan.com/api" value={form.erp.baseUrl} onChange={(e) => setForm((prev) => ({ ...prev, erp: { ...prev.erp, baseUrl: e.target.value } }))} sx={inputSx} />
              </Box>
              <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <Box>
                  <Label sx={labelSx}>API Key</Label>
                  <Input type="password" placeholder="erp-api-key..." value={form.erp.apiKey} onChange={(e) => setForm((prev) => ({ ...prev, erp: { ...prev.erp, apiKey: e.target.value } }))} sx={inputSx} />
                </Box>
                <Box>
                  <Label sx={labelSx}>Auth Type</Label>
                  <select
                    value={form.erp.authType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((prev) => ({ ...prev, erp: { ...prev.erp, authType: e.target.value as "bearer" | "basic" | "api_key" } }))}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "#1E293B",
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                      boxSizing: "border-box",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      appearance: "auto",
                    }}
                  >
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="api_key">API Key</option>
                  </select>
                </Box>
              </Grid>
              <Box sx={{ p: "14px 18px", bg: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "md", fontSize: 2, color: "#92400E" }}>
                ⏳ ERP integration sedang dalam pengembangan. Konfigurasi endpoint REST/SOAP Anda akan tersimpan.
              </Box>
              <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Webhook config */}
      {selectedPlatform === "webhook" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>🔗</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi Webhook
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Terima dan kirim data otomatis via webhook</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Box>
                <Label sx={labelSx}>Incoming Webhook URL</Label>
                <Input
                  type="text"
                  placeholder="https://hooks.nateecrm.com/incoming/..."
                  value={form.webhook.incomingUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, webhook: { ...prev.webhook, incomingUrl: e.target.value } }))}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <Label sx={labelSx}>Outgoing Webhook URL</Label>
                <Input type="text" placeholder="https://your-server.com/webhook" value={form.webhook.outgoingUrl} onChange={(e) => setForm((prev) => ({ ...prev, webhook: { ...prev.webhook, outgoingUrl: e.target.value } }))} sx={inputSx} />
              </Box>
              <Box>
                <Label sx={labelSx}>Secret Key</Label>
                <Input type="password" placeholder="webhook-secret..." value={form.webhook.secret} onChange={(e) => setForm((prev) => ({ ...prev, webhook: { ...prev.webhook, secret: e.target.value } }))} sx={inputSx} />
              </Box>
              <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Custom API config */}
      {selectedPlatform === "custom_api" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>⚡</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi Custom API
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Hubungkan ke REST API manapun</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Grid sx={{ gridTemplateColumns: "2fr 1fr", gap: 4 }}>
                <Box>
                  <Label sx={labelSx}>Base URL</Label>
                  <Input type="text" placeholder="https://api.yourservice.com/v1" value={form.customApi.baseUrl} onChange={(e) => setForm((prev) => ({ ...prev, customApi: { ...prev.customApi, baseUrl: e.target.value } }))} sx={inputSx} />
                </Box>
                <Box>
                  <Label sx={labelSx}>API Key</Label>
                  <Input type="password" placeholder="api-key..." value={form.customApi.apiKey} onChange={(e) => setForm((prev) => ({ ...prev, customApi: { ...prev.customApi, apiKey: e.target.value } }))} sx={inputSx} />
                </Box>
              </Grid>
              <Grid sx={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                {[
                  { field: "contactsEndpoint" as const, label: "Contacts Endpoint", placeholder: "/contacts" },
                  { field: "dealsEndpoint" as const, label: "Deals Endpoint", placeholder: "/deals" },
                  { field: "activitiesEndpoint" as const, label: "Activities Endpoint", placeholder: "/activities" },
                  { field: "companiesEndpoint" as const, label: "Companies Endpoint", placeholder: "/companies" },
                ].map(({ field, label, placeholder }) => (
                  <Box key={field}>
                    <Label sx={labelSx}>{label}</Label>
                    <Input type="text" placeholder={placeholder} value={form.customApi[field]} onChange={(e) => setForm((prev) => ({ ...prev, customApi: { ...prev.customApi, [field]: e.target.value } }))} sx={inputSx} />
                  </Box>
                ))}
              </Grid>
              <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Salesforce config */}
      {selectedPlatform === "salesforce" && (
        <Box sx={{ bg: "white", borderRadius: "xl", border: "1px solid", borderColor: "border", boxShadow: "card", mb: 6 }}>
          <Box sx={{ p: "20px 24px", borderBottom: "1px solid", borderColor: "borderLight" }}>
            <Flex sx={{ alignItems: "center", gap: 3 }}>
              <Text sx={{ fontSize: 6 }}>☁️</Text>
              <Box>
                <Text as="h2" sx={{ fontSize: 4, fontWeight: "bold", color: "text", m: 0 }}>
                  Konfigurasi Salesforce
                </Text>
                <Text sx={{ fontSize: 2, color: "muted" }}>Enterprise CRM integration</Text>
              </Box>
            </Flex>
          </Box>
          <Box sx={{ p: 6 }}>
            <Grid sx={{ gap: 5 }}>
              <Box>
                <Label sx={labelSx}>Instance URL</Label>
                <Input
                  type="text"
                  placeholder="https://yourorg.my.salesforce.com"
                  value={form.salesforce.instanceUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, salesforce: { ...prev.salesforce, instanceUrl: e.target.value } }))}
                  sx={inputSx}
                />
              </Box>
              <Grid sx={{ gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <Box>
                  <Label sx={labelSx}>Client ID</Label>
                  <Input type="text" placeholder="client-id..." value={form.salesforce.clientId} onChange={(e) => setForm((prev) => ({ ...prev, salesforce: { ...prev.salesforce, clientId: e.target.value } }))} sx={inputSx} />
                </Box>
                <Box>
                  <Label sx={labelSx}>Client Secret</Label>
                  <Input
                    type="password"
                    placeholder="client-secret..."
                    value={form.salesforce.clientSecret}
                    onChange={(e) => setForm((prev) => ({ ...prev, salesforce: { ...prev.salesforce, clientSecret: e.target.value } }))}
                    sx={inputSx}
                  />
                </Box>
              </Grid>
              <Box sx={{ p: "14px 18px", bg: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "md", fontSize: 2, color: "#92400E" }}>⏳ Salesforce integration sedang dalam pengembangan. Konfigurasi OAuth Anda akan tersimpan.</Box>
              <Button onClick={handleSave} sx={{ p: "10px 28px", borderRadius: "md", border: "none", bg: "primary", color: "white", fontSize: 3, fontWeight: "semibold", cursor: "pointer", width: "fit-content" }}>
                {saved ? "✓ Tersimpan!" : "Simpan Konfigurasi"}
              </Button>
            </Grid>
          </Box>
        </Box>
      )}
    </Layout>
  )
}

export default IntegrationsPage

export const Head: HeadFC = () => <title>Integrations | nateeCRM</title>
