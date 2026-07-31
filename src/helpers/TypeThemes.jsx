// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e3a8a", 
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0a192f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb", 
      paper: "#ffffff",   
    },
    text: {
      primary: "#0f172a", 
      secondary: "#475569",
    },
  },
  
  typography: {
    fontFamily: ["'Roboto'", "'Segoe UI'", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 700, fontSize: "2.2rem", color: "#0a192f" },
    h2: { fontWeight: 600, fontSize: "1.8rem", color: "#1e3a8a" },
    body1: { fontSize: "1rem", color: "#475569" },
    
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 20px",
          background: "linear-gradient(90deg, #1e3a8a, #0a192f)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(90deg, #0a192f, #1e3a8a)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
            borderBottomLeftRadius: '5px',
            
            borderBottomRightRadius: '5px',
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        },
      },
    },
    
  },
});

export default theme;
