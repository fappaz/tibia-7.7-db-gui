import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PageLink from "next/link";
import Image from 'next/image';

const sidebarItems = [
  {
    label: `Weapons`,
    icon: <><Image src={`/images/icons/warlord-sword.png`} alt={'Weapons'} width={24} height={24} /></>,
    link: `/items/weapons`,
  },
  {
    label: `Wands and Rods`,
    icon: <><Image src={`/images/icons/wand-of-inferno.png`} alt={'Wands and Rods'} width={24} height={24} /></>,
    link: `/items/wands`,
  },
  {
    label: `Distance weapons`,
    icon: <><Image src={`/images/icons/bow.png`} alt={'Distance weapons'} width={24} height={24} /></>,
    link: `/items/distance`,
  },
  {}, // divider
  {
    label: `Shields`,
    icon: <><Image src={`/images/icons/blessed-shield.png`} alt={'Shields'} width={24} height={24} /></>,
    link: `/items/shields`,
  },
  {
    label: `Helmets`,
    icon: <><Image src={`/images/icons/golden-helmet.png`} alt={'Helmets'} width={24} height={24} /></>,
    link: `/items/helmets`,
  },
  {
    label: `Armors`,
    icon: <><Image src={`/images/icons/golden-armor.png`} alt={'Armors'} width={24} height={24} /></>,
    link: `/items/armors`,
  },
  {
    label: `Legs`,
    icon: <><Image src={`/images/icons/golden-legs.png`} alt={'Legs'} width={24} height={24} /></>,
    link: `/items/legs`,
  },
  {
    label: `Boots`,
    icon: <><Image src={`/images/icons/boots-of-haste.png`} alt={'Boots'} width={24} height={24} /></>,
    link: `/items/boots`,
  },
  {
    label: `Amulets`,
    icon: <><Image src={`/images/icons/ruby-amulet.png`} alt={'Amulets'} width={24} height={24} /></>,
    link: `/items/amulets`,
  },
  {
    label: `Rings`,
    icon: <><Image src={`/images/icons/ring-of-the-sky.png`} alt={'Rings'} width={24} height={24} /></>,
    link: `/items/rings`,
  },
  {}, // divider
  {
    label: `Creatures`,
    icon: <><Image src={`/images/icons/fire-devil.png`} alt={'Creatures'} width={24} height={24} /></>,
    link: `/creatures`,
  },
  {
    label: `NPCs`,
    icon: <><Image src={`/images/icons/citizen.png`} alt={'NPCs'} width={24} height={24} /></>,
    link: `/npcs`,
  },
  {}, // divider
];
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Layout({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Tibia 7.7 database
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sidebarItems.map((sidebarItem, index) => (
            <ListItem key={`sidebar-item-${index}`} disablePadding sx={{ display: 'block' }}>
              {
                sidebarItem.label ? (
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    {...(
                      sidebarItem.link ? {
                        component: PageLink,
                        href: sidebarItem.link,
                      } : {}
                    )}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {sidebarItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={sidebarItem.label} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                ) : (
                  <Divider />
                )
              }

            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}