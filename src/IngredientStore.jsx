import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from './config/api.config.js';
import Toast from './Toast.jsx';

const useIngredientStore = create((set) => ({
    ingredients: [],
    fetchIngredients: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ingredients`);
            set({ ingredients: response.data });
        } catch (error) {
            Toast.show('Erreur lors de la récupération des ingrédients', 'error');
            console.error('Erreur lors de la récupération des ingrédients:', error);
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
            Toast.show("Erreur lors de la mise à jour de l'ingrédient", 'error');
            console.error("Erreur lors de la mise à jour de l'ingrédient:", error);
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
            Toast.show('Erreur lors de la suppression de l\'ingrédient', 'error');
            console.error('Erreur lors de la suppression de l\'ingrédient:', error);
        }
    },
}));

export default useIngredientStore;
