import React from 'react';
import { Link } from 'react-router-dom';
import './css/menu.css'
function Menu() {
    return (
        <nav>
            <ul className="menu">
                <li>
                    <Link to="/login">Connexion</Link>
                </li>
                <li>
                    <Link to="/signup">Inscription</Link>
                </li>
                <li>
                    <Link to="/">Recettes</Link>
                </li>
                <li>
                    <Link to="/createRecette">Créer une recette</Link>
                </li>
                <li>
                    <Link to="/profil">Profil</Link>
                </li>


            </ul>
        </nav>
    );
}

export default Menu;
