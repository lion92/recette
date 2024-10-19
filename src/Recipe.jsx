import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from './RecipeList.jsx';
import './css/recette.css';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get('http://localhost:3012/recipes/all');
                setRecipes(res.data);
            } catch (err) {
                setError('Erreur lors de la récupération des recettes');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    if (loading) {
        return <p>Chargement des recettes...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="recipes-container">
            <h2>Liste des recettes</h2>
            {recipes.length > 0 ? (
                <RecipeList recipes={recipes} />
            ) : (
                <p>Aucune recette disponible</p>
            )}
        </div>
    );
}

export default Recipes;
