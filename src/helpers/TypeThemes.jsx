import { createTheme } from "@mui/material/styles";

// Tema visual corporativo. No modifica lógica ni comportamiento.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#253F65", light: "#E8EEF6", dark: "#172D4B", contrastText: "#FFFFFF" },
    secondary: { main: "#52677F", contrastText: "#FFFFFF" },
    background: { default: "#8aafe5", paper: "#FFFFFF" },
    text: { primary: "#1D2B3A", secondary: "#637185" },
    divider: "#E6EAF0",
    action: { hover: "rgba(37,63,101,.045)", selected: "rgba(37,63,101,.085)" },
  },
  shape: { borderRadius: 10 },
  MuiSelect: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      select: {
        fontSize: "13px",
        padding: "8px 12px",
        minHeight: "20px",
      },
      icon: {
        fontSize: "19px",
      },
    },
  },

  MuiAutocomplete: {
    styleOverrides: {
      root: {
        "& .MuiAutocomplete-inputRoot": {
          height: "36px !important",
          minHeight: "45px !important",
          padding: "0 8px !important",
        },
        "& .MuiAutocomplete-input": {
          padding: "0 4px !important",
          fontSize: "13px",
        },
        "& .MuiInputLabel-root": {
          fontSize: "12px",
          top: "7px",
        },
        "& .MuiInputLabel-shrink": {
          top: 0,
        },
      },
    },
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-.035em", color: "#172D4B" },
    h2: { fontWeight: 700, fontSize: "1.65rem", letterSpacing: "-.025em", color: "#172D4B" },
    h3: { fontWeight: 650, fontSize: "1.35rem", color: "#1D2B3A" },
    h4: { fontWeight: 650, fontSize: "1.15rem", color: "#1D2B3A" },
    h5: { fontWeight: 650, fontSize: "1.05rem", color: "#1D2B3A" },
    h6: { fontWeight: 650, fontSize: ".98rem", color: "#1D2B3A" },
    subtitle1: { fontWeight: 600, color: "#26384E" },
    body1: { fontSize: ".925rem", lineHeight: 1.55 },
    body2: { fontSize: ".85rem", lineHeight: 1.5 },
    button: { backgroundColor: "#457dd3", fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: "#F5F7FA" } } },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 9,
          padding: "8px 16px",
          minHeight: 36,
          fontWeight: 600,
          color: "#FFFFFF",
          backgroundColor: "#457DD3",
          boxShadow: "none",
          textTransform: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#3568B5",
            color: "#FFFFFF",
            boxShadow: "0 3px 10px rgba(37, 63, 101, 0.15)",
          },
        },
        containedPrimary: {
          backgroundColor: "#457DD3",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#3568B5",
            color: "#FFFFFF",
          },
        },
        containedSecondary: {
          backgroundColor: "#52677F",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#3D516A",
            color: "#FFFFFF",
          },
        },
        outlined: {
          backgroundColor: "#52677F",
          color: "#253F65",
          borderColor: "#CBD5E1",
          "&:hover": {
            backgroundColor: "#729ed1",
            color: "#253F65",
            borderColor: "#253F65",
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" }, rounded: { borderRadius: 12 }, elevation1: { boxShadow: "0 2px 12px rgba(27,46,72,.055)" } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #E7EBF0", borderRadius: 12, boxShadow: "0 3px 14px rgba(27,46,72,.045)", backgroundImage: "none" } } },
    MuiCardHeader: { styleOverrides: { root: { padding: "18px 20px" }, title: { fontWeight: 650 } } },
    MuiCardContent: { styleOverrides: { root: { padding: 20, "&:last-child": { paddingBottom: 20 } } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 9, backgroundColor: "#FFFFFF", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D9E0E8" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9EAEC2" } }, input: { paddingTop: 11, paddingBottom: 11 } } },
    MuiInputLabel: { styleOverrides: { root: { color: "#637185" } } },
    MuiTableContainer: { styleOverrides: { root: { border: "1px solid #E2E8F0", borderRadius: 18 } } },
    MuiTableCell: { styleOverrides: { root: { borderBottom: "1px solid #EDF0F4", padding: "10px 14px", fontSize: ".825rem" }, head: { backgroundColor: "#FFFFFF", color: "#192D47", fontWeight: 700, fontSize: ".75rem", letterSpacing: ".025em" } } },
    MuiTableRow: { styleOverrides: { root: { "&.MuiTableRow-hover:hover": { backgroundColor: "#F7F9FC" } } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 14, boxShadow: "0 20px 70px rgba(15,33,58,.18)" } } },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, fontSize: "1.075rem", padding: "20px 24px 12px" } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 7, fontWeight: 600 } } },
    MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 } } },
    MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 600, minHeight: 44 } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 7, fontSize: ".75rem" } } },
  },
});

export default theme;
