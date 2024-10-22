import React from 'react';
import { Link } from 'react-router-dom';
import './css/menu.css'
function Menu() {
    return (
        <nav>
            <ul className="menu">
                <li>
                    <ul>
                        <li>
                            <Link to="/login">Connexion</Link>
                        </li>
                        <li>
                            <Link to="/signup">Inscription</Link>
                        </li>
                    </ul>

                </li>
                <li>
                    <ul>
                        <li>
                            <Link to="/addCategory">Categorie de Recette</Link>
                        </li>
                        <li>
                            <Link to="/addIngredient">Ingredient</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li>
                            <Link to="/">Recettes</Link>
                        </li>
                        <li>
                            <Link to="/createRecette">Créer une recette</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul>
                        <li>
                            <Link to="/profil">Profil</Link>
                        </li>
                        <li>
                            <Link to="/logout">Deconnexion</Link>
                        </li>
                    </ul>
                </li>


            </ul>
        </nav>
    );
}

export default Menu;
