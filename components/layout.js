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
import { useTranslation } from 'react-i18next';
import i18n from '../api/i18n';

const getSidebarOptionLabel = id => i18n.t([`pages.${id}.title`, `${id}.name`, id]);

const sidebarItems = [
  {
    /** @TODO implement */
    label: getSidebarOptionLabel('map'),
    icon: <><Image src={`/images/icons/map.png`} alt={getSidebarOptionLabel('map')} width={24} height={24} /></>,
    link: `/map`,
  },
  {
    label: getSidebarOptionLabel('creatures'),
    icon: <><Image src={`/images/icons/fire-devil.png`} alt={getSidebarOptionLabel('creatures')} width={24} height={24} /></>,
    link: `/creatures`,
  },
  {
    label: getSidebarOptionLabel('npcs'),
    icon: <><Image src={`/images/icons/citizen.png`} alt={getSidebarOptionLabel('npcs')} width={24} height={24} /></>,
    link: `/npcs`,
  },
  {
    label: getSidebarOptionLabel('quests'),
    icon: <><Image src={`/images/icons/chest.png`} alt={getSidebarOptionLabel('quests')} width={24} height={24} /></>,
    link: `/quests`,
  },
  // {
  //   label: `Keys`,
  //   icon: <><Image src={`/images/icons/silver-key.png`} alt={'Keys'} width={24} height={24} /></>,
  //   link: `/keys`,
  // },
  // {
  //   label: `Books`,
  //   icon: <><Image src={`/images/icons/book.png`} alt={'Books'} width={24} height={24} /></>,
  //   link: `/books`,
  // },
  {}, // divider
  {
    label: getSidebarOptionLabel('weapons'),
    icon: <><Image src={`/images/icons/warlord-sword.png`} alt={getSidebarOptionLabel('weapons')} width={24} height={24} /></>,
    link: `/items?type=weapons`,
  },
  {
    label: getSidebarOptionLabel('wandsAndRods'),
    icon: <><Image src={`/images/icons/wand-of-inferno.png`} alt={getSidebarOptionLabel('wandsAndRods')} width={24} height={24} /></>,
    link: `/items?type=wands`,
  },
  {
    label: getSidebarOptionLabel('distanceWeapons'),
    icon: <><Image src={`/images/icons/bow.png`} alt={getSidebarOptionLabel('distanceWeapons')} width={24} height={24} /></>,
    link: `/items?type=distance`,
  },
  {}, // divider
  {
    label: getSidebarOptionLabel('shields'),
    icon: <><Image src={`/images/icons/blessed-shield.png`} alt={getSidebarOptionLabel('shields')} width={24} height={24} /></>,
    link: `/items?type=shields`,
  },
  {
    label: getSidebarOptionLabel('armorItems'),
    icon: <><Image src={`/images/icons/golden-armor.png`} alt={getSidebarOptionLabel('armorItems')} width={24} height={24} /></>,
    link: `/items?type=armors`,
  },
  {
    label: getSidebarOptionLabel('amulets'),
    icon: <><Image src={`/images/icons/ruby-amulet.png`} alt={getSidebarOptionLabel('amulets')} width={24} height={24} /></>,
    link: `/items?type=amulets`,
  },
  {
    label: getSidebarOptionLabel('rings'),
    icon: <><Image src={`/images/icons/ring-of-the-sky.png`} alt={getSidebarOptionLabel('rings')} width={24} height={24} /></>,
    link: `/items?type=rings`,
  },
  {}, // divider
  {
    /** @TODO implement */
    label: getSidebarOptionLabel('runes'),
    icon: <><Image src={`/images/icons/ultimate-healing-rune.png`} alt={getSidebarOptionLabel('runes')} width={24} height={24} /></>,
    link: `/items?type=runes`,
  },
  {
    label: getSidebarOptionLabel('spells'),
    icon: <><Image src={`/images/icons/spellbook.png`} alt={getSidebarOptionLabel('spells')} width={24} height={24} /></>,
    link: `/spells`,
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
  const { t } = useTranslation();

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
            {t('appTitle')}
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
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}