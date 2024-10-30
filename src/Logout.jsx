import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('jwt');

        // Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth:"400px",
                margin:"20px auto", // Pour occuper toute la hauteur de la fenêtre
            }}
        >
            <Button
                variant="contained"
                onClick={handleLogout}
                sx={{ padding: '10px 20px', backgroundColor:"red" }}
            >
                Se déconnecter
            </Button>
        </Box>
    );
}

export default Logout;
