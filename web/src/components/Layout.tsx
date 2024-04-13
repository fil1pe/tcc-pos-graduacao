import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import { deleteCookie } from 'cookies-next'

export function Layout({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pathname = usePathname() || ''
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BookMyLuck
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: isMobile ? 56 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isMobile ? 56 : 240,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={pathname === '/'}
                onClick={() => router.push('/')}
              >
                <ListItemIcon>
                  <RoomServiceIcon />
                </ListItemIcon>
                {!isMobile && <ListItemText primary="Reservas" />}
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={pathname === '/meus-dados/'}
                onClick={() => router.push('/meus-dados')}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                {!isMobile && <ListItemText primary="Meus dados" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  deleteCookie('user-token')
                  router.push('/login')
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                {!isMobile && <ListItemText primary="Sair" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
