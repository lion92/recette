import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

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
            height="100vh"
            sx={{ p: 2 }}
        >
            <Card sx={{ maxWidth: 400, width: '100%' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>
                            {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={user.username}
                    subheader="Utilisateur enregistré"
                />
                <CardContent>
                    <Typography variant="body1">
                        Bienvenue, {user.username}! Vous êtes maintenant connecté à votre profil.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Profil;
