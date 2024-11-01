import React, { useEffect } from 'react';
import RecipeList from './RecipeList.jsx';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";

function Recipes() {
    const { recipes, fetchRecipes } = useRecipeStore();

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return (
        <div className="recipes-container">
            <h2 className="recipes-title">Liste des recettes</h2>
            {recipes.length > 0 ? (
                <div className="recipes-grid">
                    <RecipeList recipes={recipes} />
                </div>
            ) : (
                <p className="no-recipes-message">Aucune recette disponible</p>
            )}
        </div>
    );
}

export default Recipes;
