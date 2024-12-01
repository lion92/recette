import { create } from 'zustand';
import axios from 'axios';

const useApiStore = create((set, get) => ({
    recipes: [],
    calendarEvents: [],
    loading: false,
    error: null,

    // Récupérer les en-têtes d'autorisation
    getAuthHeaders: () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
    }),

    // Charger les recettes
    fetchRecipes: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3007/recipes/all', get().getAuthHeaders());
            set({ recipes: response.data, loading: false });
        } catch (error) {
            console.error('Erreur lors du chargement des recettes:', error);
            set({ error: 'Impossible de charger les recettes. Veuillez réessayer.', loading: false });
        }
    },

    // Charger les événements du calendrier
    fetchCalendarEvents: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3007/calendar/user', get().getAuthHeaders());
            set({ calendarEvents: response.data, loading: false });
        } catch (error) {
            console.error('Erreur lors du chargement des événements du calendrier:', error);
            set({ error: 'Impossible de charger les événements. Veuillez réessayer.', loading: false });
        }
    },

    // Ajouter une recette au calendrier
    addRecipeToCalendar: async (recipeId, date) => {
        set({ loading: true, error: null });
        try {
            await axios.post(
                'http://localhost:3007/calendar/add',
                { recipeId, date },
                get().getAuthHeaders()
            );
            await get().fetchCalendarEvents(); // Recharger les événements après ajout
        } catch (error) {
            console.error('Erreur lors de l’ajout au calendrier:', error);
            set({ error: 'Impossible d’ajouter cette recette au calendrier.', loading: false });
        }
    },

    // Supprimer un événement du calendrier
    deleteCalendarEvent: async (eventId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:3007/calendar/delete/${eventId}`, get().getAuthHeaders());
            await get().fetchCalendarEvents(); // Recharger les événements après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement:', error);
            set({ error: 'Impossible de supprimer cet événement.', loading: false });
        }
    },
}));

export default useApiStore;
