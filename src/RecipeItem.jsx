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
    IconButton,
    CircularProgress,
    Typography
} from '@mui/material';
import { RemoveCircle, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import useRecipeStore from './RecipeStore.js';
import useIngredientStore from "../src/IngredientStore.jsx";
import useCategoryStore from "../src/UseCategoryStore.js";
import Toast from './Toast.jsx';
import { API_BASE_URL } from './config/api.config.js';
import placeholderImage from './assets/placeholder-recipe.svg';
import SimpleImageUpload from './SimpleImageUpload.jsx';

const RecipeItem = ({ recipe }) => {
    const { updateRecipe, deleteRecipe, fetchRecipes } = useRecipeStore();
    const { ingredients, fetchIngredients } = useIngredientStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Helper pour construire l'URL de l'image
    const getImageUrl = (imagePath) => {
        // Si pas d'image ou chaîne vide, retourner l'image placeholder
        if (!imagePath || imagePath.trim() === '') return placeholderImage;
        // Si l'image commence déjà par http, on la retourne telle quelle
        if (imagePath.startsWith('http')) return imagePath;
        // Si c'est une image base64, on la retourne telle quelle
        if (imagePath.startsWith('data:image')) return imagePath;
        // Si c'est un chemin relatif commençant par /uploads, on construit l'URL complète
        if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
            const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
            return `${API_BASE_URL}${cleanPath}`;
        }
        // Sinon, on retourne tel quel (probablement déjà une URL complète)
        return imagePath;
    };
    const [updatedRecipe, setUpdatedRecipe] = useState({
        ...recipe,
        ingredients: recipe?.recipeIngredients
            ? recipe.recipeIngredients.map(ri => ({
                ...ri.ingredient,
                quantity: ri.quantity || 1 // Utilise une quantité par défaut de 1 si non définie
            }))
            : recipe?.ingredients?.map(ing => ({
            ...ing,
            quantity: ing.quantity || 1
        })) || []
    });
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
            let recipeToUpdate = { ...updatedRecipe };
            console.log('Début mise à jour recette, image sélectionnée:', selectedImage ? selectedImage.name : 'aucune');

            // Si une nouvelle image a été sélectionnée, l'uploader d'abord
            if (selectedImage) {
                console.log('Upload de l\'image en cours...');
                const uploadedImagePath = await uploadImage();
                console.log('Chemin de l\'image uploadée:', uploadedImagePath);
                if (uploadedImagePath) {
                    recipeToUpdate.imagePath = uploadedImagePath;
                    console.log('Image path ajouté à la recette:', recipeToUpdate.imagePath);
                }
            }

            // Transformer les ingrédients au bon format pour le backend
            // Seulement si les ingrédients existent et ont des IDs valides
            if (recipeToUpdate.ingredients && recipeToUpdate.ingredients.length > 0) {
                const ingredientsMap = new Map();

                // Filtrer les ingrédients avec ID valide et retirer les doublons
                recipeToUpdate.ingredients
                    .filter(ingredient => ingredient.id)
                    .forEach(ingredient => {
                        // Si l'ingrédient existe déjà, additionner les quantités
                        if (ingredientsMap.has(ingredient.id)) {
                            const existing = ingredientsMap.get(ingredient.id);
                            existing.quantity += (ingredient.quantity || 1);
                        } else {
                            ingredientsMap.set(ingredient.id, {
                                id: ingredient.id,
                                quantity: ingredient.quantity || 1
                            });
                        }
                    });

                recipeToUpdate.ingredients = Array.from(ingredientsMap.values());
            }

            // Si on change juste l'image sans les ingrédients, ne pas envoyer un tableau vide
            if (!recipeToUpdate.ingredients || recipeToUpdate.ingredients.length === 0) {
                delete recipeToUpdate.ingredients;
            }

            console.log('Mise à jour de la recette avec:', recipeToUpdate);
            await updateRecipe(recipe.id, recipeToUpdate, token);
            setToastType('success');
            setToastMessage('Recette mise à jour avec succès !');
            setIsEditing(false);
            setSelectedImage(null);
            setImagePreview(null);
            await fetchRecipes();
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            setToastType('error');
            setToastMessage("Une erreur s'est produite lors de la mise à jour de la recette.");
        }
    };

    const handleIngredientChange = (event) => {
        setUpdatedRecipe({ ...updatedRecipe, ingredients: event.target.value });
    };

    const handleIngredientQuantityChange = (index, quantity) => {
        const newIngredients = [...updatedRecipe.ingredients];
        newIngredients[index].quantity = parseFloat(quantity) || 1; // Valeur par défaut de 1
        setUpdatedRecipe({ ...updatedRecipe, ingredients: newIngredients });
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Créer une prévisualisation
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) {
            console.log('Aucune image sélectionnée');
            return null;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté pour uploader une image.');
            return null;
        }

        console.log('Début upload image:', selectedImage.name);
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            console.log('Envoi vers:', `${API_BASE_URL}/recipes/upload`);
            const response = await axios.post(`${API_BASE_URL}/recipes/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload réussi, chemin:', response.data.filePath);
            setIsUploadingImage(false);
            setToastType('success');
            setToastMessage('Image uploadée avec succès !');
            return response.data.filePath;
        } catch (error) {
            setIsUploadingImage(false);
            setToastType('error');
            setToastMessage("Erreur lors de l'upload de l'image");
            console.error("Erreur lors de l'upload de l'image:", error);
            console.error("Réponse erreur:", error.response?.data);
            return null;
        }
    };

    return (
        <div className="card">
            <div className="card--image-wrapper" onClick={handleModalOpen}>
                <div className="card--view">
                    <p>Voir la recette</p>
                </div>
                <img
                    src={getImageUrl(recipe.imagePath)}
                    alt={recipe.title || "Recette"}
                    className="card--image"
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = placeholderImage;
                    }}
                />
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
                        {/* Test Upload Simple - TOUJOURS VISIBLE */}
                        <SimpleImageUpload recipeId={recipe.id} />
                        <hr style={{ margin: '20px 0' }} />

                        {isEditing ? (
                            <>
                                {/* Formulaire d'édition */}
                                {/* Prévisualisation de l'image */}
                                <Box sx={{ mb: 2 }}>
                                    <img
                                        src={imagePreview || getImageUrl(recipe.imagePath)}
                                        alt={recipe.title || "Recette"}
                                        style={{ width: '100%', height: 'auto', marginBottom: '10px', borderRadius: '8px' }}
                                    />
                                </Box>

                                {/* Upload d'image */}
                                <Box sx={{ mb: 2 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="upload-image-button"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="upload-image-button">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={isUploadingImage ? <CircularProgress size={20} /> : <CloudUpload />}
                                            disabled={isUploadingImage}
                                            fullWidth
                                        >
                                            {isUploadingImage ? 'Upload en cours...' : selectedImage ? 'Changer l\'image' : 'Ajouter une image'}
                                        </Button>
                                    </label>
                                    {selectedImage && (
                                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                                            ✓ Image sélectionnée: {selectedImage.name}
                                        </Typography>
                                    )}
                                </Box>

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
                                            <TextField
                                                label="Quantité"
                                                type="number"
                                                value={ingredient.quantity}
                                                onChange={(e) => handleIngredientQuantityChange(index, e.target.value)}
                                                style={{ width: '60px', marginLeft: '10px' }}
                                            />
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
                                {recipe.imagePath && (
                                    <img
                                        src={getImageUrl(recipe.imagePath)}
                                        alt={recipe.title || "Recette"}
                                        style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                                    />
                                )}
                                <h1>{recipe?.title}</h1>
                                <p>{recipe?.user?.email}</p>
                                <p>{recipe?.description}</p>
                                <p>{recipe?.instructions}</p>
                                <p>Prix total : {recipe.totalCost} €</p>
                                <p>Calories totales : {(recipe.totalCalories / 100).toFixed(2)} kCal</p>
                                <h5>Ingrédients :</h5>
                                <ul>
                                    {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 ? (
                                        recipe.recipeIngredients.map((ri, index) => (
                                            <li key={index}>{ri.ingredient.name} - {ri.ingredient.price} € (Quantité : {ri.quantity})</li>
                                        ))
                                    ) : recipe.ingredients && recipe.ingredients.length > 0 ? (
                                        recipe.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient.name} - {ingredient.price} € (Quantité : {ingredient.quantity})</li>
                                        ))
                                    ) : (
                                        <li>Aucun ingrédient disponible</li>
                                    )}
                                </ul>
                                <h5>Catégories :</h5>
                                <ul>
                                    {recipe.categories && recipe.categories.length > 0 ? (
                                        recipe.categories.map((category, index) => (
                                            <li key={index}>{category.name}</li>
                                        ))
                                    ) : (
                                        <li>Aucune catégorie disponible</li>
                                    )}
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
