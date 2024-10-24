import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('jwt');

        // Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ margin: '20px', padding: '10px 20px' }}
        >
            Se déconnecter
        </Button>
    );
}

export default Logout;
