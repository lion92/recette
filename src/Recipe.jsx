import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/recette.css'
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
        <div>
            <h2>Liste des recettes</h2>
            {recipes.length > 0 ? (
                <ul>
                    {recipes.map((recipe) => (
                        <li>
                            <h3>ID recette:{recipe?.id}</h3>
                            <h3>Titre:{recipe?.title}</h3>
                            <h3>Description:{recipe?.description}</h3>
                            <h3>Ingredient:{recipe?.ingredients}</h3>
                            <h3>Instructions:{recipe?.instructions}</h3>
                            <h3>Publication:{""+recipe?.isPublished}</h3>
                            <h3>User id:{""+recipe?.user.id}</h3>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune recette disponible</p>
            )}
        </div>
    );
}

export default Recipes;
