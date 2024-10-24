import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import Toast from './Toast.jsx';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3012/auth/register', { username, password });
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
            sx={{ height: '100vh' }}
        >
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, backgroundColor:"white", textAlign:"center", padding:"10px"}}>
                <Typography variant="h4" gutterBottom>
                    Inscription
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
