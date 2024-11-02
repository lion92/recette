import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // URL de base pour l'API

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    // Fonction pour valider l'email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que l'email est valide
        if (!isValidEmail(email)) {
            setToastType('error');
            setToastMessage('Veuillez entrer un email valide');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
            setToastType('success');
            setToastMessage('Inscription réussie');
        } catch (error) {
            console.error(error);
            setToastType('error');
            setToastMessage("Une erreur s'est produite.");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ maxWidth: "400px", margin: "auto", marginTop: 10 }}
        >
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, backgroundColor: "white", textAlign: "center", padding: "10px" }}>
                <Typography variant="h4" gutterBottom>
                    Inscription
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    S'inscrire
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

export default SignupPage;
