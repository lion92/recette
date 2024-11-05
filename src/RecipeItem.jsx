import React, { useEffect, useState } from 'react';
import './css/recette.css';
import useRecipeIdStore from './RecipeIdStore.js';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import useRecipeStore from './RecipeStore.js';
import Toast from './Toast.jsx';
import useIngredientStore from "../src/IngredientStore.jsx"; // Vérifiez le chemin correct
import useCategoryStore from "../src/UseCategoryStore.js"; // Vérifiez le chemin correct

const RecipeItem = ({ recipe }) => {
    const { selectedRecipeId, selectRecipe } = useRecipeIdStore();
    const { addRecipe, fetchRecipes, updateRecipe} = useRecipeStore();
    const { ingredients, fetchIngredients, deleteIngredient } = useIngredientStore();
    const { categories, fetchCategories, deleteCategory } = useCategoryStore();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [updatedRecipe, setUpdatedRecipe] = useState(recipe);

    useEffect(() => {
        fetchIngredients();
        fetchCategories();
    }, [fetchIngredients, fetchCategories]);

    const handleSelect = () => {
        selectRecipe(recipe.id);
    };

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
        } catch (error) {
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la suppression de la recette.");
            console.error('Erreur lors de la suppression de la recette:', error);
        }
    };

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
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
            handleCloseEditDialog();
        } catch (error) {
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la mise à jour de la recette.");
            console.error('Erreur lors de la mise à jour de la recette:', error);
        }
    };

    const handleIngredientChange = (event) => {
        setUpdatedRecipe({ ...updatedRecipe, ingredients: event.target.value });
    };

    const handleCategoryChange = (event) => {
        setUpdatedRecipe({ ...updatedRecipe, categories: event.target.value });
    };

    const addIngredient = () => {
        setUpdatedRecipe({
            ...updatedRecipe,
            ingredients: [...(updatedRecipe.ingredients || []), { id: null, name: 'Nouvel Ingrédient' }]
        });
    };

    const removeIngredient = async (index) => {
        const ingredientToRemove = updatedRecipe.ingredients[index];
        if (ingredientToRemove && ingredientToRemove.id) {
            try {
                await deleteIngredient(ingredientToRemove.id); // Suppression de l'ingrédient dans le store
                setToastType('success');
                setToastMessage('Ingrédient supprimé avec succès !');
            } catch (error) {
                setToastType('error');
                setToastMessage("Erreur lors de la suppression de l'ingrédient.");
                console.error("Erreur lors de la suppression de l'ingrédient:", error);
                return;
            }
        }

        // Supprime l'ingrédient de la liste locale
        const newIngredients = [...updatedRecipe.ingredients];
        newIngredients.splice(index, 1);
        setUpdatedRecipe({ ...updatedRecipe, ingredients: newIngredients });
    };

    const addCategory = () => {
        setUpdatedRecipe({
            ...updatedRecipe,
            categories: [...(updatedRecipe.categories || []), { id: null, name: 'Nouvelle Catégorie' }]
        });
    };

    const removeCategory = async (index) => {
        const categoryToRemove = updatedRecipe.categories[index];
        if (categoryToRemove && categoryToRemove.id) {
            try {
                await deleteCategory(categoryToRemove.id); // Suppression de la catégorie dans le store
                setToastType('success');
                setToastMessage('Catégorie supprimée avec succès !');
            } catch (error) {
                setToastType('error');
                setToastMessage("Erreur lors de la suppression de la catégorie.");
                console.error("Erreur lors de la suppression de la catégorie:", error);
                return;
            }
        }

        // Supprime la catégorie de la liste locale
        const newCategories = [...updatedRecipe.categories];
        newCategories.splice(index, 1);
        setUpdatedRecipe({ ...updatedRecipe, categories: newCategories });
    };

    return (
        <div className="card" onClick={handleSelect}>
            <Button
                color="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(recipe.id);
                }}
            >
                Supprimer
            </Button>
            <Button
                color="secondary"
                onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditDialog();
                }}
            >
                Modifier
            </Button>
            <div className="card--image-wrapper">
                <div className="card--view">
                    <p>Voir la recette</p>
                </div>
                <div className="card--image"></div>
            </div>
            <div className="card--content-wrapper">
                <h1 className="card--title">{recipe.title}</h1>
                <div className="card--recipe-info">
                    <h2 className="card--recipe-category">
                        {recipe.categories && recipe.categories.length > 0
                            ? recipe.categories.map((category) => "Catégorie : " + category.name).join(', ')
                            : 'Aucune catégorie'}
                    </h2>
                </div>
                <p className="card--description">{recipe.description}</p>
                <p className="card--description">{recipe.instructions}</p>
                <p>Prix total : {recipe.totalCost} €</p>
                <p>Calories totales : {(recipe.totalCalories / 100).toFixed(2)} kCal</p>

                <div className="card--ingredients">
                    <h5>Ingrédients :</h5>
                    <ul>
                        {updatedRecipe.ingredients && updatedRecipe.ingredients.length > 0 ? (
                            updatedRecipe.ingredients.map((ingredient, index) => (
                                <li key={ingredient.id || index}>
                                    {ingredient.name || 'Non spécifié'} - {ingredient.price || 0} €
                                    <Button onClick={() => removeIngredient(index)}>Supprimer</Button>
                                </li>
                            ))
                        ) : (
                            <li>Aucun ingrédient spécifié</li>
                        )}
                    </ul>
                </div>

                <div className="card--categories">
                    <h5>Catégories :</h5>
                    <ul>
                        {updatedRecipe.categories && updatedRecipe.categories.length > 0 ? (
                            updatedRecipe.categories.map((category, index) => (
                                <li key={category.id || index}>
                                    {category.name || 'Non spécifié'}
                                    <Button onClick={() => removeCategory(index)}>Supprimer</Button>
                                </li>
                            ))
                        ) : (
                            <li>Aucune catégorie spécifiée</li>
                        )}
                    </ul>
                </div>
            </div>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Modifier la recette</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Annuler</Button>
                    <Button onClick={handleUpdate} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

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
