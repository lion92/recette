import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // Définir l'URL de base pour l'API

const useCategoryStore = create((set) => ({
    categories: [],

    // Récupérer toutes les catégories
    fetchCategories: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            set({ categories: response.data });
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    },

    // Ajouter une catégorie
    addCategory: async (category, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/categories`,
                { name: category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({ categories: [...state.categories, response.data] }));
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
    },

    // Mettre à jour une catégorie
    updateCategory: async (id, updatedCategory, token) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/categories/${id}`,
                { name: updatedCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id === id ? response.data : cat
                ),
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
        }
    },

    // Supprimer une catégorie
    deleteCategory: async (id, token) => {
        try {
            await axios.delete(`${API_BASE_URL}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                categories: state.categories.filter((cat) => cat.id !== id),
            }));
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
        }
    },
}));

export default useCategoryStore;
