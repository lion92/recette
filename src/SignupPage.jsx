// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './css/inscription.css'
function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3012/auth/register', { username, password });
            alert('Inscription réussie');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default SignupPage;
