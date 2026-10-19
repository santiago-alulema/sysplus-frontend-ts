// src/componentesCommons/SidebarLayout.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  Tooltip,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import * as MuiIcons from "@mui/icons-material";

// ===== Types =====
export interface MenuItem {
  cod_menu: string;
  icon: string;
  link: string;
  grupo_permiso: string;
  nivel2: string;
}

interface SidebarLayoutProps {
  title?: string;
  userName?: string;
  menus: MenuItem[];
  drawerWidth?: number;

  /** Si true, dibuja un AppBar interno (normalmente lo dejaremos en false si usas un Navbar externo) */
  withAppBar?: boolean;

  /** Control externo del Drawer móvil (cuando withAppBar es false y controlas desde tu Navbar externo) */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

// ===== SYSPLUS palette (light-friendly) =====
const SYS_COLORS = {
  sidebarBg: "#14253c", // fondo sidebar
  sidebarText: "#ffffff", // texto sidebar
  sidebarTextDim: "rgba(228,236,247,0.68)",
  sidebarHover: "rgba(255,255,255,0.065)",
  sidebarSelected: "rgba(255,255,255,0.14)",
  appBarGrad: "linear-gradient(90deg, #14253c, #213b5a)", // fondo appbar
  appBarText: "#ffffff",
};

// ===== Helpers =====
const getIconByName = (name?: string) => {
  const fallback = (MuiIcons as any)["Checklist"] as React.ElementType;
  if (!name) return fallback;
  const Comp = (MuiIcons as any)[name];
  return Comp ?? fallback;
};

const normalizePath = (link: string) => (link?.startsWith("/") ? link : `/${link}`);

const groupBySection = (menus: MenuItem[]) =>
  (menus ?? []).reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item?.nivel2 || "GENERAL";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

// ===== Helpers (debajo de getIconByName) =====
const SECTION_ICON_POOL = [
  "Folder", "Widgets", "Apps", "Dashboard", "GridView", "Lan", "Inventory2",
  "Category", "Dns", "Hub", "BubbleChart", "CollectionsBookmark", "Insights",
  "Assignment", "ViewList", "ViewModule", "AutoAwesomeMosaic"
];

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getSectionIconComp = (section: string) => {
  const name = SECTION_ICON_POOL[hashString(section) % SECTION_ICON_POOL.length];
  const Icon = (MuiIcons as any)[name] as React.ElementType | undefined;
  return Icon;
};

export default function SidebarLayout({
  title = "SYSPLUS TI",
  userName = "Usuario",
  menus = [],
  drawerWidth = 270,
  withAppBar = false,
  mobileOpen: mobileOpenProp,
  onMobileOpenChange,
}: SidebarLayoutProps) {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const miniWidth = 64;

  const [mobileOpenUncontrolled, setMobileOpenUncontrolled] = useState(false);
  const mobileOpen = mobileOpenProp ?? mobileOpenUncontrolled;
  const setMobileOpen = useCallback(
    (open: boolean) => {
      if (onMobileOpenChange) onMobileOpenChange(open);
      else setMobileOpenUncontrolled(open);
    },
    [onMobileOpenChange]
  );
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const [hoverOpen, setHoverOpen] = useState(false);

  const sections = useMemo(() => groupBySection(menus), [menus]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      Object.entries(sections).forEach(([section, items]) => {
        if (next[section] === undefined) {
          next[section] = items.some((it) => location.pathname.startsWith(normalizePath(it.link)));
        }
      });
      return next;
    });
  }, [sections, location.pathname]);

  const toggleSection = (sec: string) =>
    setOpenSections((o) => ({ ...o, [sec]: !o[sec] }));

  const DrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h6" noWrap sx={{ color: SYS_COLORS.sidebarText, fontWeight: 700, fontSize: "1rem", letterSpacing: ".025em" }}>
          {title}
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" }, color: SYS_COLORS.sidebarText }}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.16)" }} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {Object.entries(sections).map(([section, items]) => {
          const isOpen = !!openSections[section];
          const isCompact = !hoverOpen;

          return (
            <List key={section} disablePadding>
              {hoverOpen && (
                <ListItemButton onClick={() => toggleSection(section)} sx={{ px: 2, mx: 1, my: .35, borderRadius: 1.5 }}>
                  <ListItemText
                    primary={section}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      sx: { color: SYS_COLORS.sidebarTextDim },
                    }}
                  />
                  {isOpen ? (
                    <ExpandLess htmlColor={SYS_COLORS.sidebarText} />
                  ) : (
                    <ExpandMore htmlColor={SYS_COLORS.sidebarText} />
                  )}
                </ListItemButton>
              )}

              {hoverOpen ? (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {items.map((item) => {
                      const Icon = getIconByName(item.icon);
                      const to = normalizePath(item.link);
                      const selected = location.pathname.startsWith(to);

                      return (
                        <ListItemButton
                          key={`${section}-${item.cod_menu}`}
                          component={Link}
                          to={to}
                          selected={selected}
                          sx={{
                            pl: isCompact ? 1 : 5,
                            mx: 1,
                            my: .2,
                            borderRadius: 1.5,
                            minHeight: 42,
                            pr: isCompact ? 1 : 2,
                            "&.Mui-selected": { bgcolor: SYS_COLORS.sidebarSelected },
                            "&:hover": { bgcolor: SYS_COLORS.sidebarHover },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: isCompact ? 0 : 20,
                              mr: isCompact ? 0 : 1,
                              justifyContent: "center",
                              color: "inherit",
                            }}
                          >
                            <Icon sx={{ fontSize: '18px' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.cod_menu}
                            secondary={item.grupo_permiso}
                            primaryTypographyProps={{ sx: { color: SYS_COLORS.sidebarText, fontSize: '13px' } }}
                            secondaryTypographyProps={{ sx: { color: SYS_COLORS.sidebarTextDim, fontSize: '10px' } }}
                            sx={{
                              opacity: isCompact ? 0 : 1,
                              visibility: isCompact ? "hidden" : "visible",

                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              ) : (
                <List dense>
                  {(() => {
                    const SectionIcon = getSectionIconComp(section);
                    const handleOpenSection = () => {
                      setHoverOpen(true);
                      setOpenSections(o => ({ ...o, [section]: true }));
                    };

                    return (
                      <Tooltip key={`sec-${section}`} title={section} placement="right">
                        <ListItemButton
                          onClick={handleOpenSection}
                          sx={{
                            px: 1,
                            mx: .8,
                            my: .25,
                            borderRadius: 1.5,
                            justifyContent: "center",
                            "&:hover": { bgcolor: SYS_COLORS.sidebarHover },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", color: "inherit" }}>
                            {SectionIcon ? (
                              <SectionIcon fontSize="small" />
                            ) : (
                              // Si por alguna razón falla el ícono, muestra la inicial
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  display: "grid",
                                  placeItems: "center",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  bgcolor: "rgba(255,255,255,0.16)",
                                  color: SYS_COLORS.sidebarText,
                                }}
                                aria-hidden
                              >
                                {section?.[0]?.toUpperCase() ?? "?"}
                              </Box>
                            )}
                          </ListItemIcon>
                        </ListItemButton>
                      </Tooltip>
                    );
                  })()}
                </List>
              )}
            </List>
          );
        })}
      </Box>

      {/* Footer opcional con usuario */}
      {/* <Divider sx={{ borderColor: "rgba(255,255,255,0.16)" }} />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: SYS_COLORS.sidebarTextDim,
            opacity: hoverOpen ? 1 : 0,
            visibility: hoverOpen ? "visible" : "hidden",
          }}
        >
          Sesión: <strong style={{ color: SYS_COLORS.sidebarText }}>{userName}</strong>
        </Typography>
      </Box> */}
    </Box>
  );

  // Render principal
  return (
    <Box
      sx={{
        display: "flex",
        // Mantén el nav al tamaño dinámico para que el main pueda calcular su ancho si lo necesitas
        width: { md: (hoverOpen ? drawerWidth : miniWidth) },
        flexShrink: { md: 0 },
      }}
      onMouseEnter={() => isDesktop && setHoverOpen(true)}
      onMouseLeave={() => isDesktop && setHoverOpen(false)}
    >
      <CssBaseline />

      {/* AppBar opcional (si no usas Navbar externo) */}
      {withAppBar && (
        <AppBar
          position="fixed"
          elevation={1}
          color="transparent"
          sx={{
            zIndex: (t) => t.zIndex.drawer + 1,
            background: SYS_COLORS.appBarGrad,
            color: SYS_COLORS.appBarText,
            backgroundImage: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ color: SYS_COLORS.appBarText }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer móvil (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: SYS_COLORS.sidebarBg,
            color: SYS_COLORS.sidebarText,
          },
          "& .MuiListItemIcon-root": { color: "inherit" },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Drawer desktop (permanente mini-variant) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: { md: hoverOpen ? drawerWidth : miniWidth },
            transition: (t) =>
              t.transitions.create("width", {
                easing: t.transitions.easing.sharp,
                duration: t.transitions.duration.leavingScreen,
              }),
            background: "linear-gradient(180deg, #0a192f 80%, rgb(22, 39, 85) 95%)",
            color: SYS_COLORS.sidebarText,
            borderRight: 0,
          },
          "& .MuiListItemIcon-root": {
            color: "inherit",
            minWidth: 0,
            justifyContent: "center",
          },
          "& .MuiListItemButton-root.Mui-selected": {
            bgcolor: SYS_COLORS.sidebarSelected,
          },
          "& .MuiListItemButton-root:hover": {
            bgcolor: SYS_COLORS.sidebarHover,
          },
        }}
      >
        {DrawerContent}
      </Drawer>
    </Box>
  );
}
