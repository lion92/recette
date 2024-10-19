// App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Menu from './Menu';
import Recette from "./Recette.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import CreateRecette from "./CreateRecette.jsx";
import Profil from "./Profil.jsx";


function App() {
    return (
        <>
            <Menu></Menu>
        <div className="app-container">

            <Routes>
                <Route path="/" element={<Recette />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/createRecette" element={<CreateRecette />} />
                <Route path="/profil" element={<Profil />} />
            </Routes>
        </div>
        </>
    );
}

export default App;
