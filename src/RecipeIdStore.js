import { create } from 'zustand';

const useRecipeIdStore = create((set) => ({
    selectedRecipeId: null,
    selectRecipe: (id) => set({ selectedRecipeId: id }),
}));

export default useRecipeIdStore;
