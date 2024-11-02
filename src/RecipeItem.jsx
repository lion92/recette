import React, { useState } from 'react';
import './css/recette.css';
import useRecipeIdStore from './RecipeIdStore.js';
import { Button } from '@mui/material';
import useRecipeStore from './RecipeStore.js';
import Toast from './Toast.jsx'; // Assurez-vous que le chemin est correct

const RecipeItem = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();
    const { deleteRecipe } = useRecipeStore();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const handleSelect = () => {
        selectRecipe(recipe.id); // Sélectionne la recette en utilisant son ID
    };

    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem('jwt'); // Récupérer le token JWT
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour supprimer une recette.');
            return;
        }

        try {
            await deleteRecipe(recipeId, token);
            setToastType('success');
            setToastMessage('Recette supprimée avec succès !');
        } catch (error) {
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la suppression de la recette.");
            console.error('Erreur lors de la suppression de la recette:', error);
        }
    };

    return (
        <div className="card" onClick={handleSelect}>
            <Button
                color="primary"
                onClick={(e) => {
                    e.stopPropagation(); // Empêche la propagation de l'événement de clic
                    handleDelete(recipe.id);
                }}
            >
                Supprimer
            </Button>
            <div className="card--image-wrapper">
                <div className="card--view">
                    <p>Voir la recette</p>
                </div>
                <div className="card--image"></div>
            </div>
            <div className="card--content-wrapper">
                <h1 className="card--title">{recipe.title}</h1>
                <div className="card--recipe-info">
                    <h2 className="card--recipe-category">
                        {recipe.categories && recipe.categories.length > 0
                            ? recipe.categories.map((category) => "Catégorie : " + category.name).join(', ')
                            : 'Aucune catégorie'}
                    </h2>
                </div>
                <p className="card--description">{recipe.description}</p>
                <p className="card--description">{recipe.instructions}</p>
                <p>Prix total : {recipe.totalCost} €</p>
                <p>Calories totales : {(recipe.totalCalories / 100).toFixed(2)} kCal</p>

                {/* Affichage des ingrédients */}
                <div className="card--ingredients">
                    <h5>Ingrédients :</h5>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.name || 'Non spécifié'} - {ingredient.price} €
                                </li>
                            ))
                        ) : (
                            <li>Aucun ingrédient spécifié</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Composant Toast pour les messages */}
            <Toast
                message={toastMessage}
                type={toastType}
                duration={3000}
                onClose={() => setToastMessage('')}
            />
        </div>
    );
};

export default RecipeItem;
