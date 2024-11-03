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
    Box,
    Pagination,
    IconButton,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CategoryManager() {
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [filterText, setFilterText] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filtrage et pagination
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(filterText.toLowerCase())
    );
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const displayedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                await addCategory(newCategory, token);
                setToastType("success");
                setToastMessage("Ajout réussi");
                setNewCategory('');
            } catch {
                setToastType("error");
                setToastMessage("Une erreur s'est produite");
            }
        }
    };

    const handleUpdateCategory = async (id) => {
        if (editCategoryName.trim()) {
            try {
                await updateCategory(id, editCategoryName, token);
                setToastType("success");
                setToastMessage("Mise à jour réussie");
                setEditCategoryId(null);
                setEditCategoryName('');
            } catch {
                setToastType("error");
                setToastMessage("Une erreur s'est produite");
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id, token);
            setToastType("success");
            setToastMessage("Suppression réussie");
        } catch {
            setToastType("error");
            setToastMessage("Erreur lors de la suppression");
        }
    };

    return (
        <Box sx={{ padding: 2, backgroundColor: "white", maxWidth: "800px", margin: "20px auto", borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Catégories
            </Typography>

            {/* Ajouter une nouvelle catégorie */}
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

            {/* Filtrer les catégories */}
            <TextField
                label="Filtrer les catégories"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                fullWidth
                margin="normal"
            />

            {/* Table des catégories */}
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
                                        <IconButton color="primary" onClick={() => handleUpdateCategory(category.id)}>
                                            <EditIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                setEditCategoryId(category.id);
                                                setEditCategoryName(category.name);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                sx={{ mt: 2 }}
            />

            {/* Notification Toast */}
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default CategoryManager;
