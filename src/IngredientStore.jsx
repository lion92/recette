import { create } from 'zustand';
import axios from 'axios';

const useIngredientStore = create((set) => ({
    ingredients: [],
    fetchIngredients: async () => {
        try {
            const response = await axios.get('http://localhost:3012/ingredients');
            set({ ingredients: response.data });
        } catch (error) {
            console.error('Erreur lors de la récupération des ingrédients:', error);
        }
    },
    addIngredient: async (name, price, token) => {
        try {
            const response = await axios.post(
                'http://localhost:3012/ingredients',
                { name, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({ ingredients: [...state.ingredients, response.data] }));
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'ingrédient:", error);
        }
    },
    updateIngredient: async (id, name, price, token) => {
        try {
            const response = await axios.put(
                `http://localhost:3012/ingredients/${id}`,
                { name, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({
                ingredients: state.ingredients.map((ingredient) =>
                    ingredient.id === id ? response.data : ingredient
                ),
            }));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'ingrédient:", error);
        }
    },
    deleteIngredient: async (id, token) => {
        try {
            await axios.delete(`http://localhost:3012/ingredients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
            }));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'ingrédient:', error);
        }
    },
}));

export default useIngredientStore;
