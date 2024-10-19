import React from 'react';
import '../src/css/recette.css'
function Recette() {
    const recettesData = [
        {
            id: 1,
            nom: 'Pâtes à la carbonara',
            ingredients: [
                '200g de pâtes',
                '100g de lardons',
                '2 œufs',
                '50g de parmesan',
                'Sel, poivre',
            ],
            instructions:
                'Cuire les pâtes, faire revenir les lardons, mélanger avec les œufs battus et le parmesan.',
        },
        {
            id: 2,
            nom: 'Salade César',
            ingredients: [
                '1 laitue romaine',
                '100g de poulet grillé',
                'Croutons',
                '50g de parmesan',
                'Sauce César',
            ],
            instructions:
                'Mélanger tous les ingrédients et arroser de sauce César.',
        },
        {
            id: 3,
            nom: 'Crêpes sucrées',
            ingredients: [
                '250g de farine',
                '3 œufs',
                '500ml de lait',
                '50g de sucre',
                '1 pincée de sel',
            ],
            instructions:
                'Mélanger tous les ingrédients et cuire les crêpes dans une poêle chaude.',
        },
    ];

    return (
        <div className="recette-container">
            <h2>Liste des Recettes</h2>
            {recettesData.map((recette) => (
                <div key={recette.id} className="recette-card">
                    <h3>{recette.nom}</h3>
                    <ul>
                        {recette.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <p>{recette.instructions}</p>
                </div>
            ))}
        </div>
    );
}

export default Recette;
