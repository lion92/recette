import React, { useState, useEffect } from 'react';
import useRecipeStore from './recipeStore';
import './css/addRecette.css';
import RecipeAll from './RecipeAll.jsx';
import useRecipeIdStore from './RecipeIdStore.js';

function AddRecipe() {
    // Définition des états pour les champs du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    // Récupérer les actions et l'état du store Zustand
    const { recipes, fetchRecipes, addRecipe, updateRecipe } = useRecipeStore();
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();

    // Charger la liste des recettes au montage du composant
    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    // Fonction pour gérer l'ajout de la recette
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt'); // Récupérer le token JWT

        if (!token) {
            alert('Vous devez être connecté pour ajouter une recette.');
            return;
        }

        // Créer un objet recette avec les données du formulaire
        const recipeData = {
            title,
            description,
            ingredients,
            instructions,
            isPublished,
        };

        await addRecipe(recipeData, token); // Appeler addRecipe avec les données du formulaire
        alert('Recette ajoutée avec succès !');
        // Optionnel: Réinitialiser le formulaire après ajout
        setTitle('');
        setDescription('');
        setIngredients('');
        setInstructions('');
        setIsPublished(false);
        fetchRecipes(); // Recharger la liste des recettes
    };

    // Fonction pour gérer la mise à jour de la recette
    const handleUpdate = async () => {
        const token = localStorage.getItem('jwt'); // Récupérer le token JWT

        if (!token) {
            alert('Vous devez être connecté pour modifier une recette.');
            return;
        }

        if(!selectedRecipeId) {
            alert('Aucune recette sélectionnée pour mise à jour.');
            return;
        }

        const updatedRecipeData = {
            title,
            description,
            ingredients,
            instructions,
            isPublished,
        };

        await updateRecipe(selectedRecipeId, updatedRecipeData, token);
        alert('Recette mise à jour avec succès !');
        await fetchRecipes(); // Recharger la liste des recettes après mise à jour
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Id Recette sélectionnée: {selectedRecipeId || 'Aucune sélectionnée'}</h1>
                <h2>Ajouter une nouvelle recette</h2>

                <div>
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Entrez le titre"
                        required
                    />
                </div>

                <div>
                    <label>Description :</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Entrez la description"
                        required
                    />
                </div>

                <div>
                    <label>Ingrédients :</label>
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Listez les ingrédients"
                        required
                    />
                </div>

                <div>
                    <label>Instructions :</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Indiquez les instructions"
                        required
                    />
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={() => setIsPublished(!isPublished)}
                        />
                        Publier la recette ?
                    </label>
                </div>

                <button type="submit">Ajouter la recette</button>
                <button type="button" onClick={handleUpdate}>Mettre à jour la recette</button>
            </form>

            {/* Affichage de la liste des recettes */}
            <RecipeAll recipes={recipes} />
        </div>
    );
}

export default AddRecipe;
