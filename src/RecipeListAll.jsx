import React from 'react';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";
import ReceipeItemAll from "./ReceipeItemAll.jsx";
import './css/listRecette.css';
const RecipeListAll = ({ recipesFromProps }) => {
    const { recipes, deleteRecipe } = useRecipeStore();

    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem('jwt'); // Récupérer le token JWT
        if (!token) {
            alert('Vous devez être connecté pour supprimer une recette.');
            return;
        }

        await deleteRecipe(recipeId, token);
        alert('Recette supprimée avec succès !');
    };

    return (
        <div>
            {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-item">
                    <ReceipeItemAll recipe={recipe} />
                    <button onClick={() => handleDelete(recipe.id)} className="delete-button">Supprimer</button>
                </div>
            ))}
        </div>
    );
};

export default RecipeListAll;
