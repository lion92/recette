import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // URL de base pour l'API

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
                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data); // Mettre à jour l'état avec les informations utilisateur
                setLoading(false); // Fin du chargement
            } catch (error) {
                setError(
                    error.response?.data?.message || 'Erreur lors de la récupération des informations utilisateur.'
                );
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []); // Exécuté seulement lors du montage du composant

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Chargement des informations utilisateur...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6">Utilisateur non trouvé</Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                p: 2,
                maxWidth: "400px",
                margin: "20px auto",
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                            {user.email.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={user.email}
                    subheader="Utilisateur enregistré"
                />
                <CardContent>
                    <Typography variant="body1">
                        Bienvenue, {user.email}! Vous êtes maintenant connecté à votre profil.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Profil;
