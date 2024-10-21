import React, { useEffect, useState } from 'react';
import useIngredientStore from './IngredientStore.jsx';

function IngredientManager() {
    // Récupération des actions et de l'état depuis le store Zustand
    const { ingredients, fetchIngredients, addIngredient, updateIngredient, deleteIngredient } = useIngredientStore();
    const [newIngredient, setNewIngredient] = useState('');
    const [newIngredientPrice, setNewIngredientPrice] = useState(''); // État pour le prix
    const [editIngredientId, setEditIngredientId] = useState(null);
    const [editIngredientName, setEditIngredientName] = useState('');
    const [editIngredientPrice, setEditIngredientPrice] = useState(''); // État pour le prix en modification

    const token = localStorage.getItem('jwt'); // Récupérer le token JWT pour authentification

    // Charger les ingrédients depuis l'API lors du montage du composant
    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    // Fonction pour ajouter un nouvel ingrédient
    const handleAddIngredient = async () => {
        if (!newIngredient.trim()) {
            alert('Le nom de l\'ingrédient ne peut pas être vide.');
            return;
        }

        if (!newIngredientPrice || parseFloat(newIngredientPrice) <= 0) {
            alert('Le prix de l\'ingrédient doit être un nombre positif.');
            return;
        }

        await addIngredient(newIngredient, parseFloat(newIngredientPrice), token); // Ajoute le prix
        setNewIngredient(''); // Réinitialiser le champ de saisie
        setNewIngredientPrice(''); // Réinitialiser le champ de prix
    };

    // Fonction pour mettre à jour un ingrédient existant
    const handleUpdateIngredient = async (id) => {
        if (!editIngredientName.trim()) {
            alert('Le nom de l\'ingrédient ne peut pas être vide.');
            return;
        }

        if (!editIngredientPrice || parseFloat(editIngredientPrice) <= 0) {
            alert('Le prix de l\'ingrédient doit être un nombre positif.');
            return;
        }

        await updateIngredient(id, editIngredientName, parseFloat(editIngredientPrice), token); // Ajoute le prix
        setEditIngredientId(null); // Sortir du mode édition
        setEditIngredientName('');
        setEditIngredientPrice(''); // Réinitialiser le champ de prix
    };

    // Fonction pour supprimer un ingrédient
    const handleDeleteIngredient = async (id) => {
        await deleteIngredient(id, token);
    };

    return (
        <div>
            <h2>Gestion des Ingrédients</h2>

            <div>
                <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Ajouter un ingrédient"
                />
                <input
                    type="number"
                    value={newIngredientPrice}
                    onChange={(e) => setNewIngredientPrice(e.target.value)}
                    placeholder="Prix"
                />
                <button onClick={handleAddIngredient}>Ajouter</button>
            </div>

            <ul>
                {Array.isArray(ingredients) && ingredients.length > 0 ? (
                    ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            {editIngredientId === ingredient.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editIngredientName}
                                        onChange={(e) => setEditIngredientName(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={editIngredientPrice}
                                        onChange={(e) => setEditIngredientPrice(e.target.value)}
                                        placeholder="Prix"
                                    />
                                    <button onClick={() => handleUpdateIngredient(ingredient.id)}>Mettre à jour</button>
                                </div>
                            ) : (
                                <div>
                                    {ingredient.name} - {ingredient.price} €
                                    <button onClick={() => {
                                        setEditIngredientId(ingredient.id);
                                        setEditIngredientName(ingredient.name);
                                        setEditIngredientPrice(ingredient.price);
                                    }}>
                                        Modifier
                                    </button>
                                    <button onClick={() => handleDeleteIngredient(ingredient.id)}>Supprimer</button>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p>La liste des ingrédients est vide.</p>
                )}
            </ul>
        </div>
    );
}

export default IngredientManager;
