import { create } from 'zustand';
import axios from 'axios';

const useRecipeStore = create((set) => ({
    recipes: [],

    // Récupérer toutes les recettes
    fetchRecipes: async () => {
        try {
            const response = await axios.get('http://localhost:3012/recipes/all');
            set({ recipes: response.data });
            console.log(response.data)
        } catch (error) {
            console.error('Erreur lors du chargement des recettes', error);
        }
    },

    // Ajouter une recette
    addRecipe: async (recipeData, token) => {
        try {
            const response = await axios.post('http://localhost:3012/recipes', recipeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({ recipes: [...state.recipes, response.data] }));
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la recette', error);
        }
    },

    // Mettre à jour une recette
    updateRecipe: async (recipeId, updatedRecipeData, token) => {
        try {
            await axios.put(`http://localhost:3012/recipes/${recipeId}`, updatedRecipeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                recipes: state.recipes.map((recipe) =>
                    recipe.id === recipeId ? { ...recipe, ...updatedRecipeData } : recipe
                )
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la recette', error);
        }
    },

    // Supprimer une recette
    deleteRecipe: async (recipeId, token) => {
        try {
            await axios.delete(`http://localhost:3012/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set((state) => ({
                recipes: state.recipes.filter((recipe) => recipe.id !== recipeId)
            }));
        } catch (error) {
           alert("Une erreur s'est produite")
        }
    }
}));

export default useRecipeStore;
