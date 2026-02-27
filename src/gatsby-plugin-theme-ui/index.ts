import type { Theme } from "theme-ui"

const theme: Theme = {
  colors: {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    primaryLight: "#EFF6FF",
    primaryMid: "#DBEAFE",
    text: "#1E293B",
    muted: "#64748B",
    background: "#F0F7FF",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    white: "#FFFFFF",
    sidebar: "#1E3A8A",
    sidebarText: "#BFDBFE",
    surface: "#F8FAFC",
    success: "#10B981",
    successLight: "#ECFDF5",
    successDark: "#065F46",
    warning: "#F59E0B",
    warningLight: "#FFFBEB",
    danger: "#EF4444",
    dangerLight: "#FEF2F2",
    dangerDark: "#991B1B",
    purple: "#8B5CF6",
    purpleLight: "#F5F3FF",
    sky: "#0EA5E9",
    skyLight: "#F0F9FF",
    orange: "#EA580C",
    orangeLight: "#FFF7ED",
    subtle: "#94A3B8",
  },
  fonts: {
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "inherit",
    monospace: "monospace",
  },
  // [11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32]
  fontSizes: [11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32],
  fontWeights: {
    body: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  // [0, 4, 8, 12, 16, 20, 24, 28, 32, 48]
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 48],
  radii: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    pill: "20px",
    circle: "50%",
  },
  shadows: {
    card: "0 1px 3px rgba(0,0,0,0.05)",
    sm: "0 1px 2px rgba(0,0,0,0.04)",
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2,
  },
  styles: {
    root: {
      fontFamily: "body",
      fontSize: 3,
      color: "text",
      backgroundColor: "background",
      margin: 0,
      padding: 0,
      boxSizing: "border-box" as const,
    },
  },
}

export default theme
