/**
 * Design tokens currently used by the Vectroy light-mode interface.
 * Values mirror the CSS custom properties in app/globals.css.
 */
export const TOKENS = {
  colors: {
    background: "#ffffff",
    foreground: "#1d1d1f",
    muted: "#6e6e73",
    border: "rgba(0, 0, 0, 0.09)",
    primary: "#0072cc",
    primaryLight: "#eaf3fb",
    success: "#1cb721",
    warning: "#b05c00",
    error: "#c4261d",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    full: "9999px",
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
    },
  },
  shadows: {
    sm: "0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0,  0, 0, 0.05)",
    md: "0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)",
    lg: "0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 18px 40px -14px rgba(0, 0, 0, 0.16)",
  },
} as const;
