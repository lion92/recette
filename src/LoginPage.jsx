// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import Toast from './Toast.jsx';
import { motion } from 'framer-motion';
import { API_BASE_URL } from './config/api.config.js';
import ValidatedTextField from './components/ValidatedTextField.jsx';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailValid || !isPasswordValid) {
            setToastType('error');
            setToastMessage('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            const { jwt, message } = res.data;

            localStorage.setItem('jwt', jwt);

            setToastType('success');
            setToastMessage(message || 'Connexion réussie');

            setIsFirstLoad(false);
            setIsAnimating(true);
            setTimeout(() => navigate('/recipes'), 2000);

        } catch (error) {
            console.error('Erreur de connexion:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            setToastType('error');
            setToastMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Variantes d'animation
    const animationVariants = {
        initial: { x: '-100vw', y: '-100vh', scale: 1 },
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
        stabilize2: {
            x: 0,
            y: 0,
            transition: { duration: 0 },
        },
        rotate: {
            rotate: 360,
            transition: { duration: 1, ease: 'easeInOut' },
        },
        exitAnimation: { opacity: 0, filter: 'blur(10px)', transition: { duration: 1.5 } },

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
                animate={
                    isFirstLoad ? ["moveAround", "stabilize", "rotate"]
                    : isAnimating ? ["stabilize2","exitAnimation"]
                    : "initial"
                }
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
                    <ValidatedTextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onValidation={(result) => setIsEmailValid(result.isValid)}
                        validateOnBlur={true}
                        required
                    />
                    <ValidatedTextField
                        type="password"
                        label="Mot de passe"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onValidation={(result) => setIsPasswordValid(result.isValid)}
                        showPasswordStrength={false}
                        validateOnBlur={true}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                                Connexion...
                            </>
                        ) : (
                            'Se connecter'
                        )}
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
