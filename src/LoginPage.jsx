import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3012/auth/login', { username, password });
            const token = res.data.jwt;

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', token);

            setToastType('success');
            setToastMessage('Connexion réussie');

            navigate('/recipes');  // Rediriger vers la page des recettes après la connexion
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
            sx={{     maxWidth:"400px",
                margin:"20px auto",}}
        >
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, backgroundColor:"white", textAlign:"center", padding:"10px"}}>
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
