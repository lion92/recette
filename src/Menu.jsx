import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login'; // Exemple d'icône
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import IngredientIcon from '@mui/icons-material/Restaurant';
import RecipeIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import '../src/css/menu.css';

function Menu() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Fonction pour ouvrir/fermer le menu drawer
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Liste des items avec texte et icônes
    const menuItems = [
        { text: 'Connexion', to: '/login', icon: <LoginIcon /> },
        { text: 'Inscription', to: '/signup', icon: <PersonAddIcon /> },
        { text: 'Catégorie de Recette', to: '/addCategory', icon: <CategoryIcon /> },
        { text: 'Ingrédient', to: '/addIngredient', icon: <IngredientIcon /> },
        { text: 'Recettes', to: '/', icon: <RecipeIcon /> },
        { text: 'Créer une Recette', to: '/createRecette', icon: <CreateIcon /> },
        { text: 'Profil', to: '/profil', icon: <ProfileIcon /> },
        { text: 'Déconnexion', to: '/logout', icon: <LogoutIcon /> },
    ];

    const drawerList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} component={Link} to={item.to}>
                        <ListItemIcon>{item.icon}</ListItemIcon> {/* Ajoutez l'icône ici */}
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <AppBar position="static" color="primary" sx={{background:'none'}}>
                <div className="menu-logo"></div>
                <Toolbar>
                    {/* Icône du menu pour les petits écrans */}
                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: 'block', md: 'none' } }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Menu pour les grands écrans */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        flexGrow={1}
                        sx={{ display: { xs: 'none', md: 'flex', marginTop: '50px' } }}
                    >
                        {menuItems.map((item) => (
                            <Button
                                key={item.text}
                                color="inherit"
                                component={Link}
                                to={item.to}
                                startIcon={item.icon} // Ajoutez l'icône ici
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer pour les petits écrans */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList()}
            </Drawer>
        </div>
    );
}

export default Menu;
