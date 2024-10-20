import React from 'react';
import './css/recette.css';
import useRecipeIdStore from "./RecipeIdStore.js";

const RecipeItem = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();

    const handleSelect = () => {
        selectRecipe(recipe.id); // Sélectionne la recette en utilisant son ID
    };
    return (
        <li className="recipe-item" onClick={handleSelect}>
            <h3>ID recette: {recipe.id}</h3>
            <h3>Titre: {recipe.title}</h3>
            <p><strong>Description:</strong> {recipe.description}</p>
            <p><strong>Ingrédients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            <p><strong>Publié:</strong> {recipe.isPublished ? 'Oui' : 'Non'}</p>
            <p><strong>ID utilisateur:</strong> {recipe.user.id}</p>
        </li>
    );
};

export default RecipeItem;