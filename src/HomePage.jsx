import React from 'react';
import '../src/css/homepage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <header className="header">
                <h1 className="title">Bienvenue sur Just Recipes</h1>
                <p className="subtitle">Découvrez des centaines de recettes gourmandes pour tous les goûts</p>
            </header>
            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-text">
                        <h2>Explorez de nouvelles saveurs</h2>
                        <p>
                            Inspirez-vous de nos recettes pour des repas délicieux et équilibrés. Ajoutez des recettes !!
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
