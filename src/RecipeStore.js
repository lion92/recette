import { create } from 'zustand';
import axios from 'axios';
import Toast from '../src/Toast.jsx'; // Assurez-vous d'importer votre composant Toast

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // Définir l'URL de base pour l'API

const useRecipeStore = create((set, get) => ({
    recipes: [],
    filteredRecipes: [], // État pour stocker les recettes filtrées

    // Récupérer toutes les recettes
    fetchRecipes: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recipes/all`);
            set({ recipes: response.data, filteredRecipes: response.data }); // Met à jour les recettes et les recettes filtrées
            Toast.show('Recettes chargées avec succès !', 'success');
        } catch (error) {
            Toast.show('Erreur lors du chargement des recettes', 'error');
            console.error('Erreur lors du chargement des recettes', error);
        }
    },

    // Ajouter une recette
    addRecipe: async (recipeData, token) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/recipes`, recipeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                recipes: [...state.recipes, response.data],
                filteredRecipes: [...state.filteredRecipes, response.data]
            }));
            Toast.show('Recette ajoutée avec succès !', 'success');
        } catch (error) {
            Toast.show("Erreur lors de l'ajout de la recette", 'error');
            console.error("Erreur lors de l'ajout de la recette", error);
        }
    },

    // Mettre à jour une recette
    updateRecipe: async (recipeId, updatedRecipeData, token) => {
        try {
            await axios.put(`${API_BASE_URL}/recipes/${recipeId}`, updatedRecipeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                recipes: state.recipes.map((recipe) =>
                    recipe.id === recipeId ? { ...recipe, ...updatedRecipeData } : recipe
                ),
                filteredRecipes: state.filteredRecipes.map((recipe) =>
                    recipe.id === recipeId ? { ...recipe, ...updatedRecipeData } : recipe
                )
            }));
            Toast.show('Recette mise à jour avec succès !', 'success');
        } catch (error) {
            Toast.show("Erreur lors de la mise à jour de la recette", 'error');
            console.error("Erreur lors de la mise à jour de la recette", error);
        }
    },

    // Supprimer une recette
    deleteRecipe: async (recipeId, token) => {
        try {
            await axios.delete(`${API_BASE_URL}/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
                filteredRecipes: state.filteredRecipes.filter((recipe) => recipe.id !== recipeId)
            }));
            Toast.show('Recette supprimée avec succès !', 'success');
        } catch (error) {
            Toast.show("Erreur lors de la suppression de la recette", 'error');
            console.error("Erreur lors de la suppression de la recette", error);
        }
    },

    // Filtrer par catégories et ingrédients
    filterByCategoriesAndIngredients: async (categoryIds, ingredientIds) => {
        try {
            const params = {};
            if (categoryIds.length > 0) {
                params.categories = categoryIds.join(',');
            }
            if (ingredientIds.length > 0) {
                params.ingredients = ingredientIds.join(',');
            }

            if (Object.keys(params).length === 0) {
                Toast.show('Aucun critère de filtrage fourni', 'warning');
                return [];
            }

            const response = await axios.get(`${API_BASE_URL}/recipes/filter`, { params });
            set({ recipes: response.data, filteredRecipes: response.data }); // Met à jour les recettes et les recettes filtrées
            Toast.show('Recettes filtrées par catégories et ingrédients', 'info');
            return response.data; // Retourne la liste des recettes filtrées
        } catch (error) {
            Toast.show('Erreur lors du filtrage par catégories et ingrédients', 'error');
            console.error('Erreur lors du filtrage par catégories et ingrédients', error);
            return [];
        }
    },

    // Ajouter une quantité à un ingrédient sélectionné dans une recette
    updateIngredientQuantity: (recipeId, ingredientId, newQuantity) => {
        set((state) => {
            const updatedRecipes = state.recipes.map((recipe) => {
                if (recipe.id === recipeId) {
                    const updatedIngredients = recipe.ingredients.map((ingredient) =>
                        ingredient.id === ingredientId
                            ? { ...ingredient, quantity: newQuantity }
                            : ingredient
                    );
                    return { ...recipe, ingredients: updatedIngredients };
                }
                return recipe;
            });

            return {
                recipes: updatedRecipes,
                filteredRecipes: updatedRecipes,
            };
        });
        Toast.show('Quantité d\'ingrédient mise à jour', 'info');
    }
}));

export default useRecipeStore;
