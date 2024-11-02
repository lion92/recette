import { create } from 'zustand';
import axios from 'axios';
import Toast from '../src/Toast.jsx'; // Assurez-vous d'importer votre composant Toast

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // Définir l'URL de base pour l'API

const useRecipeStore = create((set) => ({
    recipes: [],

    // Récupérer toutes les recettes
    fetchRecipes: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recipes/all`);
            set({ recipes: response.data });
            Toast.show('Recettes chargées avec succès !', 'success'); // Utilisation de votre composant Toast
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
            set((state) => ({ recipes: [...state.recipes, response.data] }));
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
                recipes: state.recipes.filter((recipe) => recipe.id !== recipeId)
            }));
            Toast.show('Recette supprimée avec succès !', 'success');
        } catch (error) {
            Toast.show("Erreur lors de la suppression de la recette", 'error');
            console.error("Erreur lors de la suppression de la recette", error);
        }
    }
}));

export default useRecipeStore;
