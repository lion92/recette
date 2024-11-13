import React, { useEffect, useState } from 'react';
import RecipeList from './RecipeList.jsx';
import './css/recette.css';
import useRecipeStore from "./recipeStore";
import useCategoryStore from './useCategoryStore';
import useIngredientStore from './IngredientStore.jsx';
import Select from 'react-select';
import {
    Button,
    Typography,
    Box,
    FormGroup,
} from '@mui/material';
import Toast from "./Toast.jsx";

function Recipes() {
    const {
        recipes,
        filteredRecipes,
        fetchRecipes,
        filterByCategoriesAndIngredients,
    } = useRecipeStore();

    const { categories, fetchCategories } = useCategoryStore();
    const { ingredients, fetchIngredients } = useIngredientStore();

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    useEffect(() => {
        fetchRecipes();
        fetchCategories();
        fetchIngredients();
    }, [fetchRecipes, fetchCategories, fetchIngredients]);

    const handleAddCategory = (selected) => {
        setSelectedCategories(selected);
    };

    const handleAddIngredient = (selected) => {
        setSelectedIngredients(selected);
    };

    const applyFilters = async () => {
        if (selectedCategories.length > 0 || selectedIngredients.length > 0) {
            const filtered = await filterByCategoriesAndIngredients(
                selectedCategories.map((cat) => cat.value),
                selectedIngredients.map((ing) => ing.value)
            );
            if (filtered.length > 0) {
                setToastType("info");
                setToastMessage('Filtrage appliqué avec succès');
            } else {
                setToastType("warning");
                setToastMessage('Aucune recette ne correspond aux filtres');
            }
        } else {
            await fetchRecipes(); // Remet la liste complète si aucun filtre n'est appliqué
            setToastType("info");
            setToastMessage('Aucun filtre appliqué, toutes les recettes sont affichées');
        }
    };

    // Utiliser les recettes filtrées si elles existent, sinon les recettes complètes
    const displayedRecipes = filteredRecipes.length > 0 ? filteredRecipes : recipes;

    return (
        <Box sx={{ backgroundColor: "white", padding: "20px", maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
            <Typography variant="h4" gutterBottom>Liste des recettes</Typography>
            <FormGroup style={{ width: '100%', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label>Catégories :</label>
                    <Select
                        isMulti
                        value={selectedCategories}
                        onChange={handleAddCategory}
                        options={categories.map((category) => ({
                            value: category.id,
                            label: category.name,
                        }))}
                        placeholder="Sélectionnez les catégories"
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label>Ingrédients :</label>
                    <Select
                        isMulti
                        value={selectedIngredients}
                        onChange={handleAddIngredient}
                        options={ingredients.map((ingredient) => ({
                            value: ingredient.id,
                            label: ingredient.name,
                        }))}
                        placeholder="Sélectionnez les ingrédients"
                    />
                </div>
                <Button onClick={applyFilters} variant="contained" color="primary" fullWidth>
                    Appliquer les filtres
                </Button>
            </FormGroup>
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
            {displayedRecipes.length > 0 ? (
                <div className="recipes-grid">
                    <RecipeList recipes={displayedRecipes} />
                </div>
            ) : (
                <p className="no-recipes-message">Aucune recette disponible</p>
            )}
        </Box>
    );
}

export default Recipes;
