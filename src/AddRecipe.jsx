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
import Select from 'react-select';
import useRecipeStore from './recipeStore';
import useCategoryStore from './useCategoryStore';
import useIngredientStore from '../src/IngredientStore.jsx';
import Toast from './Toast.jsx';

function AddRecipe() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [step, setStep] = useState(1);
    const [imageBase64, setImageBase64] = useState(''); // Image en base64

    const { addRecipe, fetchRecipes } = useRecipeStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { ingredients, fetchIngredients } = useIngredientStore();

    useEffect(() => {
        fetchCategories();
        fetchIngredients();
    }, [fetchCategories, fetchIngredients]);

    useEffect(() => {
        const calculateTotalCalories = () => {
            let total = 0;
            selectedIngredients.forEach((ingredient) => {
                const ing = ingredients.find((i) => i.id === ingredient.value);
                if (ing) {
                    total += ing.caloriesPerUnit * (ingredient.quantity || 1);
                }
            });
            setTotalCalories(total);
        };
        calculateTotalCalories();
    }, [selectedIngredients, ingredients]);

    const handleQuantityChange = (ingredientId, quantity) => {
        setSelectedIngredients((prevSelectedIngredients) =>
            prevSelectedIngredients.map((ingredient) =>
                ingredient.value === ingredientId
                    ? { ...ingredient, quantity: parseFloat(quantity) || 1 }
                    : ingredient
            )
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Vérification de la taille du fichier (1 Mo = 1 048 576 octets)

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800; // Largeur maximale souhaitée
                    const maxHeight = 600; // Hauteur maximale souhaitée
                    let width = img.width;
                    let height = img.height;

                    // Redimensionner l'image si nécessaire
                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Vérifier le type d'image d'origine et conserver le format
                    const imageType = file.type || 'image/png'; // Par défaut, PNG si le type est inconnu
                    const base64Image = canvas.toDataURL(imageType, 0.8); // Utiliser le type d'origine et 80% de qualité

                    setImageBase64(base64Image);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour ajouter une recette');
            return;
        }

        const recipeData = {
            title,
            description,
            instructions,
            isPublished,
            ingredients: selectedIngredients.map((ingredient) => ({
                id: ingredient.value,
                quantity: ingredient.quantity || 1,
            })),
            categories: selectedCategories.map((category) => ({ id: category.value })),
            totalCalories,
            imagePath: imageBase64, // Ajout de l'image en base64
        };

        if (recipeData.ingredients.length === 0) {
            setToastType('error');
            setToastMessage('Veuillez ajouter des ingrédients');
            return;
        }
        if (recipeData.categories.length === 0) {
            setToastType('error');
            setToastMessage('Veuillez ajouter des catégories');
            return;
        }

        try {
            await addRecipe(recipeData, token);
            setToastType('success');
            setToastMessage('Recette ajoutée avec succès');

            // Réinitialisation des champs
            setTitle('');
            setDescription('');
            setInstructions('');
            setSelectedIngredients([]);
            setSelectedCategories([]);
            setIsPublished(false);
            setTotalCalories(0);
            setImageBase64(''); // Réinitialisation de l'image
            fetchRecipes();
        } catch (error) {
            setToastType('error');
            setToastMessage('Erreur lors de l’ajout de la recette');
            console.error('Erreur lors de l’ajout de la recette:', error);
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <Box display="flex" sx={{ backgroundColor: 'white', padding: '10px', maxWidth: '600px', margin: 'auto', marginTop: '20px' }} flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom>Ajouter une nouvelle recette</Typography>
            <form onSubmit={handleSubmit} style={{ maxWidth: 600, width: '100%' }}>
                <FormGroup>
                    {step === 1 && (
                        <>
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
                            <Button onClick={nextStep} variant="contained" color="primary">Suivant</Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
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
                            <Button onClick={previousStep}>Précédent</Button>
                            <Button onClick={nextStep} variant="contained" color="primary">Suivant</Button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div style={{ margin: '16px 0' }}>
                                <label>Ingrédients :</label>
                                <Select
                                    isMulti
                                    value={selectedIngredients}
                                    onChange={(selected) => {
                                        const updatedSelection = selected.map((sel) => ({
                                            ...sel,
                                            quantity: 1,
                                        }));
                                        setSelectedIngredients(updatedSelection);
                                    }}
                                    options={ingredients.map((ingredient) => ({
                                        value: ingredient.id,
                                        label: ingredient.name,
                                    }))}
                                    placeholder="Sélectionnez les ingrédients"
                                />
                            </div>
                            {selectedIngredients.map((ingredient) => (
                                <div key={ingredient.value} style={{ marginBottom: '8px' }}>
                                    <TextField
                                        label={`Quantité pour ${ingredient.label}`} // Correction de la balise pour afficher correctement le texte
                                        type="number"
                                        value={ingredient.quantity || 1}
                                        onChange={(e) => handleQuantityChange(ingredient.value, e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </div>
                            ))}
                            <Button onClick={previousStep}>Précédent</Button>
                            <Button onClick={nextStep} variant="contained" color="primary">Suivant</Button>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <div style={{ margin: '16px 0' }}>
                                <label>Image de la recette :</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                            </div>
                            <Button onClick={previousStep}>Précédent</Button>
                            <Button onClick={nextStep} variant="contained" color="primary">Suivant</Button>
                        </>
                    )}
                    {step === 5 && (
                        <>
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
                            <Button onClick={previousStep}>Précédent</Button>
                            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
                                Ajouter la recette
                            </Button>
                        </>
                    )}
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
export default AddRecipe