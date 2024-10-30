import React from 'react';
import './css/recette.css';
import useRecipeIdStore from "./RecipeIdStore.js";
import {Button} from "@mui/material";
import useRecipeStore from "./RecipeStore.js"; // Assurez-vous que le chemin est correct

const RecipeItem = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();

    const {deleteRecipe}=useRecipeStore()

    const handleSelect = () => {
        console.log(recipe);
        selectRecipe(recipe.id); // Sélectionne la recette en utilisant son ID
    };
    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem('jwt'); // Récupérer le token JWT
        if (!token) {
            alert('Vous devez être connecté pour supprimer une recette.');
            return;
        }

        await deleteRecipe(recipeId, token);
        alert('Recette supprimée avec succès !');
    };
    return (
        <div className="card" onClick={handleSelect}>
            <Button color="primary" onClick={() => handleDelete(recipe.id, ""+localStorage.getItem('jwt'))}>Supprimer</Button>
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
                            ? recipe.categories.map((category) => "Categorie : " + category.name).join(", ")
                            : 'Aucune catégorie'}
                    </h2>
                </div>
                <p className="card--description">{recipe.description}</p>

                <p className="card--description">{recipe.instructions}</p>
                <p>prix Total: {recipe.totalCost}</p>


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
            </div>
        </div>
    );
};

export default RecipeItem;
