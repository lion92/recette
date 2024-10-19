import React, { useState } from 'react';
import '../src/css/inscription.css'
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
        // Ajoutez ici la logique pour gérer la connexion
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Entrez votre email"
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Entrez votre mot de passe"
                    />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
}

export default LoginPage;
