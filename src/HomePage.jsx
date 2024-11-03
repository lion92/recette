import React from 'react';
import '../src/css/homepage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <header className="header">
                <h1 className="title">Bienvenue sur Just Recipes</h1>
                <p className="subtitle-white">Découvrez des centaines de recettes gourmandes pour tous les goûts</p>
                <p className="subtitle-white">Explorez de nouvelles saveurs</p>
                        <p className="subtitle-white">
                            Inspirez-vous de nos recettes pour des repas délicieux et équilibrés. Ajoutez des recettes !!
                        </p>
            </header>

        </div>
    );
};

export default HomePage;
