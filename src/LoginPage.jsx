// LoginPage.jsx
import React, { useState, useEffect } from 'react';
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
    const [isAnimating, setIsAnimating] = useState(false); // État pour lancer l'animation de sortie
    const [isFirstLoad, setIsFirstLoad] = useState(true); // État pour la rotation au chargement
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
            setTimeout(() => navigate('/recipes'), 1000);

        } catch (error) {
            console.error('Erreur de connexion:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            setToastType('error');
            setToastMessage(errorMessage);
        }
    };

    // Animation de déplacement de l'écran, stabilisation, puis rotation
    const animationVariants = {
        initial: { x: '-100vh', y: '-100vh', scale: 1 },
        moveOut: {
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 0, 100, 0],
            transition: { duration: 2, ease: 'easeInOut' },
        },
        moveAround: {
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 0, 100, 0],
            transition: { duration: 2, ease: 'easeInOut' },
        },
        stabilize: {
            x: 0,
            y: 0,
            transition: { duration: 0.5 },
        },
        rotate: {
            rotate: 360,
            transition: { duration: 1, ease: 'easeInOut' },
        },
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ maxWidth: '400px', margin: 'auto', marginTop: 10 }}
        >
            <motion.div
                initial="initial"
                animate={isFirstLoad ? ["moveAround", "stabilize", "rotate"] : ""}
                variants={animationVariants}
                style={{ width: '100%', maxWidth: 400 }}
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
            </motion.div>
        </Box>
    );
}

export default LoginPage;
