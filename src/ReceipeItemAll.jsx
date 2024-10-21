import React from 'react';
import './css/recette.css';
import useRecipeIdStore from "./RecipeIdStore.js"; // Assurez-vous que le chemin est correct

const RecipeItemAll = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();

    const handleSelect = () => {
        console.log(recipe);
        selectRecipe(recipe.id); // Sélectionne la recette en utilisant son ID
    };

    return (
        <li className="recipe-item" onClick={handleSelect}>
            <h3>ID recette: {recipe.id}</h3>
            <h4>Titre: {recipe.title}</h4>
            <p>Description: {recipe.description}</p>
            <p>Instructions: {recipe.instructions}</p>

            {/* Affichage des ingrédients */}
            <h5>Ingrédients:</h5>
            <ul>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            Nom: {ingredient.name || 'Non spécifié'}, Prix: {ingredient.price}€
                        </li>
                    ))
                ) : (
                    <li>Aucun ingrédient spécifié</li>
                )}
            </ul>

            {/* Affichage des catégories */}
            <h5>Catégories:</h5>
            <ul>
                {recipe.categories && recipe.categories.length > 0 ? (

                    recipe.categories.map((category) => (
                        <li key={category.id}>
                            {category.id || 'Non spécifié'}
                        </li>
                    ))
                ) : (
                    <li>Aucune catégorie spécifiée</li>
                )}
            </ul>

            {/* Affichage des informations utilisateur */}
            <p>Créé par: {recipe.user.username}</p>
        </li>
    );
};

export default RecipeItemAll;
