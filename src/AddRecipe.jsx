import React, { useState, useEffect } from 'react';
import useRecipeStore from './recipeStore';
import './css/addRecette.css';
import RecipeAll from './RecipeAll.jsx';
import useRecipeIdStore from './RecipeIdStore.js';
import useCategoryStore from '../src/UseCategoryStore.js'; // Store pour les catégories
import useIngredientStore from './ingredientStore'; // Store pour les ingrédients

function AddRecipe() {
    // Définition des états pour les champs du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]); // Sélectionner les ingrédients
    const [selectedCategories, setSelectedCategories] = useState([]); // Sélectionner les catégories
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    // Récupérer les recettes, catégories et ingrédients via les stores Zustand
    const { recipes, fetchRecipes, addRecipe, updateRecipe } = useRecipeStore();
    const { categories, fetchCategories } = useCategoryStore(); // Store pour les catégories
    const { ingredients, fetchIngredients } = useIngredientStore(); // Store pour les ingrédients
    const { selectedRecipeId } = useRecipeIdStore();

    // Charger les données au montage du composant
    useEffect(() => {
        fetchRecipes();
        fetchCategories(); // Charger les catégories depuis l'API
        fetchIngredients(); // Charger les ingrédients depuis l'API
    }, [fetchRecipes, fetchCategories, fetchIngredients]);

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
            ingredients: selectedIngredients, // Utiliser les ingrédients sélectionnés
            categories: selectedCategories,   // Utiliser les catégories sélectionnées
            instructions,
            isPublished,
        };

        await addRecipe(recipeData, token); // Appeler addRecipe avec les données du formulaire
        alert('Recette ajoutée avec succès !');
        // Réinitialiser le formulaire après ajout
        setTitle('');
        setDescription('');
        setSelectedIngredients([]);
        setSelectedCategories([]);
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

        if (!selectedRecipeId) {
            alert('Aucune recette sélectionnée pour mise à jour.');
            return;
        }

        const updatedRecipeData = {
            title,
            description,
            ingredients: selectedIngredients,
            categories: selectedCategories,
            instructions,
            isPublished,
        };

        await updateRecipe(selectedRecipeId, updatedRecipeData, token);
        alert('Recette mise à jour avec succès !');
        fetchRecipes(); // Recharger la liste des recettes après mise à jour
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

                {/* Sélection des catégories */}
                <div>
                    <label>Catégories :</label>
                    <select
                        multiple
                        value={selectedCategories}
                        onChange={(e) => setSelectedCategories([...e.target.selectedOptions].map(option => option.value))}
                    >
                        {Array.isArray(categories) && categories.length > 0? categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        )):""}
                    </select>
                </div>

                {/* Sélection des ingrédients */}
                <div>
                    <label>Ingrédients :</label>
                    <select
                        multiple
                        value={selectedIngredients}
                        onChange={(e) => setSelectedIngredients([...e.target.selectedOptions].map(option => option.value))}
                    >
                        {Array.isArray(ingredients) && ingredients.length > 0? ingredients.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.id}>
                                {ingredient.name}
                            </option>
                        )):""}
                    </select>
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
