import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('https://6r2f6r0qfc.execute-api.us-east-2.amazonaws.com/login', 
                { username, password },
                { 
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log(response.data);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', response.data.userId);
            navigate('/track');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(`Server error: ${error.response.data.error || 'Unknown error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <p>To use the tracking feature, please log in</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            <p>
                Don't have an account? <Link to="/register">Register Here</Link>
            </p>
        </div>
    );
}

export default Login;