import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    OutlinedInput,
    Alert,
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Add,
    Remove,
    CheckCircle
} from '@mui/icons-material';
import axios from 'axios';
import useRecipeStore from './RecipeStore.js';
import useCategoryStore from './UseCategoryStore.js';
import useIngredientStore from './IngredientStore.jsx';
import Toast from './Toast.jsx';
import { API_BASE_URL } from './config/api.config.js';

function AddRecipeImproved() {
    // États de base
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // États pour l'image
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState('');

    // États UI
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Stores
    const { addRecipe, fetchRecipes } = useRecipeStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { ingredients, fetchIngredients } = useIngredientStore();

    useEffect(() => {
        fetchCategories();
        fetchIngredients();
    }, [fetchCategories, fetchIngredients]);

    // Gestion de l'image
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Vérifier la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setToastType('error');
                setToastMessage('L\'image ne doit pas dépasser 5 MB');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) return null;

        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour uploader une image');
            return null;
        }

        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await axios.post(`${API_BASE_URL}/recipes/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsUploadingImage(false);
            setUploadedImagePath(response.data.filePath);
            setToastType('success');
            setToastMessage('Image uploadée avec succès !');
            return response.data.filePath;
        } catch (error) {
            setIsUploadingImage(false);
            setToastType('error');
            setToastMessage('Erreur lors de l\'upload de l\'image');
            console.error('Erreur upload:', error);
            return null;
        }
    };

    // Gestion des ingrédients
    const handleAddIngredient = (ingredientId) => {
        const ingredient = ingredients.find(ing => ing.id === ingredientId);
        if (ingredient && !selectedIngredients.find(si => si.id === ingredientId)) {
            setSelectedIngredients([...selectedIngredients, { ...ingredient, quantity: 1 }]);
        }
    };

    const handleRemoveIngredient = (ingredientId) => {
        setSelectedIngredients(selectedIngredients.filter(ing => ing.id !== ingredientId));
    };

    const handleQuantityChange = (ingredientId, quantity) => {
        setSelectedIngredients(
            selectedIngredients.map(ing =>
                ing.id === ingredientId ? { ...ing, quantity: parseFloat(quantity) || 1 } : ing
            )
        );
    };

    // Gestion des catégories
    const handleCategoryChange = (event) => {
        const categoryIds = event.target.value;
        const selectedCats = categories.filter(cat => categoryIds.includes(cat.id));
        setSelectedCategories(selectedCats);
    };

    // Calcul des calories totales
    const totalCalories = selectedIngredients.reduce((total, ing) => {
        return total + (ing.caloriesPerUnit || 0) * (ing.quantity || 1);
    }, 0);

    // Calcul du coût total
    const totalCost = selectedIngredients.reduce((total, ing) => {
        return total + (ing.price || 0) * (ing.quantity || 1);
    }, 0);

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            setToastType('error');
            setToastMessage('Le titre est requis');
            return;
        }
        if (selectedIngredients.length === 0) {
            setToastType('error');
            setToastMessage('Ajoutez au moins un ingrédient');
            return;
        }
        if (selectedCategories.length === 0) {
            setToastType('error');
            setToastMessage('Sélectionnez au moins une catégorie');
            return;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour ajouter une recette');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload de l'image si présente
            let imagePath = '';
            if (selectedImage && !uploadedImagePath) {
                imagePath = await uploadImage();
            } else {
                imagePath = uploadedImagePath;
            }

            // 2. Préparer les données de la recette
            const recipeData = {
                title: title.trim(),
                description: description.trim(),
                instructions: instructions.trim(),
                isPublished: true,
                ingredients: selectedIngredients.map(ing => ({
                    id: ing.id,
                    quantity: ing.quantity || 1
                })),
                categories: selectedCategories.map(cat => ({ id: cat.id })),
                imagePath: imagePath || undefined
            };

            console.log('Création de la recette:', recipeData);

            // 3. Créer la recette
            await addRecipe(recipeData, token);

            setToastType('success');
            setToastMessage('Recette créée avec succès !');

            // 4. Réinitialiser le formulaire
            setTitle('');
            setDescription('');
            setInstructions('');
            setSelectedIngredients([]);
            setSelectedCategories([]);
            setSelectedImage(null);
            setImagePreview(null);
            setUploadedImagePath('');

            // 5. Rafraîchir la liste des recettes
            await fetchRecipes();

        } catch (error) {
            console.error('Erreur lors de la création:', error);
            setToastType('error');
            setToastMessage('Erreur lors de la création de la recette');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', padding: 3 }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
                        ✨ Créer une nouvelle recette
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Informations de base */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    📝 Informations de base
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Titre de la recette"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    required
                                    placeholder="Ex: Poulet rôti aux herbes"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Décrivez brièvement votre recette..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Instructions"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    placeholder="Étapes de préparation..."
                                />
                            </Grid>

                            {/* Image */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    📸 Image
                                </Typography>
                                <Box sx={{ border: '2px dashed #007BFF', borderRadius: 2, p: 2, textAlign: 'center' }}>
                                    {imagePreview ? (
                                        <Box>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', marginBottom: '10px' }}
                                            />
                                            <Box>
                                                <Button
                                                    startIcon={<Delete />}
                                                    onClick={() => {
                                                        setSelectedImage(null);
                                                        setImagePreview(null);
                                                        setUploadedImagePath('');
                                                    }}
                                                    color="error"
                                                >
                                                    Supprimer
                                                </Button>
                                                {uploadedImagePath && (
                                                    <Chip
                                                        icon={<CheckCircle />}
                                                        label="Image uploadée"
                                                        color="success"
                                                        sx={{ ml: 1 }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="recipe-image-upload"
                                                type="file"
                                                onChange={handleImageChange}
                                            />
                                            <label htmlFor="recipe-image-upload">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    startIcon={<CloudUpload />}
                                                    disabled={isUploadingImage}
                                                >
                                                    {isUploadingImage ? 'Upload...' : 'Choisir une image'}
                                                </Button>
                                            </label>
                                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                                JPG, PNG (max 5MB)
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Grid>

                            {/* Catégories */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    🏷️ Catégories
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel>Sélectionnez les catégories *</InputLabel>
                                    <MuiSelect
                                        multiple
                                        value={selectedCategories.map(cat => cat.id)}
                                        onChange={handleCategoryChange}
                                        input={<OutlinedInput label="Sélectionnez les catégories *" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((id) => {
                                                    const cat = categories.find(c => c.id === id);
                                                    return <Chip key={id} label={cat?.name} size="small" />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </MuiSelect>
                                </FormControl>
                            </Grid>

                            {/* Ingrédients */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    🥘 Ingrédients
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Ajouter un ingrédient</InputLabel>
                                    <MuiSelect
                                        value=""
                                        onChange={(e) => handleAddIngredient(e.target.value)}
                                        label="Ajouter un ingrédient"
                                    >
                                        {ingredients
                                            .filter(ing => !selectedIngredients.find(si => si.id === ing.id))
                                            .map((ingredient) => (
                                                <MenuItem key={ingredient.id} value={ingredient.id}>
                                                    {ingredient.name} - {ingredient.price}€ ({ingredient.caloriesPerUnit} kcal)
                                                </MenuItem>
                                            ))}
                                    </MuiSelect>
                                </FormControl>

                                {selectedIngredients.length === 0 ? (
                                    <Alert severity="info">Ajoutez au moins un ingrédient à votre recette</Alert>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {selectedIngredients.map((ingredient) => (
                                            <Card key={ingredient.id} variant="outlined">
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography sx={{ flex: 1 }}>
                                                        {ingredient.name}
                                                    </Typography>
                                                    <TextField
                                                        label="Quantité"
                                                        type="number"
                                                        value={ingredient.quantity}
                                                        onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                                        sx={{ width: '100px' }}
                                                        inputProps={{ min: 0.1, step: 0.1 }}
                                                    />
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
                                                        {(ingredient.price * ingredient.quantity).toFixed(2)}€
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() => handleRemoveIngredient(ingredient.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Grid>

                            {/* Résumé */}
                            {selectedIngredients.length > 0 && (
                                <Grid item xs={12}>
                                    <Card sx={{ backgroundColor: '#f5f5f5' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                📊 Résumé
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1">
                                                        <strong>Ingrédients:</strong> {selectedIngredients.length}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1">
                                                        <strong>Catégories:</strong> {selectedCategories.length}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1" color="primary">
                                                        <strong>Calories totales:</strong> {totalCalories.toFixed(0)} kcal
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1" color="secondary">
                                                        <strong>Coût total:</strong> {totalCost.toFixed(2)}€
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Bouton de soumission */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Add />}
                                    sx={{ mt: 2 }}
                                >
                                    {isSubmitting ? 'Création en cours...' : 'Créer la recette'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Toast
                message={toastMessage}
                type={toastType}
                duration={3000}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
}

export default AddRecipeImproved;
