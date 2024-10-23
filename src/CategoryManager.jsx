import React, {useEffect, useState} from 'react';
import useCategoryStore from '../src/UseCategoryStore.js';
import Toast from "./Toast.jsx";

function CategoryManager() {
    // Récupération des actions et de l'état depuis le store Zustand
    const {categories, fetchCategories, addCategory, updateCategory, deleteCategory} = useCategoryStore();
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour authentification

    // Charger les catégories depuis l'API lors du montage du composant
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Fonction pour ajouter une nouvelle catégorie
    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            await addCategory(newCategory, token).catch(() => {
                setToastType("error");
                setToastMessage("Une erreur s'est produite")
            }).then(() => {
                setToastType("success")
                setToastMessage("Ajout crée")
            });
            setNewCategory(''); // Réinitialiser le champ de saisie
        }
    };

    // Fonction pour mettre à jour une catégorie existante
    const handleUpdateCategory = async (id) => {
        if (editCategoryName.trim()) {
            await updateCategory(id, editCategoryName, token).catch(() => {
                setToastType("error");
                setToastMessage("Une erreur s'est produite")
            }).then(() => {
                setToastType("success")
                setToastMessage("Ajout crée");
            })
            setEditCategoryId(null); // Sortir du mode édition
            setEditCategoryName('');
        }
    };

    // Fonction pour supprimer une catégorie
    const handleDeleteCategory = async (id) => {
        await deleteCategory(id, token);
    };

    return (
        <div style={{maxWidth: 500, margin: "auto"}}>
            <h2>Gestion des Catégories</h2>


            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ajouter une catégorie"
            />
            <button style={{textAlign: "center", margin: "auto"}} onClick={handleAddCategory}>Ajouter</button>


            <ul style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}>
                {Array.isArray(categories) && categories.length > 0 ? categories?.map((category) => (
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
                            <div style={{
                                color:"blue",
                                display: "flex",
                                gap: 4,
                                backgroundColor:"wheat",
                                padding:"12px"
                            }}>
                                <p style={{ fontWeight:400,fontSize:"30px"}}>{category?.name}</p>
                                <button onClick={() => {
                                    setEditCategoryId(category.id);
                                    setEditCategoryName(category.name);
                                }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Supprimer</button>
                            </div>
                        )}
                    </li>
                )) : ""}
            </ul>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </div>
    );
}

export default CategoryManager;
