import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';
import HomePage from "./HomePage.jsx";

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // Définir la constante pour l'URL de base

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            const token = res.data.jwt;

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', token);

            setToastType('success');
            setToastMessage('Connexion réussie');
            navigate('/recipes'); // Rediriger vers la page des recettes après la connexion
        } catch (error) {
            console.error(error);
            setToastType('error');
            setToastMessage('Erreur lors de la connexion');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ maxWidth: "400px", margin:"auto", marginTop:10}}
        >
            <HomePage></HomePage>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, backgroundColor: "white", textAlign: "center", padding: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Connexion
                </Typography>
                <TextField
                    label="Nom d'utilisateur"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Se connecter
                </Button>
            </form>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default LoginPage;
