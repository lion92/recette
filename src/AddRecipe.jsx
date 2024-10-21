import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Sélecteur multiple pour catégories et ingrédients
import useRecipeStore from './recipeStore'; // Store pour les recettes
import useCategoryStore from './useCategoryStore'; // Store pour les catégories
import useIngredientStore from '../src/IngredientStore.jsx'; // Store pour les ingrédients
import './css/addRecette.css'; // CSS pour styliser le formulaire

function AddRecipe() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]); // Sélection d'ingrédients
    const [selectedCategories, setSelectedCategories] = useState([]); // Sélection de catégories

    // Récupération des recettes, catégories et ingrédients depuis les stores
    const { addRecipe, fetchRecipes } = useRecipeStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { ingredients, fetchIngredients } = useIngredientStore();

    // Chargement des catégories et ingrédients lorsque le composant est monté
    useEffect(() => {
        fetchCategories();
        fetchIngredients();
    }, [fetchCategories, fetchIngredients]);

    // Soumission du formulaire pour ajouter une recette
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour l'authentification
        if (!token) {
            alert('Vous devez être connecté pour ajouter une recette.');
            return;
        }

        // Log pour vérifier les valeurs sélectionnées avant de soumettre
        console.log('Selected Category IDs:', selectedCategories);
        console.log('Selected Ingredient IDs:', selectedIngredients);

        const recipeData = {
            title,
            description,
            instructions,
            isPublished,
            ingredients: selectedIngredients.map((ingredient) => ingredient.value), // IDs des ingrédients
            categories: selectedCategories.map((category) => category.value), // IDs des catégories
        };

        try {
            await addRecipe(recipeData, token); // Ajouter la recette via le store
            alert('Recette ajoutée avec succès !');
            // Réinitialiser les champs après l'ajout
            setTitle('');
            setDescription('');
            setInstructions('');
            setSelectedIngredients([]);
            setSelectedCategories([]);
            setIsPublished(false);
            fetchRecipes(); // Actualiser la liste des recettes
        } catch (error) {
            console.error('Erreur lors de l’ajout de la recette', error);
            alert('Erreur lors de l’ajout de la recette');
        }
    };

    return (
        <div className="recipe-form-container">
            <h2>Ajouter une nouvelle recette</h2>
            <form onSubmit={handleSubmit}>
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
                    <label>Instructions :</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Indiquez les instructions"
                        required
                    />
                </div>

                {/* Sélection des catégories avec react-select */}
                <div>
                    <label>Catégories :</label>
                    <Select
                        isMulti
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        options={categories.map((category) => ({
                            value: category.id, // Utiliser l'ID de la catégorie
                            label: category.name, // Afficher le nom de la catégorie
                        }))}
                        placeholder="Sélectionnez les catégories"
                    />
                </div>

                {/* Sélection des ingrédients avec react-select */}
                <div>
                    <label>Ingrédients :</label>
                    <Select
                        isMulti
                        value={selectedIngredients}
                        onChange={setSelectedIngredients}
                        options={ingredients.map((ingredient) => ({
                            value: ingredient.id, // Utiliser l'ID de l'ingrédient
                            label: ingredient.name, // Afficher le nom de l'ingrédient
                        }))}
                        placeholder="Sélectionnez les ingrédients"
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
            </form>
        </div>
    );
}

export default AddRecipe;
