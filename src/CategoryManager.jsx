import React, { useEffect, useState } from 'react';
import useCategoryStore from '../src/UseCategoryStore.js';
import Toast from "./Toast.jsx";
import { Card, CardContent, CardActions, Button, Typography, TextField, Box } from '@mui/material';

function CategoryManager() {
    // Récupération des actions et de l'état depuis le store Zustand
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
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
                setToastMessage("Une erreur s'est produite");
            }).then(() => {
                setToastType("success");
                setToastMessage("Ajout créé");
            });
            setNewCategory(''); // Réinitialiser le champ de saisie
        }
    };

    // Fonction pour mettre à jour une catégorie existante
    const handleUpdateCategory = async (id) => {
        if (editCategoryName.trim()) {
            await updateCategory(id, editCategoryName, token).catch(() => {
                setToastType("error");
                setToastMessage("Une erreur s'est produite");
            }).then(() => {
                setToastType("success");
                setToastMessage("Mise à jour réussie");
            });
            setEditCategoryId(null); // Sortir du mode édition
            setEditCategoryName('');
        }
    };

    // Fonction pour supprimer une catégorie
    const handleDeleteCategory = async (id) => {
        await deleteCategory(id, token);
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
            <h2>Gestion des Catégories</h2>

            <TextField
                label="Ajouter une catégorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddCategory} sx={{ mb: 2 }}>
                Ajouter
            </Button>

            <Box>
                {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                        <Card key={category.id} sx={{ mb: 2, boxShadow: 3 }}>
                            <CardContent>
                                {editCategoryId === category.id ? (
                                    <TextField
                                        label="Nom"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                ) : (
                                    <Typography variant="h6">
                                        {category.name}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                {editCategoryId === category.id ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateCategory(category.id)}
                                    >
                                        Mettre à jour
                                    </Button>
                                ) : (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setEditCategoryId(category.id);
                                            setEditCategoryName(category.name);
                                        }}
                                    >
                                        Modifier
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    Supprimer
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1">La liste des catégories est vide.</Typography>
                )}
            </Box>

            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default CategoryManager;
