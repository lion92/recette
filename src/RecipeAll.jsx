import React, {useEffect} from 'react';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";
import RecipeListAll from "./RecipeListAll.jsx";

function Recipes() {
    const { recipes, fetchRecipes } = useRecipeStore();
    useEffect(() => {
        fetchRecipes()
    }, []);

    return (
        <div className="recipes-container">
            <h2>Liste des recettes</h2>
            {recipes.length > 0 ? (
                <RecipeListAll recipes={recipes} />
            ) : (
                <p>Aucune recette disponible</p>
            )}
        </div>
    );
}

export default Recipes;
