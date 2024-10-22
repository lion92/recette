// src/pages/Login.jsx
import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Toast from "./Toast.jsx";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3012/auth/login', {username, password});
            const token = res.data.jwt;

            // Stocker le token JWT dans le localStorage
            localStorage.setItem('jwt', token);

            setToastType("success")
            setToastMessage("Connexion réussie")

            navigate('/recipes');  // Rediriger vers la page des recettes après la connexion
        } catch (error) {
            console.error(error);
            setToastType("error")
            setToastMessage('Échec de la connexion')
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Connexion</h2>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Se connecter</button>
            </form>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </>
    );
}

export default LoginPage;
