

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Échec de la connexion');
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/game'); 
        } catch (err) {
            setError(err.message);
            console.error('Erreur de connexion:', err);
        }
    };

    return (
        <div id="login">
            <form onSubmit={handleSubmit}>
                <h1>Connexion</h1>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                />
                <button type="submit" id="submit">Se connecter</button>
                <p>
                    Pas de compte? <a href="/register">S'inscrire</a>
                </p>
            </form>
        </div>
    );
}

export default Login;