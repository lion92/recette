// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';
import { motion } from 'framer-motion'; // Import Framer Motion

const API_BASE_URL = 'http://localhost:3007'; // Définir la constante pour l'URL de base

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isAnimating, setIsAnimating] = useState(false); // État pour lancer l'animation
    const navigate = useNavigate();

    // Fonction pour valider l'email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(username)) {
            setToastType('error');
            setToastMessage('Veuillez entrer un email valide');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            const { jwt, message } = res.data;

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', jwt);

            setToastType('success');
            setToastMessage(message || 'Connexion réussie');

            // Démarre l'animation avant la redirection
            setIsAnimating(true);
            setTimeout(() => navigate('/recipes'), 1000); // Redirige après l'animation

        } catch (error) {
            console.error('Erreur de connexion:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            setToastType('error');
            setToastMessage(errorMessage);
        }
    };

    // Animation pour la page de login
    const pageVariants = {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 0, y: -50, transition: { duration: 1 } },
    };

    return (
        <motion.div
            initial="initial"
            animate={isAnimating ? "animate" : "initial"}
            variants={pageVariants}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ maxWidth: '400px', margin: 'auto', marginTop: 10 }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        width: '100%',
                        maxWidth: 400,
                        backgroundColor: 'white',
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Connexion
                    </Typography>
                    <TextField
                        label="Email"
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
        </motion.div>
    );
}

export default LoginPage;
