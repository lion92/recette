import React, { useState } from 'react';
import axios from 'axios';
import './css/addRecette.css'
function AddRecipe() {
    // Définition des états pour les champs du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = ""+localStorage.getItem('jwt');  // Récupérer le token JWT

        if (!token) {
            alert('Vous devez être connecté pour ajouter une recette.');
            return;
        }

        // Objet représentant la recette
        const recipeData = {
            title:title,
            description:description,
            ingredients:ingredients,
            instructions:instructions,
            jwt:token,
            isPublished:isPublished
        };

        try {
            // Requête POST pour envoyer les données au backend
            const res = await axios.post(
                'http://localhost:3012/recipes',
                recipeData,
                {
                    headers: { Authorization: `Bearer ${token}` }  // Inclure le token JWT dans l'en-tête
                }
            );
            alert('Recette ajoutée avec succès !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'ajout de la recette.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Ajouter une nouvelle recette</h2>

            <div>
                <label>Titre :</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entrez le titre"
                    required
                />
            </div>

            <div>
                <label>Description :</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Entrez la description"
                    required
                />
            </div>

            <div>
                <label>Ingrédients :</label>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Listez les ingrédients"
                    required
                />
            </div>

            <div>
                <label>Instructions :</label>
                <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Entrez les instructions"
                    required
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={() => setIsPublished(!isPublished)}
                    />
                    Publier la recette ?
                </label>
            </div>

            <button type="submit">Ajouter la recette</button>
        </form>
    );
}

export default AddRecipe;
