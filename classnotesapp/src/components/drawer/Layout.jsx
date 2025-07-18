// components/Layout.jsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useThemeMode } from '@/theme/ThemeContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStudiedLessons } from '@/theme/StudiedLessonsContext';

const drawerWidth = 280;

const Layout = ({ children, sections = [], onOpenMobileNav }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme } = useThemeMode();
  const { studiedLessons, toggleStudied } = useStudiedLessons();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!onOpenMobileNav) return;
    onOpenMobileNav.current = () => setMobileOpen(true);
  }, [onOpenMobileNav]);

  const drawerContent = (
    <Box sx={{
      width: drawerWidth,
      backgroundColor: 'theme.background',
      height: '100vh',
    }}>
      <Box sx={{ height: '64px' }} />
      <List>
        {sections.map((sec, index) => {
          if (sec.type === "title") {
            return (
              <Box
                key={`title-${index}`}
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: "bold",
                  color: theme.drawerTitle,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                {sec.label}
              </Box>
            );
          }
          if (sec.type === "lesson") {
            const isStudied = studiedLessons.includes(sec.id);
            const isSelected = location.pathname === `/lesson/${sec.id}`;
            return (
              <ListItemButton
                key={`lesson-${sec.id}`}
                component={Link}
                to={`/lesson/${sec.id}`}
                selected={isSelected}
                sx={{
                  color: theme.drawerSection,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    color: theme.drawerTitle,
                  },
                  '&:hover': { color: theme.drawerTitle },
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={sec.label} />
                <IconButton
                  size="small"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStudied(String(sec.id));
                  }}
                  sx={{ ml: 1 }}
                  aria-label={isStudied ? 'Marcar como no estudiada' : 'Marcar como estudiada'}
                >
                  {isStudied
                    ? <CheckCircleIcon sx={{ color: theme.accent }} />
                    : <CheckCircleOutlineIcon sx={{ color: isSelected ? theme.accent : theme.border, opacity: isSelected ? 0.8 : 1 }} />}
                </IconButton>
              </ListItemButton>
            );
          }
          return null;
        })}
      </List>
      <Box sx={{ height: 100 }} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Primera columna: Nav Drawer */}
      {!isMobile && (
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            backgroundColor: theme.background,
            color: '#fff',
            overflowX: 'hidden',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1201,
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
          }}
        >
          {drawerContent}
        </Box>
      )}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ 
            keepMounted: true,
            disableScrollLock: false,
          }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: "85%",
              maxWidth: drawerWidth,
              backgroundColor: theme.background,
              color: theme.textPrimary,
              borderRight: `1px solid ${theme.border}`,
              boxShadow: "4px 0 20px rgba(0,0,0,0.5)",
              paddingTop: '64px',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ 
          flex: 1,
          p: isMobile ? 1 : 2, 
          pt: isMobile ? 8 : 2, // Más espacio arriba en móvil para el AppBar
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: theme.background,
          minHeight: "100vh",
          ml: !isMobile ? `${drawerWidth}px` : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
