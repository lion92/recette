import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../src/css/profil.css'; // Importer les styles pour le profil

function Profil() {
    const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
    const [loading, setLoading] = useState(true); // État pour gérer le chargement
    const [error, setError] = useState(null); // État pour gérer les erreurs

    useEffect(() => {
        // Récupérer le token JWT depuis le localStorage
        const token = localStorage.getItem('jwt');

        if (!token) {
            setError('Token JWT manquant. Veuillez vous connecter.');
            setLoading(false);
            return;
        }

        // Récupérer les informations de l'utilisateur à partir de l'API
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3012/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data); // Mettre à jour l'état avec les informations utilisateur
                setLoading(false); // Fin du chargement
            } catch (error) {
                setError('Erreur lors de la récupération des informations utilisateur.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []); // Le tableau vide signifie que l'effet est exécuté seulement lors du montage du composant

    if (loading) {
        return <p>Chargement des informations utilisateur...</p>;
    }

    if (error) {
        return <p>{error}</p>; // Afficher l'erreur s'il y en a une
    }

    if (!user) {
        return <p>Utilisateur non trouvé</p>;
    }

    return (
        <div className="profil-container">
            <p>Nom : {user.username}</p>
        </div>
    );
}

export default Profil;
