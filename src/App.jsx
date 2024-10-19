// App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Menu from './Menu';
import Recipes from "./Recipe.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import Profil from "./Profil.jsx";
import AddRecipe from "./AddRecipe.jsx";


function App() {
    return (
        <>
            <Menu></Menu>
        <div className="app-container">

            <Routes>
                <Route path="/" element={<Recipes />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/createRecette" element={<AddRecipe />} />
                <Route path="/profil" element={<Profil />} />

            </Routes>
        </div>
        </>
    );
}

export default App;
