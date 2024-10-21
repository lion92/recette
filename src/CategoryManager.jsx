import React, { useEffect, useState } from 'react';
import useCategoryStore from '../src/UseCategoryStore.js';

function CategoryManager() {
    // Récupération des actions et de l'état depuis le store Zustand
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');

    const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour authentification

    // Charger les catégories depuis l'API lors du montage du composant
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Fonction pour ajouter une nouvelle catégorie
    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            await addCategory(newCategory, token);
            setNewCategory(''); // Réinitialiser le champ de saisie
        }
    };

    // Fonction pour mettre à jour une catégorie existante
    const handleUpdateCategory = async (id) => {
        if (editCategoryName.trim()) {
            await updateCategory(id, editCategoryName, token);
            setEditCategoryId(null); // Sortir du mode édition
            setEditCategoryName('');
        }
    };

    // Fonction pour supprimer une catégorie
    const handleDeleteCategory = async (id) => {
        await deleteCategory(id, token);
    };

    return (
        <div>
            <h2>Gestion des Catégories</h2>

            <div>
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Ajouter une catégorie"
                />
                <button onClick={handleAddCategory}>Ajouter</button>
            </div>

            <ul>
                {Array.isArray(categories) && categories.length > 0? categories?.map((category) => (
                    <li key={category?.id}>
                        {editCategoryId === category?.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editCategoryName}
                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                />
                                <button onClick={() => handleUpdateCategory(category.id)}>Mettre à jour</button>
                            </div>
                        ) : (
                            <div>
                                {category?.name}
                                <button onClick={() => { setEditCategoryId(category.id); setEditCategoryName(category.name); }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Supprimer</button>
                            </div>
                        )}
                    </li>
                )):""}
            </ul>
        </div>
    );
}

export default CategoryManager;
