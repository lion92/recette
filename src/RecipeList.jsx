import React from 'react';
import RecipeItem from './RecipeItem.jsx';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";

const RecipeList = ({ recipesFromProps }) => {
    const { recipes, deleteRecipe } = useRecipeStore();


        return (
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                        <>
                            <button onClick={() => deleteRecipe(recipe.id, ""+localStorage.getItem('jwt'))}>Supprimer</button>
                            <RecipeItem key={recipe.id} recipe={recipe}/>
                        </>

                    )
                )}
            </ul>
        )
            ;
    };

    export default RecipeList;
