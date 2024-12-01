import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

const IngredientsWithPrices = () => {
    const [ingredientsData, setIngredientsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les données de l'API
    const fetchIngredients = async () => {
        setLoading(true);
        setError(null); // Réinitialise l'erreur
        try {
            const token = localStorage.getItem('jwt'); // Récupère le token JWT
            const response = await axios.get('http://localhost:3007/calendar/ingredients/prices', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIngredientsData(response.data);
            console.log(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors du chargement.');
        } finally {
            setLoading(false);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        fetchIngredients();
    }, []);

    // Gestion des états : chargement et erreurs
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5dc">
                <CircularProgress />
                <Typography variant="h6" marginLeft={2}>Chargement des données...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5dc">
                <Typography variant="h6" color="error">Erreur : {error}</Typography>
            </Box>
        );
    }

    // Si aucune donnée n'est disponible
    if (!ingredientsData || !ingredientsData.ingredients?.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5dc">
                <Typography variant="h6">Aucun ingrédient trouvé dans le calendrier.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5dc', minHeight: '100vh', padding: 4 }}>
            <Typography variant="h4" gutterBottom>Ingrédients nécessaires</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nom</strong></TableCell>
                            <TableCell align="right"><strong>Quantité Totale</strong></TableCell>
                            <TableCell align="right"><strong>Prix Unitaire (€)</strong></TableCell>
                            <TableCell align="right"><strong>Coût Total (€)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredientsData.ingredients.map((ingredient, index) => (
                            <TableRow key={index}>
                                <TableCell>{ingredient.name || 'Inconnu'}</TableCell>
                                <TableCell align="right">{ingredient.totalQuantity || 0}</TableCell>
                                <TableCell align="right">{Number(ingredient.pricePerUnit || 0).toFixed(2)}</TableCell>
                                <TableCell align="right">{Number(ingredient.totalCost || 0).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h5" align="right" sx={{ marginTop: 2 }}>
                Total : {Number(ingredientsData.totalCost || 0).toFixed(2)} €
            </Typography>
        </Box>
    );
};

export default IngredientsWithPrices;
