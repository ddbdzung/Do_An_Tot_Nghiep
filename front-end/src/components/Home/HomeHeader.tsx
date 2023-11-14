import {
  AppBar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { randomUUID } from 'crypto';

const pages = ['Home', 'Shop', 'Products', 'Blog', 'Pages', 'Contact'];
const headerIcons = [{ icon: AccountCircleIcon }];

export default function HomeHeader() {
  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{ backgroundColor: 'background.paper', padding: '1rem 0' }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'black',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              {pages.map(page => (
                <Button
                  key={page}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <List sx={{ display: 'flex' }}>
                {headerIcons.map(({ text, icon: Icon }) => (
                  <ListItem key={randomUUID()} disablePadding>
                    <ListItemButton
                      sx={{ '&:hover': { background: 'transparent' } }}
                    >
                      <Box sx={{ color: 'black', opacity: '70%', padding: 0 }}>
                        <Icon fontSize="large" />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
