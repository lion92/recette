import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('jwt');

        // Rediriger vers la page de connexion
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Se déconnecter
        </button>
    );
}

export default Logout;
