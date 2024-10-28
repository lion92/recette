import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../src/css/menu.css'
function Menu() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Fonction pour ouvrir/fermer le menu drawer
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Connexion', to: '/login' },
        { text: 'Inscription', to: '/signup' },
        { text: 'Catégorie de Recette', to: '/addCategory' },
        { text: 'Ingrédient', to: '/addIngredient' },
        { text: 'Recettes', to: '/' },
        { text: 'Créer une Recette', to: '/createRecette' },
        { text: 'Profil', to: '/profil' },
        { text: 'Déconnexion', to: '/logout' },
    ];

    const drawerList = () => (
        <Box
            sx={{width: 250}}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >

            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} component={Link} to={item.to}>
                        <ListItemText primary={item.text}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <AppBar position="static" color="primary">
                <div className="menu-logo">
                    <img src="../src/asset/images/logo.png" alt="Just Recipes Logo" className="logo-image"/>
                </div>
                <Toolbar>
                    {/* Icone du menu pour les petits écrans */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{display: {xs: 'block', md: 'none'}}}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>

                    {/* Menu pour les grands écrans */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        flexGrow={1}
                        sx={{display: {xs: 'none', md: 'flex', marginTop: "50px"}}}
                    >
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                color="inherit"
                                component={Link}
                                to={item.to}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer pour les petits écrans */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerList()}
            </Drawer>
        </div>
    );
}

export default Menu;
