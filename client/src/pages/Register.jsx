import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Register(){
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://6r2f6r0qfc.execute-api.us-east-2.amazonaws.com/register', {
                firstName,
                lastName,
                username,
                password
            });

            console.log(response.data);
            navigate('/login'); // Redirect to login page after successful registration

        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 409) {
                    setError('Username already exists. Please choose a different username.');
                } else {
                    setError('Error registering user: ' + error.response.data.error);
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response received from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('Error setting up the request: ' + error.message);
            }
        }
    }


    return(
        <div>
            <h1>Register</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input
                    type = "text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                    type = "text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input
                    type = "text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                    type = "password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <button type="submit">Register</button>
                
            </form>
            <p>
                Already have an account? <Link to="/login">Login Here</Link>
            </p>
        </div>
    );
};

export default Register;
