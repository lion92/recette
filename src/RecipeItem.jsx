import React, { useEffect, useState } from 'react';
import './css/recette.css';
import useRecipeIdStore from './RecipeIdStore.js';
import {
    Button,
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
    const {selectRecipe, updateRecipe, deleteRecipe } = useRecipeStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
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

    const removeIngredient = (index) => {
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

    const removeCategory = (index) => {
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
                    setIsEditing(!isEditing);
                }}
            >
                {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
            <div className="card--image-wrapper">
                <div className="card--view">
                    <p>Voir la recette</p>
                </div>
                <div className="card--image"></div>
            </div>
            <div className="card--content-wrapper">
                {isEditing ? (
                    <>
                        <TextField
                            label="Titre"
                            fullWidth
                            margin="normal"
                            value={updatedRecipe.title}
                            onChange={(e) => setUpdatedRecipe({...updatedRecipe, title: e.target.value})}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            value={updatedRecipe.description}
                            onChange={(e) => setUpdatedRecipe({...updatedRecipe, description: e.target.value})}
                        />
                        <TextField
                            label="Instructions"
                            fullWidth
                            margin="normal"
                            value={updatedRecipe.instructions}
                            onChange={(e) => setUpdatedRecipe({...updatedRecipe, instructions: e.target.value})}
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
                            {updatedRecipe.ingredients && updatedRecipe.ingredients.length > 0 ? (
                                updatedRecipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        {ingredient.name}
                                        <Button onClick={() => removeIngredient(index)}>Supprimer</Button>
                                    </li>
                                ))
                            ) : (
                                <li>Aucun ingrédient spécifié</li>
                            )}
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
                            {updatedRecipe.categories && updatedRecipe.categories.length > 0 ? (
                                updatedRecipe.categories.map((category, index) => (
                                    <li key={index}>
                                        {category.name}
                                        <Button onClick={() => removeCategory(index)}>Supprimer</Button>
                                    </li>
                                ))
                            ) : (
                                <li>Aucune catégorie spécifiée</li>
                            )}
                        </ul>
                        <Button onClick={handleUpdate} color="primary">
                            Enregistrer
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 className="card--title">{recipe.title}</h1>
                        <p className="card--description">{recipe.description}</p>
                        <p className="card--description">{recipe.instructions}</p>
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
