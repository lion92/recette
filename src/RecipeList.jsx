import React from 'react';
import RecipeItem from './RecipeItem.jsx';
import './css/recette.css';
import useRecipeStore from "./RecipeStore.js";
import '../src/css/listRecette.css'
import {Button} from "@mui/material";

const RecipeList = ({ recipesFromProps }) => {
    const { recipes, deleteRecipe } = useRecipeStore();


        return (
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                        <>

                            <RecipeItem key={recipe.id} recipe={recipe}/>
                        </>

                    )
                )}
            </ul>
        )
            ;
    };

    export default RecipeList;
