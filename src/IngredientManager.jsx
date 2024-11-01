import React, { useEffect, useState } from 'react';
import useIngredientStore from './IngredientStore.jsx';
import Toast from "./Toast.jsx";
import { Card, CardActions, CardContent, Button, Typography, TextField, Box, Avatar } from '@mui/material';
import { AttachMoney, LocalFireDepartment, Restaurant } from '@mui/icons-material'; // Import des icônes

function IngredientManager() {
    const { ingredients, fetchIngredients, addIngredient, updateIngredient, deleteIngredient } = useIngredientStore();
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientPrice, setNewIngredientPrice] = useState('');
    const [newIngredientCalories, setNewIngredientCalories] = useState('');
    const [newIngredientQuantity, setNewIngredientQuantity] = useState('');

    const [editIngredientId, setEditIngredientId] = useState(null);
    const [editIngredientName, setEditIngredientName] = useState('');
    const [editIngredientPrice, setEditIngredientPrice] = useState('');
    const [editIngredientCalories, setEditIngredientCalories] = useState('');
    const [editIngredientQuantity, setEditIngredientQuantity] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleAddIngredient = async () => {
        if (!newIngredientName.trim() || !newIngredientPrice || !newIngredientCalories || !newIngredientQuantity) {
            setToastType("error");
            setToastMessage('Veuillez remplir tous les champs correctement.');
            return;
        }

        await addIngredient(
            newIngredientName,
            parseFloat(newIngredientPrice),
            parseFloat(newIngredientCalories),
            parseFloat(newIngredientQuantity),
            token
        ).catch(() => {
            setToastType("error");
            setToastMessage('Une erreur s\'est produite');
        }).then(() => {
            setToastType("success");
            setToastMessage('Ingrédient ajouté');
        });

        setNewIngredientName('');
        setNewIngredientPrice('');
        setNewIngredientCalories('');
        setNewIngredientQuantity('');
    };

    const handleUpdateIngredient = async (id) => {
        if (!editIngredientName.trim() || !editIngredientPrice || !editIngredientCalories || !editIngredientQuantity) {
            setToastType("error");
            setToastMessage('Veuillez remplir tous les champs correctement.');
            return;
        }

        await updateIngredient(
            id,
            editIngredientName,
            parseFloat(editIngredientPrice),
            parseFloat(editIngredientCalories),
            parseFloat(editIngredientQuantity),
            token
        );

        setEditIngredientId(null);
        setEditIngredientName('');
        setEditIngredientPrice('');
        setEditIngredientCalories('');
        setEditIngredientQuantity('');
    };

    const handleDeleteIngredient = async (id) => {
        await deleteIngredient(id, token);
    };

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
            <Button variant="contained" color="primary" onClick={handleAddIngredient} sx={{ mb: 2 }}>
                Ajouter
            </Button>

            {Array.isArray(ingredients) && ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                    <Card key={ingredient.id} sx={{ mb: 2, width: '100%', maxWidth: 500, boxShadow: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{ bgcolor: "#1976d2", marginRight: 2 }}
                                alt={ingredient.name}
                            >
                                <Restaurant />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{ingredient.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <AttachMoney /> {ingredient.price} € - <LocalFireDepartment /> {ingredient.caloriesPerUnit} kcal - {ingredient.defaultQuantity} {ingredient.unit}
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions>
                            {editIngredientId === ingredient.id ? (
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateIngredient(ingredient.id)}
                                >
                                    Mettre à jour
                                </Button>
                            ) : (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        setEditIngredientId(ingredient.id);
                                        setEditIngredientName(ingredient.name);
                                        setEditIngredientPrice(ingredient.price);
                                        setEditIngredientCalories(ingredient.caloriesPerUnit);
                                        setEditIngredientQuantity(ingredient.defaultQuantity);
                                    }}
                                >
                                    Modifier
                                </Button>
                            )}
                            <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeleteIngredient(ingredient.id)}
                            >
                                Supprimer
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">La liste des ingrédients est vide.</Typography>
            )}

            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default IngredientManager;
