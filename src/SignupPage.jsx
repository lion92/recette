import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';

const API_BASE_URL = 'http://localhost:3007'; // URL de base pour l'API

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

        // Vérifier que l'email n'est pas vide
        if (!email) {
            setToastType('error');
            setToastMessage("L'email ne peut pas être vide");
            return;
        }

        // Vérifier que l'email est valide
        if (!isValidEmail(email)) {
            setToastType('error');
            setToastMessage('Veuillez entrer un email valide');
            return;
        }

        // Vérifier que le mot de passe n'est pas vide
        if (!password) {
            setToastType('error');
            setToastMessage('Le mot de passe ne peut pas être vide');
            return;
        }

        try {
            // Envoyer la requête de création de compte
            await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
            setToastType('success');
            setToastMessage('Inscription réussie. Veuillez vérifier votre email pour activer votre compte.');
        } catch (error) {
            console.error(error);

            // Gérer les erreurs spécifiques
            if (error.response && error.response.data && error.response.data.message) {
                setToastType('error');
                setToastMessage(error.response.data.message);
            } else {
                setToastType('error');
                setToastMessage("Une erreur s'est produite.");
            }
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
