import React from 'react';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";
import ReceipeItemAll from "./ReceipeItemAll.jsx";

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
        <ul className="recipe-list">
            {recipes.map((recipe) => (
                    <>
                        <button onClick={() => handleDelete(recipe.id)}>Supprimer</button>
                        <ReceipeItemAll key={recipe.id} recipe={recipe}/>
                    </>

                )
            )}
        </ul>
    )
        ;
};

export default RecipeListAll;
