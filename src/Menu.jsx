import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);

    // Fonction pour basculer l'état d'ouverture du menu déroulant
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
        <>
        
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', width: '100%' }}>
           
                {/* Barre d'application avec l'icône pour dérouler/enrouler */}
                <AppBar position="static" color="primary">
                
         
               <Toolbar style={{ justifyContent: 'center' }}>
       
                <IconButton className='menu-logo'
                            color="inherit"
                            aria-label="toggle menu"
                            onClick={toggleMenu}
                            sx={{ fontSize: '2rem' }}  // Agrandit l'icône
                        > 
                            {menuOpen ? <ArrowDropUpIcon fontSize="inherit" /> : <ArrowDropDownIcon fontSize="inherit" />}
                           
                        </IconButton>

            
             </Toolbar>
                </AppBar>

                {/* Menu déroulant avec animation en ligne */}
                <Collapse in={menuOpen} timeout="auto" unmountOnExit >
                    <Box
                        display="flex"
                        flexDirection="row" // Menu aligné en ligne
                        justifyContent="center"
                        alignItems="left"
                        bgcolor="primary.main"
                        sx={{ padding: 2, width: '100%' }}  // Largeur à 100%

                    >

                    
                        {/* Boutons de menu */}
                        {menuItems.map((item) => (
                            <Button
                         
                                key={item.text}
                          
                                
                                color="inherit"
                                component={Link}
                                to={item.to}
                                onClick={toggleMenu} // Ferme le menu au clic
                                sx={{ color: 'white', marginX: 1 }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                </Collapse>
            </div>
        </>
    );
}

export default Menu;
