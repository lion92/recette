import React, { useState } from 'react';

function CreateRecette({ addRecette }) {
    const [nom, setNom] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sépare les ingrédients par des virgules et les stocke dans un tableau
        const ingredientsArray = ingredients.split(',').map((ingredient) => ingredient.trim());

        // Crée un nouvel objet recette
        const newRecette = {
            id: Date.now(), // Génère un ID unique
            nom,
            ingredients: ingredientsArray,
            instructions,
        };

        // Passe la recette à la fonction parent (pour l'ajouter à une liste, par exemple)
        addRecette(newRecette);

        // Réinitialise les champs du formulaire
        setNom('');
        setIngredients('');
        setInstructions('');
    };

    return (
        <div className="create-recette-container">
            <h2>Créer une nouvelle recette</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom de la recette :</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ingrédients (séparés par des virgules) :</label>
                    <input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Instructions :</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Ajouter la recette</button>
            </form>
        </div>
    );
}

export default CreateRecette;
