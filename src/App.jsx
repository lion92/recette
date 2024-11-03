// App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Menu from './Menu';
import Recipes from './Recipe.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import Profil from './Profil.jsx';
import AddRecipe from './AddRecipe.jsx';
import Logout from './Logout.jsx';
import CategoryManager from './CategoryManager.jsx';
import IngredientManager from './IngredientManager.jsx';
import LoginGoogle from './LoginGoogle.jsx';
import PrivateRoute from './PrivateRoute'; // Importer PrivateRoute

function App() {
    return (
        <>
            <Menu />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Routes protégées */}
                    <Route
                        path="/createRecette"
                        element={
                            <PrivateRoute>
                                <AddRecipe />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/recipe"
                        element={
                            <PrivateRoute>
                                <Recipes/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profil"
                        element={
                            <PrivateRoute>
                                <Profil />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/logout"
                        element={
                            <PrivateRoute>
                                <Logout />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addCategory"
                        element={
                            <PrivateRoute>
                                <CategoryManager />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/addIngredient"
                        element={
                            <PrivateRoute>
                                <IngredientManager />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/google" element={<LoginGoogle />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
