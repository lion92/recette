import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeList from './RecipeList.jsx';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";

function Recipes() {
    const { recipes, fetchRecipes } = useRecipeStore();
    useEffect(() => {
        fetchRecipes()
    }, []);

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
