import React from 'react';
import RecipeItem from './RecipeItem.jsx';
import './css/recette.css';

const RecipeList = ({ recipes }) => {
    return (
        <ul className="recipe-list">
            {recipes.map((recipe) => (
                <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
        </ul>
    );
};

export default RecipeList;
