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
        <div className="card" onClick={handleSelect}>
            <div className="card--image-wrapper">
                <div className="card--view">
                    <p>View Recipe</p>
                </div>
                <div className="card--image"></div>
            </div>
            <div className="card--content-wrapper">
                <h1 className="card--title">{recipe.title}</h1>
                <div className="card--recipe-info">
                    <h2 className="card--recipe-category">
                        {recipe.categories && recipe.categories.length > 0
                            ? recipe.categories.map((category) => category.id).join(", ")
                            : 'Aucune catégorie'}
                    </h2>
                    <p className="card--recipe-time">
                        <i className="fa fa-clock-o" aria-hidden="true"></i> {recipe.time || 'Non spécifié'} minutes
                    </p>
                </div>
                <p className="card--description">{recipe.description}</p>
                <p className="card--description">{recipe.instructions}</p>
                <p>{recipe.totalCost}</p>
                {/* Affichage des ingrédients */}
                <div className="card--ingredients">
                    <h5>Ingrédients:</h5>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.name || 'Non spécifié'} - {ingredient.price}€
                                </li>
                            ))
                        ) : (
                            <li>Aucun ingrédient spécifié</li>
                        )}
                    </ul>
                </div>

                <div className="card--rating-wrapper">
                    <div className="card--rating-stars--wrapper">
                        {[...Array(5)].map((star, index) => (
                            <div key={index}
                                 className={`card--rating-star ${index < (recipe.rating || 0) ? 'filled' : ''}`}>
                                ☆
                            </div>
                        ))}
                    </div>
                    <span className="card--rating-count">{recipe.reviewsCount || 'Aucune review'} reviews</span>
                </div>
            </div>
        </div>
    );
};

export default RecipeItemAll;
