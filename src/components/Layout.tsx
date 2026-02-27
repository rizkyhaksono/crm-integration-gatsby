import { Box, Flex, Text, Link as ThemedLink } from "theme-ui"
import * as React from "react"
import { Link as GatsbyLink } from "gatsby"

interface LayoutProps {
  children: React.ReactNode
  currentPath: string
  title: string
}

const mainNavItems = [
  { label: "Dashboard", path: "/", icon: "⊞" },
  { label: "Contacts", path: "/contacts/", icon: "👥" },
  { label: "Companies", path: "/companies/", icon: "🏢" },
  { label: "Deals", path: "/deals/", icon: "💼" },
  { label: "Activities", path: "/activities/", icon: "📋" },
  { label: "Tasks", path: "/tasks/", icon: "✅" },
  { label: "Reports", path: "/reports/", icon: "📊" },
]

const systemNavItems = [
  { label: "Integrations", path: "/integrations/", icon: "🔗" },
  { label: "Settings", path: "/settings/", icon: "⚙️" },
]

const SIDEBAR_FULL = 240
const SIDEBAR_MINI = 64

const Layout: React.FC<LayoutProps> = ({ children, currentPath, title }) => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const sidebarWidth = collapsed ? SIDEBAR_MINI : SIDEBAR_FULL

  const renderNavItem = (item: { label: string; path: string; icon: string }) => {
    const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path))
    return (
      <Box as="li" key={item.path} sx={{ listStyle: "none", mb: 1 }}>
        <ThemedLink
          {...({ as: GatsbyLink, to: item.path } as any)}
          onClick={() => setMobileOpen(false)}
          title={collapsed ? item.label : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 3,
            p: collapsed ? "10px 0" : "10px 12px",
            borderRadius: "md",
            fontSize: 2,
            fontWeight: isActive ? "semibold" : "body",
            color: isActive ? "white" : "sidebarText",
            bg: isActive ? "primary" : "transparent",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background-color 0.15s ease, padding 0.22s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
            "&:hover": {
              bg: isActive ? "primary" : "rgba(255,255,255,0.08)",
            },
          }}
        >
          <Box
            as="span"
            sx={{
              fontSize: 4,
              lineHeight: 1,
              flexShrink: 0,
              width: collapsed ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            {item.icon}
          </Box>
          <Text
            as="span"
            sx={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              transition: "opacity 0.15s ease, width 0.22s ease",
              pointerEvents: "none",
            }}
          >
            {item.label}
          </Text>
          {isActive && !collapsed && (
            <Box
              sx={{
                ml: "auto",
                width: "6px",
                height: "6px",
                borderRadius: "circle",
                bg: "#93C5FD",
                flexShrink: 0,
              }}
            />
          )}
        </ThemedLink>
      </Box>
    )
  }

  return (
    <Flex sx={{ fontFamily: "body", minHeight: "100vh" }}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <Box
          onClick={() => setMobileOpen(false)}
          sx={{
            display: ["block", "none"],
            position: "fixed",
            inset: 0,
            bg: "rgba(0,0,0,0.45)",
            zIndex: 110,
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        as="nav"
        sx={{
          width: [SIDEBAR_FULL, sidebarWidth],
          minHeight: "100vh",
          bg: "sidebar",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 120,
          flexShrink: 0,
          transition: "width 0.22s ease, transform 0.25s ease",
          overflowX: "hidden",
          transform: [mobileOpen ? "translateX(0)" : `translateX(-${SIDEBAR_FULL}px)`, "translateX(0)"],
          boxShadow: ["2px 0 24px rgba(0,0,0,0.18)", "none"],
        }}
      >
        {/* Logo + desktop collapse toggle */}
        <Box sx={{ p: "20px 0 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
          <Flex
            sx={{
              alignItems: "center",
              px: collapsed ? 0 : "20px",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 2,
              color: "white",
              fontWeight: "bold",
              letterSpacing: "-0.3px",
              overflow: "hidden",
              transition: "padding 0.22s ease",
            }}
          >
            <Box sx={{ fontSize: 5, flexShrink: 0, lineHeight: 1 }}>🔷</Box>
            <Text
              sx={{
                fontSize: 5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                transition: "opacity 0.18s ease, width 0.22s ease",
              }}
            >
              nateeCRM
            </Text>
          </Flex>

          {/* Desktop collapse button */}
          <Box
            as="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            sx={{
              display: ["none", "flex"],
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: "-12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 24,
              height: 24,
              borderRadius: "circle",
              bg: "white",
              color: "sidebar",
              border: "2px solid",
              borderColor: "sidebar",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "bold",
              zIndex: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              transition: "transform 0.22s ease",
            }}
          >
            {collapsed ? "›" : "‹"}
          </Box>
        </Box>

        {/* Nav list */}
        <Box as="ul" sx={{ listStyle: "none", m: 0, p: "12px 8px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {/* Section label: Main */}
          {!collapsed && <Text sx={{ fontSize: 0, fontWeight: "bold", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", px: "12px", mb: 2, display: "block" }}>Menu</Text>}
          {mainNavItems.map(renderNavItem)}

          {/* Section label: System */}
          {!collapsed && <Text sx={{ fontSize: 0, fontWeight: "bold", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", px: "12px", mt: 5, mb: 2, display: "block" }}>Sistem</Text>}
          {collapsed && <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", my: 3 }} />}
          {systemNavItems.map(renderNavItem)}
        </Box>

        {/* Sidebar footer */}
        <Box sx={{ p: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <Flex sx={{ alignItems: "center", gap: collapsed ? 0 : 3, p: collapsed ? "8px 0" : "8px 8px", borderRadius: "md", justifyContent: collapsed ? "center" : "flex-start", transition: "padding 0.22s ease" }}>
            <Flex
              sx={{
                width: 32,
                height: 32,
                borderRadius: "circle",
                bg: "primary",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 0,
                flexShrink: 0,
              }}
            >
              AD
            </Flex>
            <Box
              sx={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
                overflow: "hidden",
                transition: "opacity 0.15s ease, width 0.22s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Text sx={{ color: "white", fontWeight: "bold", fontSize: 2, display: "block" }}>Admin User</Text>
              <Text sx={{ fontSize: 0, color: "sidebarText" }}>admin@nateecrm.com</Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Main wrapper */}
      <Box
        sx={{
          ml: [0, sidebarWidth],
          minHeight: "100vh",
          bg: "background",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          transition: "margin-left 0.22s ease",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <Flex
          as="header"
          sx={{
            bg: "white",
            borderBottom: "1px solid",
            borderColor: "border",
            px: [4, 8],
            py: 4,
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Flex sx={{ alignItems: "center", gap: 3 }}>
            {/* Mobile hamburger */}
            <Box
              as="button"
              onClick={() => setMobileOpen((o) => !o)}
              sx={{
                display: ["flex", "none"],
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "1px solid",
                borderColor: "border",
                borderRadius: "md",
                width: 36,
                height: 36,
                cursor: "pointer",
                fontSize: 4,
                color: "text",
                flexShrink: 0,
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </Box>
            <Text as="h1" sx={{ fontSize: [5, 7], fontWeight: "bold", color: "text", m: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </Text>
          </Flex>

          <Flex sx={{ alignItems: "center", gap: 3, flexShrink: 0 }}>
            <Box
              as="button"
              sx={{
                background: "none",
                border: "1px solid",
                borderColor: "border",
                borderRadius: "md",
                p: "6px 12px",
                fontSize: 2,
                color: "muted",
                cursor: "pointer",
              }}
            >
              🔔
            </Box>
            <Flex
              sx={{
                width: 36,
                height: 36,
                borderRadius: "circle",
                bg: "primary",
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 1,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              AD
            </Flex>
          </Flex>
        </Flex>

        {/* Page content */}
        <Box as="main" sx={{ p: [4, 8], flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout
