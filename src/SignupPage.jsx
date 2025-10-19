import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import Toast from './Toast.jsx';
import { API_BASE_URL } from './config/api.config.js';
import ValidatedTextField from './components/ValidatedTextField.jsx';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailValid || !isPasswordValid) {
            setToastType('error');
            setToastMessage('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
            setToastType('success');
            setToastMessage('Inscription réussie. Veuillez vérifier votre email pour activer votre compte.');

            // Réinitialiser le formulaire
            setEmail('');
            setPassword('');
            setIsEmailValid(false);
            setIsPasswordValid(false);
        } catch (error) {
            console.error(error);

            if (error.response && error.response.data && error.response.data.message) {
                setToastType('error');
                setToastMessage(error.response.data.message);
            } else {
                setToastType('error');
                setToastMessage("Une erreur s'est produite.");
            }
        } finally {
            setIsLoading(false);
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
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, backgroundColor: "white", textAlign: "center", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <Typography variant="h4" gutterBottom>
                    Inscription
                </Typography>
                <ValidatedTextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onValidation={(result) => setIsEmailValid(result.isValid)}
                    validateOnBlur={true}
                    helperText="Vous recevrez un email de vérification"
                    required
                />
                <ValidatedTextField
                    type="password"
                    label="Mot de passe"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onValidation={(result) => setIsPasswordValid(result.isValid)}
                    showPasswordStrength={true}
                    validateOnBlur={false}
                    validationOptions={{ minLength: 6 }}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading || !isEmailValid || !isPasswordValid}
                    sx={{ mt: 2 }}
                >
                    {isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                            Inscription...
                        </>
                    ) : (
                        "S'inscrire"
                    )}
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
