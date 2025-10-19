import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from './config/api.config.js';
import Toast from './Toast.jsx';

const SimpleImageUpload = ({ recipeId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Fichier sélectionné:', file.name);
            setSelectedImage(file);
            // Créer une prévisualisation
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAndUpdateRecipe = async () => {
        if (!selectedImage) {
            setToastType('error');
            setToastMessage('Veuillez sélectionner une image');
            return;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            setToastType('error');
            setToastMessage('Vous devez être connecté');
            return;
        }

        try {
            setIsUploading(true);
            console.log('=== DÉBUT UPLOAD ===');

            // Étape 1: Upload de l'image
            const formData = new FormData();
            formData.append('file', selectedImage);

            console.log('Envoi de l\'image vers:', `${API_BASE_URL}/recipes/upload`);
            const uploadResponse = await axios.post(`${API_BASE_URL}/recipes/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imagePath = uploadResponse.data.filePath;
            console.log('Image uploadée, chemin:', imagePath);

            // Étape 2: Mise à jour de la recette avec juste l'image
            console.log('Mise à jour de la recette ID:', recipeId);
            const updateResponse = await axios.put(
                `${API_BASE_URL}/recipes/${recipeId}`,
                { imagePath: imagePath },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('Recette mise à jour:', updateResponse.data);
            setToastType('success');
            setToastMessage('Image ajoutée avec succès !');
            setSelectedImage(null);
            setImagePreview(null);

            // Rafraîchir la page après 1 seconde
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Erreur:', error);
            console.error('Détails de l\'erreur:', error.response?.data);
            setToastType('error');
            setToastMessage('Erreur lors de l\'ajout de l\'image: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ p: 2, border: '2px dashed #007BFF', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Test Upload Image Simple
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Recette ID: {recipeId}
            </Typography>

            {imagePreview && (
                <Box sx={{ my: 2 }}>
                    <img
                        src={imagePreview}
                        alt="Aperçu"
                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                    />
                </Box>
            )}

            <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`simple-upload-${recipeId}`}
                type="file"
                onChange={handleImageChange}
            />
            <label htmlFor={`simple-upload-${recipeId}`}>
                <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ mr: 1 }}
                >
                    Choisir une image
                </Button>
            </label>

            <Button
                variant="contained"
                onClick={uploadAndUpdateRecipe}
                disabled={!selectedImage || isUploading}
                startIcon={isUploading ? <CircularProgress size={20} /> : null}
            >
                {isUploading ? 'Upload en cours...' : 'Uploader et enregistrer'}
            </Button>

            {selectedImage && (
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                    ✓ {selectedImage.name}
                </Typography>
            )}

            <Toast
                message={toastMessage}
                type={toastType}
                duration={3000}
                onClose={() => setToastMessage('')}
            />
        </Box>
    );
};

export default SimpleImageUpload;
