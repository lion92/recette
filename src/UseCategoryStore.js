import  {create} from 'zustand';
import axios from 'axios'; // Pour faire des requêtes HTTP

const useCategoryStore = create((set) => ({
    categories: [],
    fetchCategories: async () => {
        try {
            const response = await axios.get('http://localhost:3012/categories');
            set({ categories: response.data });
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    },
    addCategory: async (category, token) => {
        try {
            const response = await axios.post(
                'http://localhost:3012/categories',
                { name: category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({ categories: [...state.categories, response.data] }));
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la catégorie:', error);
        }
    },
    updateCategory: async (id, updatedCategory, token) => {
        try {
            const response = await axios.put(
                `http://localhost:3012/categories/${id}`,
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
    deleteCategory: async (id, token) => {
        try {
            await axios.delete(`http://localhost:3012/categories/${id}`, {
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
