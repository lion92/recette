import React, { useEffect, useState } from 'react';
import useIngredientStore from './IngredientStore.jsx';
import Toast from "./Toast.jsx";
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Box, Button, TextField, Typography, TableContainer } from '@mui/material';
import { AttachMoney, LocalFireDepartment, Restaurant } from '@mui/icons-material';

function IngredientManager() {
    const { ingredients, fetchIngredients, addIngredient, updateIngredient, deleteIngredient } = useIngredientStore();

    // États pour les champs d'ajout
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientPrice, setNewIngredientPrice] = useState('');
    const [newIngredientCalories, setNewIngredientCalories] = useState('');
    const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
    const [newIngredientUnit, setNewIngredientUnit] = useState('');

    // États pour les champs d'édition
    const [editIngredientId, setEditIngredientId] = useState(null);
    const [editIngredientName, setEditIngredientName] = useState('');
    const [editIngredientPrice, setEditIngredientPrice] = useState('');
    const [editIngredientCalories, setEditIngredientCalories] = useState('');
    const [editIngredientQuantity, setEditIngredientQuantity] = useState('');
    const [editIngredientUnit, setEditIngredientUnit] = useState('');

    // États pour les notifications
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // États pour les filtres
    const [filterName, setFilterName] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [filterCalories, setFilterCalories] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterUnit, setFilterUnit] = useState('');

    // Récupération du token pour l'authentification
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleAddIngredient = async () => {
        if (!newIngredientName.trim() || !newIngredientPrice || !newIngredientCalories || !newIngredientQuantity || !newIngredientUnit.trim()) {
            setToastType("error");
            setToastMessage('Veuillez remplir tous les champs correctement.');
            return;
        }

        try {
            await addIngredient(
                newIngredientName,
                parseFloat(newIngredientPrice),
                parseFloat(newIngredientCalories),
                parseFloat(newIngredientQuantity),
                newIngredientUnit,
                token
            );
            setToastType("success");
            setToastMessage('Ingrédient ajouté');
            setNewIngredientName('');
            setNewIngredientPrice('');
            setNewIngredientCalories('');
            setNewIngredientQuantity('');
            setNewIngredientUnit('');
            fetchIngredients(); // Re-fetch ingredients after adding
        } catch {
            setToastType("error");
            setToastMessage('Une erreur s\'est produite');
        }
    };

    const handleUpdateIngredient = async (id) => {
        if (!editIngredientName.trim() || !editIngredientPrice || !editIngredientCalories || !editIngredientQuantity || !editIngredientUnit.trim()) {
            setToastType("error");
            setToastMessage('Veuillez remplir tous les champs correctement.');
            return;
        }

        try {
            await updateIngredient(
                id,
                editIngredientName,
                parseFloat(editIngredientPrice),
                parseFloat(editIngredientCalories),
                parseFloat(editIngredientQuantity),
                editIngredientUnit,
                token
            );
            setToastType("success");
            setToastMessage('Ingrédient mis à jour');
            setEditIngredientId(null);
            setEditIngredientName('');
            setEditIngredientPrice('');
            setEditIngredientCalories('');
            setEditIngredientQuantity('');
            setEditIngredientUnit('');
            fetchIngredients(); // Re-fetch ingredients after updating
        } catch {
            setToastType("error");
            setToastMessage('Erreur lors de la mise à jour de l\'ingrédient');
        }
    };

    const handleDeleteIngredient = async (id) => {
        try {
            await deleteIngredient(id, token);
            setToastType("success");
            setToastMessage('Ingrédient supprimé');
            fetchIngredients(); // Re-fetch ingredients after deletion
        } catch {
            setToastType("error");
            setToastMessage('Erreur lors de la suppression de l\'ingrédient');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Fonction pour filtrer les ingrédients
    const filteredIngredients = ingredients.filter(ingredient => {
        return (
            ingredient.name.toLowerCase().includes(filterName.toLowerCase()) &&
            (filterPrice === '' || ingredient.price === parseFloat(filterPrice)) &&
            (filterCalories === '' || ingredient.caloriesPerUnit === parseFloat(filterCalories)) &&
            (filterQuantity === '' || ingredient.defaultQuantity === parseFloat(filterQuantity)) &&
            (filterUnit === '' || ingredient.unit.toLowerCase().includes(filterUnit.toLowerCase()))
        );
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 2,
                backgroundColor: "#f8f8f8",
                marginTop: "20px",
                maxWidth: "600px",
                margin: "20px auto",
                borderRadius: 4,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Gestion des Ingrédients
            </Typography>

            {/* Champs pour ajouter un nouvel ingrédient */}
            <TextField
                label="Nom de l'ingrédient"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />
            <TextField
                label="Prix (€)"
                type="number"
                value={newIngredientPrice}
                onChange={(e) => setNewIngredientPrice(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />
            <TextField
                label="Calories (kcal)"
                type="number"
                value={newIngredientCalories}
                onChange={(e) => setNewIngredientCalories(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />
            <TextField
                label="Quantité"
                type="number"
                value={newIngredientQuantity}
                onChange={(e) => setNewIngredientQuantity(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />
            <TextField
                label="Unité"
                value={newIngredientUnit}
                onChange={(e) => setNewIngredientUnit(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddIngredient} sx={{ mb: 2 }}>
                Ajouter
            </Button>

            {/* Champs pour filtrer les ingrédients */}
            <Typography variant="h6" gutterBottom>
                Filtrer les Ingrédients
            </Typography>
            <TextField
                label="Nom"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 1 }}
            />
            <TextField
                label="Prix (€)"
                type="number"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 1 }}
            />
            <TextField
                label="Calories (kcal)"
                type="number"
                value={filterCalories}
                onChange={(e) => setFilterCalories(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 1 }}
            />
            <TextField
                label="Quantité"
                type="number"
                value={filterQuantity}
                onChange={(e) => setFilterQuantity(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 1 }}
            />
            <TextField
                label="Unité"
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                sx={{ width: '100%', maxWidth: 500, marginBottom: 2 }}
            />

            {/* Tableau des ingrédients */}
            <TableContainer sx={{ maxWidth: 500, width: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ingrédient</TableCell>
                            <TableCell align="right">Prix (€)</TableCell>
                            <TableCell align="right">Calories (kcal)</TableCell>
                            <TableCell align="right">Quantité</TableCell>
                            <TableCell align="right">Unité</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(filteredIngredients) && filteredIngredients.length > 0 ? (
                            filteredIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ingredient) => (
                                <TableRow key={ingredient.id}>
                                    <TableCell>
                                        {editIngredientId === ingredient.id ? (
                                            <TextField
                                                label="Nom de l'ingrédient"
                                                value={editIngredientName}
                                                onChange={(e) => setEditIngredientName(e.target.value)}
                                                sx={{ width: '100%' }}
                                            />
                                        ) : (
                                            ingredient.name
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIngredientId === ingredient.id ? (
                                            <TextField
                                                label="Prix (€)"
                                                type="number"
                                                value={editIngredientPrice}
                                                onChange={(e) => setEditIngredientPrice(e.target.value)}
                                                sx={{ width: '100%' }}
                                            />
                                        ) : (
                                            ingredient.price
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIngredientId === ingredient.id ? (
                                            <TextField
                                                label="Calories (kcal)"
                                                type="number"
                                                value={editIngredientCalories}
                                                onChange={(e) => setEditIngredientCalories(e.target.value)}
                                                sx={{ width: '100%' }}
                                            />
                                        ) : (
                                            ingredient.caloriesPerUnit
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIngredientId === ingredient.id ? (
                                            <TextField
                                                label="Quantité"
                                                type="number"
                                                value={editIngredientQuantity}
                                                onChange={(e) => setEditIngredientQuantity(e.target.value)}
                                                sx={{ width: '100%' }}
                                            />
                                        ) : (
                                            ingredient.defaultQuantity
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIngredientId === ingredient.id ? (
                                            <TextField
                                                label="Unité"
                                                value={editIngredientUnit}
                                                onChange={(e) => setEditIngredientUnit(e.target.value)}
                                                sx={{ width: '100%' }}
                                            />
                                        ) : (
                                            ingredient.unit
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editIngredientId === ingredient.id ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleUpdateIngredient(ingredient.id)}
                                            >
                                                Mettre à jour
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    setEditIngredientId(ingredient.id);
                                                    setEditIngredientName(ingredient.name);
                                                    setEditIngredientPrice(ingredient.price);
                                                    setEditIngredientCalories(ingredient.caloriesPerUnit);
                                                    setEditIngredientQuantity(ingredient.defaultQuantity);
                                                    setEditIngredientUnit(ingredient.unit);
                                                }}
                                            >
                                                Modifier
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteIngredient(ingredient.id)}
                                        >
                                            Supprimer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Aucun ingrédient ne correspond à vos critères de filtre.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredIngredients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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

export default IngredientManager;
