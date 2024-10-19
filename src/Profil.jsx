import React from 'react';
import '../src/css/profil.css'; // Importer les styles pour le profil

function Profil() {
    const utilisateur = {
        nom: 'John Doe',
        email: 'johndoe@example.com',
        avatar: 'https://via.placeholder.com/150', // Image de profil fictive
    };

    return (
        <div className="profil-container">
            <img className="profil-avatar" src={utilisateur.avatar} alt="Avatar de profil" />
            <h2>{utilisateur.nom}</h2>
            <p>Email : {utilisateur.email}</p>
        </div>
    );
}

export default Profil;
