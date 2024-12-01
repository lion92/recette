import React, { useEffect, useState } from 'react';
import UserCalendar from './UserCalendar.jsx';
import useApiStore from "./useApiStore.js";

const AddRecipeToCalendar = () => {
    const {
        recipes,
        addRecipeToCalendar,
        fetchRecipes,
        message,
        error,
    } = useApiStore();

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [localMessage, setLocalMessage] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRecipe || !selectedDate) {
            setLocalMessage('Veuillez sélectionner une recette et une date.');
            return;
        }

        try {
            await addRecipeToCalendar(selectedRecipe, selectedDate);
            setLocalMessage('Recette ajoutée au calendrier avec succès !');
        } catch (err) {
            setLocalMessage('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#f5f5dc', // Beige
                fontFamily: 'Arial, sans-serif',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <div
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Ajouter une recette au calendrier
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="recipe" style={{ display: 'block', marginBottom: '5px' }}>
                            Sélectionnez une recette :
                        </label>
                        <select
                            id="recipe"
                            value={selectedRecipe || ''}
                            onChange={(e) => setSelectedRecipe(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            <option value="" disabled>
                                -- Choisissez une recette --
                            </option>
                            {recipes && recipes.length > 0 ? recipes.map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                    {recipe.title}
                                </option>
                            )) : (
                                <option disabled>La liste est vide</option>
                            )}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>
                            Sélectionnez une date :
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Ajouter au calendrier
                    </button>
                </form>
                {(localMessage || message) && (
                    <p
                        style={{
                            marginTop: '15px',
                            textAlign: 'center',
                            color: (localMessage.includes('succès') || message.includes('succès')) ? 'green' : 'red',
                        }}
                    >
                        {localMessage || message}
                    </p>
                )}
                {error && (
                    <p style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>
                        {error}
                    </p>
                )}
            </div>
            <div style={{ marginTop: '20px' }}>
                <UserCalendar />
            </div>
        </div>
    );
};

export default AddRecipeToCalendar;
