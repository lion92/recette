import React, { useEffect, useState } from 'react';
import './css/recette.css';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Modal,
    Box,
    IconButton
} from '@mui/material';
import { RemoveCircle } from '@mui/icons-material';
import useRecipeStore from './RecipeStore.js';
import useIngredientStore from "../src/IngredientStore.jsx";
import useCategoryStore from "../src/UseCategoryStore.js";
import Toast from './Toast.jsx';

const RecipeItem = ({ recipe }) => {
    const { updateRecipe, deleteRecipe, fetchRecipes } = useRecipeStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedRecipe, setUpdatedRecipe] = useState(recipe);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchIngredients();
        fetchCategories();
    }, [fetchIngredients, fetchCategories]);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    const handleDelete = async (recipeId) => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour supprimer une recette.');
            return;
        }

        try {
            await deleteRecipe(recipeId, token);
            setToastType('success');
            setToastMessage('Recette supprimée avec succès !');
            await fetchRecipes();
            handleModalClose();
        } catch (error) {
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la suppression de la recette.");
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour modifier une recette.');
            return;
        }

        try {
            await updateRecipe(recipe.id, updatedRecipe, token);
            setToastType('success');
            setToastMessage('Recette mise à jour avec succès !');
            setIsEditing(false);
            await fetchRecipes();
        } catch (error) {
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la mise à jour de la recette.");
        }
    };

    const handleIngredientChange = (event) => {
        setUpdatedRecipe({ ...updatedRecipe, ingredients: event.target.value });
    };

    const handleCategoryChange = (event) => {
        setUpdatedRecipe({ ...updatedRecipe, categories: event.target.value });
    };

    const removeIngredient = (index) => {
        const newIngredients = [...updatedRecipe.ingredients];
        newIngredients.splice(index, 1);
        setUpdatedRecipe({ ...updatedRecipe, ingredients: newIngredients });
    };

    const removeCategory = (index) => {
        const newCategories = [...updatedRecipe.categories];
        newCategories.splice(index, 1);
        setUpdatedRecipe({ ...updatedRecipe, categories: newCategories });
    };

    return (
        <div className="card">
            <div className="card--image-wrapper" onClick={handleModalOpen}>
                <div className="card--view">
                    <p>Voir la recette</p>
                </div>
                <div className="card--image"></div>
            </div>

            <Modal open={openModal} onClose={handleModalClose}>
                <Box className="modal-content">
                    <div className="modal-header">
                        <Button color="primary" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Annuler' : 'Modifier'}
                        </Button>
                        <Button color="secondary" onClick={() => handleDelete(recipe.id)}>
                            Supprimer
                        </Button>
                    </div>

                    <div className="modal-body">
                        {isEditing ? (
                            <>
                                <div style={{ height: "150px", position: "relative" }} className="card--image"></div>
                                <TextField
                                    label="Titre"
                                    fullWidth
                                    margin="normal"
                                    value={updatedRecipe.title}
                                    onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, title: e.target.value })}
                                />
                                <TextField
                                    label="Description"
                                    fullWidth
                                    margin="normal"
                                    value={updatedRecipe.description}
                                    onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, description: e.target.value })}
                                />
                                <TextField
                                    label="Instructions"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    margin="normal"
                                    value={updatedRecipe.instructions}
                                    onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, instructions: e.target.value })}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Ingrédients</InputLabel>
                                    <Select
                                        multiple
                                        value={updatedRecipe.ingredients || []}
                                        onChange={handleIngredientChange}
                                        renderValue={(selected) => selected.map((ingredient) => ingredient.name).join(', ')}
                                    >
                                        {ingredients.map((ingredient) => (
                                            <MenuItem key={ingredient.id} value={ingredient}>
                                                {ingredient.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <ul>
                                    {updatedRecipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>
                                            {ingredient.name}
                                            <IconButton onClick={() => removeIngredient(index)} color="error">
                                                <RemoveCircle />
                                            </IconButton>
                                        </li>
                                    ))}
                                </ul>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Catégories</InputLabel>
                                    <Select
                                        multiple
                                        value={updatedRecipe.categories || []}
                                        onChange={handleCategoryChange}
                                        renderValue={(selected) => selected.map((category) => category.name).join(', ')}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <ul>
                                    {updatedRecipe.categories.map((category, index) => (
                                        <li key={index}>
                                            {category.name}
                                            <IconButton onClick={() => removeCategory(index)} color="error">
                                                <RemoveCircle />
                                            </IconButton>
                                        </li>
                                    ))}
                                </ul>
                                <Button onClick={handleUpdate} color="primary">
                                    Enregistrer
                                </Button>
                            </>
                        ) : (
                            <>
                                <div style={{ height: "150px", position: "relative" }} className="card--image"></div>
                                <h1>{recipe?.title}</h1>
                                <p>{recipe?.user?.email}</p>
                                <p>{recipe?.description}</p>
                                <p>{recipe?.instructions}</p>
                                <p>Prix total : {recipe.totalCost} €</p>
                                <p>Calories totales : {(recipe.totalCalories / 100).toFixed(2)} kCal</p>
                                <h5>Ingrédients :</h5>
                                <ul>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient.name} - {ingredient.price} €</li>
                                    ))}
                                </ul>
                                <h5>Catégories :</h5>
                                <ul>
                                    {recipe.categories.map((category, index) => (
                                        <li key={index}>{category.name}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </Box>
            </Modal>

            <Toast
                message={toastMessage}
                type={toastType}
                duration={3000}
                onClose={() => setToastMessage('')}
            />
        </div>
    );
};

export default RecipeItem;
