// src/pages/Register.jsx
import React, {useState} from 'react';
import axios from 'axios';
import './css/inscription.css'
import Toast from "./Toast.jsx";

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3012/auth/register', {username, password});
            setToastType("success")
            setToastMessage("Inscription réussie")
        } catch (error) {
            console.error(error);
            setToastType("error")
            setToastMessage("Une erreur s'est produite.")
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Inscription</h2>
                <input type="text" placeholder="Nom d'utilisateur" value={username}
                       onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Mot de passe" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">S'inscrire</button>
            </form>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </>
    );

}

export default SignupPage;
