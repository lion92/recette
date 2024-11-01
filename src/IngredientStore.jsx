import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'https://www.krisscode.fr/recette'; // Définir la constante pour l'URL de base

const useIngredientStore = create((set) => ({
    ingredients: [],
    fetchIngredients: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ingredients`);
            set({ ingredients: response.data });
        } catch (error) {
            alert('Erreur lors de la récupération des ingrédients:', error);
        }
    },
    addIngredient: async (name, price, caloriesPerUnit, defaultQuantity, unit, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/ingredients`,
                { name, price, caloriesPerUnit, defaultQuantity, unit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({ ingredients: [...state.ingredients, response.data] }));
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'ingrédient:", error);
        }
    },
    updateIngredient: async (id, name, price, caloriesPerUnit, defaultQuantity, unit, token) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/ingredients/${id}`,
                { name, price, caloriesPerUnit, defaultQuantity, unit },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({
                ingredients: state.ingredients.map((ingredient) =>
                    ingredient.id === id ? response.data : ingredient
                ),
            }));
        } catch (error) {
            alert("Erreur lors de la mise à jour de l'ingrédient:", error);
        }
    },
    deleteIngredient: async (id, token) => {
        try {
            await axios.delete(`${API_BASE_URL}/ingredients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
            }));
        } catch (error) {
            alert('Erreur lors de la suppression de l\'ingrédient:', error);
        }
    },
}));

export default useIngredientStore;
