import React from 'react';
import RecipeItem from './RecipeItem.jsx';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";

const RecipeList = ({ recipesFromProps }) => {
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
                            <RecipeItem key={recipe.id} recipe={recipe}/>
                        </>

                    )
                )}
            </ul>
        )
            ;
    };

    export default RecipeList;
