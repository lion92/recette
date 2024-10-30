import React, { useEffect, useState } from 'react';
import useIngredientStore from './IngredientStore.jsx';
import Toast from "./Toast.jsx";
import { Card, CardActions, CardContent, Button, Typography, TextField, Box } from '@mui/material';

function IngredientManager() {
    const { ingredients, fetchIngredients, addIngredient, updateIngredient, deleteIngredient } = useIngredientStore();
    const [newIngredient, setNewIngredient] = useState('');
    const [newIngredientPrice, setNewIngredientPrice] = useState(''); // État pour le prix
    const [editIngredientId, setEditIngredientId] = useState(null);
    const [editIngredientName, setEditIngredientName] = useState('');
    const [editIngredientPrice, setEditIngredientPrice] = useState(''); // État pour le prix en modification
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour authentification

    // Charger les ingrédients depuis l'API lors du montage du composant
    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    // Fonction pour ajouter un nouvel ingrédient
    const handleAddIngredient = async () => {
        if (!newIngredient.trim()) {
            setToastType("error");
            setToastMessage('Le nom de l\'ingrédient ne peut pas être vide.');
            return;
        }

        if (!newIngredientPrice || parseFloat(newIngredientPrice) <= 0) {
            setToastType("error");
            setToastMessage('Le prix de l\'ingrédient doit être un nombre positif.');
            return;
        }

        await addIngredient(newIngredient, parseFloat(newIngredientPrice), token).catch(() => {
            setToastType("error");
            setToastMessage('Une erreur s\'est produite');
        }).then(() => {
            setToastType("success");
            setToastMessage('Ingrédient ajouté');
        });

        setNewIngredient('');
        setNewIngredientPrice('');
    };

    // Fonction pour mettre à jour un ingrédient existant
    const handleUpdateIngredient = async (id) => {
        if (!editIngredientName.trim()) {
            setToastType("error");
            setToastMessage("Le nom de l'ingrédient ne peut pas être vide.");
            return;
        }

        if (!editIngredientPrice || parseFloat(editIngredientPrice) <= 0) {
            setToastType("error");
            setToastMessage('Le prix de l\'ingrédient doit être un nombre positif.');
            return;
        }

        await updateIngredient(id, editIngredientName, parseFloat(editIngredientPrice), token);
        setEditIngredientId(null);
        setEditIngredientName('');
        setEditIngredientPrice('');
    };

    // Fonction pour supprimer un ingrédient
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
                backgroundColor:"white",
                marginTop:"20px",
                maxWidth:"400px",
                margin:"20px auto",
            }}
        >
            <h2>Gestion des Ingrédients</h2>

            <TextField
                label="Ajouter un ingrédient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                sx={{ width: '80%', maxWidth: 300, marginBottom: 2 }} // Limite la largeur à 300px
            />
            <TextField
                label="Prix"
                type="number"
                value={newIngredientPrice}
                onChange={(e) => setNewIngredientPrice(e.target.value)}
                sx={{ width: '80%', maxWidth: 300, marginBottom: 2 }} // Limite la largeur à 300px
            />
            <Button variant="contained" color="primary" onClick={handleAddIngredient} sx={{ mb: 2 }}>
                Ajouter
            </Button>

            {Array.isArray(ingredients) && ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                    <Card key={ingredient.id} sx={{ mb: 2, boxShadow: 3, width: '100%', maxWidth: 400 }}>
                        <CardContent>
                            {editIngredientId === ingredient.id ? (
                                <div>
                                    <TextField
                                        label="Nom"
                                        value={editIngredientName}
                                        onChange={(e) => setEditIngredientName(e.target.value)}
                                        sx={{ width: '80%', maxWidth: 300, marginBottom: 2 }} // Limite la largeur à 300px
                                    />
                                    <TextField
                                        label="Prix"
                                        type="number"
                                        value={editIngredientPrice}
                                        onChange={(e) => setEditIngredientPrice(e.target.value)}
                                        sx={{ width: '80%', maxWidth: 300, marginBottom: 2 }} // Limite la largeur à 300px
                                    />
                                </div>
                            ) : (
                                <Typography variant="h6">
                                    {ingredient.name} - {ingredient.price} €
                                </Typography>
                            )}
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
