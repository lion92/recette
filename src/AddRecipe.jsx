import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    FormGroup,
} from '@mui/material';
import Select from 'react-select'; // Pour la sélection multiple
import useRecipeStore from './recipeStore'; // Store pour les recettes
import useCategoryStore from './useCategoryStore'; // Store pour les catégories
import useIngredientStore from '../src/IngredientStore.jsx'; // Store pour les ingrédients
import Toast from "./Toast.jsx"; // Toast pour les notifications

function AddRecipe() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]); // Sélection d'ingrédients
    const [selectedCategories, setSelectedCategories] = useState([]); // Sélection de catégories
    const [totalCalories, setTotalCalories] = useState(0); // Calories totales
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    // Récupération des recettes, catégories et ingrédients depuis les stores
    const { addRecipe, fetchRecipes } = useRecipeStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { ingredients, fetchIngredients } = useIngredientStore();

    // Chargement des catégories et ingrédients lorsque le composant est monté
    useEffect(() => {
        fetchCategories();
        fetchIngredients();
    }, [fetchCategories, fetchIngredients]);

    // Calcul des calories totales en fonction des ingrédients sélectionnés
    useEffect(() => {
        const calculateTotalCalories = () => {
            let total = 0;
            selectedIngredients.forEach((ingredient) => {
                const ing = ingredients.find((i) => i.id === ingredient.value);
                if (ing) {
                    total += ing.caloriesPerUnit * (ing.defaultQuantity || 1);
                }
            });
            setTotalCalories(total);
        };
        calculateTotalCalories();
    }, [selectedIngredients, ingredients]);

    // Soumission du formulaire pour ajouter une recette
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour l'authentification
        if (!token) {
            setToastType("error");
            setToastMessage('Vous devez être connecté pour ajouter une recette');
            return;
        }

        const recipeData = {
            title,
            description,
            instructions,
            isPublished,
            ingredients: selectedIngredients.map((ingredient) => ingredient.value), // IDs des ingrédients
            categories: selectedCategories.map((category) => category.value), // IDs des catégories
            totalCalories, // Calories totales de la recette
        };

        try {
            if (recipeData.ingredients.length === 0) {
                setToastType("error");
                setToastMessage('Veuillez ajouter des ingrédients');
                return;
            }
            if (recipeData.categories.length === 0) {
                setToastType("error");
                setToastMessage('Veuillez ajouter des catégories');
                return;
            }
            await addRecipe(recipeData, token).catch(() => {
                setToastType("error");
                setToastMessage('Erreur lors de l’ajout de la recette');
            }).then(() => {
                setToastType("success");
                setToastMessage('Recette ajoutée avec succès');
            });

            // Réinitialiser les champs après l'ajout
            setTitle('');
            setDescription('');
            setInstructions('');
            setSelectedIngredients([]);
            setSelectedCategories([]);
            setIsPublished(false);
            setTotalCalories(0); // Réinitialiser les calories
            fetchRecipes(); // Actualiser la liste des recettes

        } catch (error) {
            setToastType("error");
            setToastMessage('Erreur lors de l’ajout de la recette');
        }
    };

    return (
        <Box display="flex" sx={{ backgroundColor: "white", padding: "10px", maxWidth: "400px", margin: "auto", marginTop: "20px" }} flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom>Ajouter une nouvelle recette</Typography>
            <form onSubmit={handleSubmit} style={{ maxWidth: 600, width: '100%' }}>
                <FormGroup>
                    <TextField
                        label="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <div style={{ margin: '16px 0' }}>
                        <label>Catégories :</label>
                        <Select
                            isMulti
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            options={categories.map((category) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                            placeholder="Sélectionnez les catégories"
                        />
                    </div>
                    <div style={{ margin: '16px 0' }}>
                        <label>Ingrédients :</label>
                        <Select
                            isMulti
                            value={selectedIngredients}
                            onChange={setSelectedIngredients}
                            options={ingredients.map((ingredient) => ({
                                value: ingredient.id,
                                label: ingredient.name,
                            }))}
                            placeholder="Sélectionnez les ingrédients"
                        />
                    </div>
                    <Typography variant="body1" color="textSecondary" sx={{ margin: '16px 0' }}>
                        Calories totales : {totalCalories} kcal
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPublished}
                                onChange={() => setIsPublished(!isPublished)}
                            />
                        }
                        label="Publier la recette ?"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        Ajouter la recette
                    </Button>
                </FormGroup>
            </form>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default AddRecipe;
