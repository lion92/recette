import React from 'react';
import './css/recette.css';
import useRecipeIdStore from "./RecipeIdStore.js"; // Assurez-vous que le chemin est correct

const RecipeItem = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();
    // Affiche seulement les informations si la recette est publiée
    if (!recipe.isPublished) {
        return null; // Retourne null si la recette n'est pas publiée (n'affiche rien)
    }

    const handleSelect = () => {
        console.log(recipe.id)
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
