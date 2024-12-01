// Menu.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import IngredientIcon from '@mui/icons-material/Restaurant';
import RecipeIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import '../src/css/menu.css';
import {Verified} from "@mui/icons-material";

function Menu() {
    const [menuOpen, setMenuOpen] = useState(true); // Menu ouvert par défaut
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const navigate = useNavigate();

    // Vérifiez si l'utilisateur est authentifié en utilisant le token
    const isAuthenticated = !!localStorage.getItem('jwt');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem('jwt'); // Supprimer le token du localStorage
        navigate('/'); // Rediriger vers la page de connexion
    };

    // Liste des items de menu avec texte et icônes, en fonction de l'authentification
    const menuItems = isAuthenticated
        ? [
            { text: 'Recettes', to: '/recipe', icon: <RecipeIcon /> },
            { text: 'Créer une Recette', to: '/createRecette', icon: <CreateIcon /> },
            { text: 'Catégorie de Recette', to: '/addCategory', icon: <CategoryIcon /> },
            { text: 'Ingrédient', to: '/addIngredient', icon: <IngredientIcon /> },
            { text: 'Profil', to: '/profil', icon: <ProfileIcon /> },
            { text: 'Calendar', to: '/calendarRecipe', icon: <ProfileIcon /> },
            {
                text: 'Déconnexion',
                to: '/',
                icon: <LogoutIcon />,
                action: handleLogout,
            },
        ]
        : [
            { text: 'Connexion', to: '/', icon: <LoginIcon /> },
            { text: 'Inscription', to: '/signup', icon: <PersonAddIcon /> },
        ];

    const drawerList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((item) =>
                    item.action ? (
                        <ListItem button key={item.text} onClick={item.action}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ) : (
                        <ListItem button key={item.text} component={Link} to={item.to}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" color="primary" style={{ padding: '0px' }}>
                <h1 className="titreSite" style={{ margin: 'auto', padding: '0px' }}>
                    www.recette.krissclotilde.com
                </h1>
                <Toolbar style={{ justifyContent: 'space-between', padding: '0px' }}>
                    {isMobile && (
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}

                    {!isMobile && (
                        <IconButton
                            className="menu-logo"
                            color="inherit"
                            aria-label="toggle menu"
                            onClick={toggleMenu}
                            sx={{ fontSize: '2rem', margin: 'auto' }}
                        >
                            {menuOpen ? (
                                <ArrowDropUpIcon fontSize="inherit" />
                            ) : (
                                <ArrowDropDownIcon fontSize="inherit" />
                            )}
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {!isMobile && (
                <Collapse in={menuOpen} timeout="auto" unmountOnExit>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor="primary.main"
                        sx={{ padding: 0, width: '100%' }}
                    >
                        {menuItems.map((item) =>
                            item.action ? (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    onClick={item.action}
                                    startIcon={item.icon}
                                    sx={{ color: 'white', marginX: 1 }}
                                >
                                    {item.text}
                                </Button>
                            ) : (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    component={Link}
                                    to={item.to}
                                    startIcon={item.icon}
                                    sx={{ color: 'white', marginX: 1 }}
                                >
                                    {item.text}
                                </Button>
                            )
                        )}
                    </Box>
                </Collapse>
            )}

            {isMobile && (
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {drawerList()}
                </Drawer>
            )}
        </>
    );
}

export default Menu;
