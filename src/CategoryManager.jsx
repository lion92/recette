import React, { useEffect, useState } from 'react';
import useCategoryStore from '../src/UseCategoryStore.js';
import Toast from "./Toast.jsx";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Pagination,
} from '@mui/material';

function CategoryManager() {
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [filterText, setFilterText] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Nombre d'éléments par page

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Calculer les catégories filtrées et paginées
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(filterText.toLowerCase())
    );
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const displayedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            await addCategory(newCategory, token)
                .catch(() => {
                    setToastType("error");
                    setToastMessage("Une erreur s'est produite");
                })
                .then(() => {
                    setToastType("success");
                    setToastMessage("Ajout réussi");
                });
            setNewCategory('');
        }
    };

    const handleUpdateCategory = async (id) => {
        if (editCategoryName.trim()) {
            await updateCategory(id, editCategoryName, token)
                .catch(() => {
                    setToastType("error");
                    setToastMessage("Une erreur s'est produite");
                })
                .then(() => {
                    setToastType("success");
                    setToastMessage("Mise à jour réussie");
                });
            setEditCategoryId(null);
            setEditCategoryName('');
        }
    };

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id, token);
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: "white", maxWidth: "800px", margin: "20px auto" }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Catégories
            </Typography>

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

            <TextField
                label="Filtrer les catégories"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                fullWidth
                margin="normal"
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <img
                                        src={`https://via.placeholder.com/50?text=${category.name[0]}`}
                                        alt={`${category.name} Logo`}
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {editCategoryId === category.id ? (
                                        <TextField
                                            value={editCategoryName}
                                            onChange={(e) => setEditCategoryName(e.target.value)}
                                            fullWidth
                                        />
                                    ) : (
                                        <Typography>{category.name}</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editCategoryId === category.id ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateCategory(category.id)}
                                        >
                                            Mettre à jour
                                        </Button>
                                    ) : (
                                        <Button
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
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                sx={{ mt: 2 }}
            />

            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default CategoryManager;
