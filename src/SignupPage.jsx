import React, { useState } from 'react';
import '../src/css/inscription.css'
function SignupPage() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Nom:", nom, "Prénom:", prenom, "Email:", email, "Date de naissance:", dateNaissance);
        // Ajoutez ici la logique pour gérer l'inscription
    };

    return (
        <div className="signup-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label>Nom :</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                        placeholder="Entrez votre nom"
                    />
                </div>
                <div className="form-group">
                    <label>Prénom :</label>
                    <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                        placeholder="Entrez votre prénom"
                    />
                </div>
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
                    <label>Date de naissance :</label>
                    <input
                        type="date"
                        value={dateNaissance}
                        onChange={(e) => setDateNaissance(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}

export default SignupPage;
