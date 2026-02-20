import * as React from "react"
import { Link } from "gatsby"

interface LayoutProps {
  children: React.ReactNode
  currentPath: string
  title: string
}

const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#EFF6FF",
  primaryMid: "#DBEAFE",
  white: "#FFFFFF",
  bgPage: "#F0F7FF",
  textDark: "#1E293B",
  textMuted: "#64748B",
  border: "#CBD5E1",
  sidebarBg: "#1E3A8A",
  sidebarHover: "#1D4ED8",
  sidebarText: "#BFDBFE",
  sidebarActive: "#2563EB",
}

const navItems = [
  { label: "Dashboard", path: "/", icon: "⊞" },
  { label: "Contacts", path: "/contacts/", icon: "👥" },
  { label: "Deals", path: "/deals/", icon: "💼" },
  { label: "Activities", path: "/activities/", icon: "📋" },
]

const Layout: React.FC<LayoutProps> = ({ children, currentPath, title }) => {
  const [hovered, setHovered] = React.useState<string | null>(null)

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    minHeight: "100vh",
    backgroundColor: colors.sidebarBg,
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  }

  const logoAreaStyle: React.CSSProperties = {
    padding: "28px 24px 24px",
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
  }

  const logoStyle: React.CSSProperties = {
    color: colors.white,
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  }

  const navListStyle: React.CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: "16px 12px",
    flex: 1,
  }

  const mainWrapperStyle: React.CSSProperties = {
    marginLeft: 240,
    minHeight: "100vh",
    backgroundColor: colors.bgPage,
    display: "flex",
    flexDirection: "column",
  }

  const topBarStyle: React.CSSProperties = {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
  }

  const pageTitleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: colors.textDark,
    margin: 0,
  }

  const avatarStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: colors.primary,
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  }

  const contentStyle: React.CSSProperties = {
    padding: "32px",
    flex: 1,
  }

  const sidebarFooterStyle: React.CSSProperties = {
    padding: "16px 12px",
    borderTop: `1px solid rgba(255,255,255,0.1)`,
  }

  const footerUserStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 8,
    color: colors.sidebarText,
    fontSize: 13,
  }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <nav style={sidebarStyle}>
        <div style={logoAreaStyle}>
          <span style={logoStyle}>
            <span style={{ fontSize: 22 }}>🔷</span>
            NexusCRM
          </span>
        </div>

        <ul style={navListStyle}>
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path))
            const isHovered = hovered === item.path
            const navItemStyle: React.CSSProperties = {
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 4,
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? colors.white : colors.sidebarText,
              backgroundColor: isActive ? colors.sidebarActive : isHovered ? "rgba(255,255,255,0.08)" : "transparent",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }
            return (
              <li key={item.path} style={{ listStyle: "none" }}>
                <Link to={item.path} style={navItemStyle} onMouseEnter={() => setHovered(item.path)} onMouseLeave={() => setHovered(null)}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
                  {item.label}
                  {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#93C5FD" }} />}
                </Link>
              </li>
            )
          })}
        </ul>

        <div style={sidebarFooterStyle}>
          <div style={footerUserStyle}>
            <div style={{ ...avatarStyle, width: 32, height: 32, fontSize: 12, backgroundColor: colors.sidebarActive }}>AD</div>
            <div>
              <div style={{ color: colors.white, fontWeight: 600, fontSize: 13 }}>Admin User</div>
              <div style={{ fontSize: 11, color: colors.sidebarText }}>admin@nexuscrm.com</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div style={mainWrapperStyle}>
        <header style={topBarStyle}>
          <h1 style={pageTitleStyle}>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                background: "none",
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 13,
                color: colors.textMuted,
                cursor: "pointer",
              }}
            >
              🔔
            </button>
            <div style={avatarStyle}>AD</div>
          </div>
        </header>
        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
