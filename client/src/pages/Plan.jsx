import React, { useState } from 'react';

const PowerliftingForm = () => {
    const [liftType, setLiftType] = useState('Bench Press');
    const [weight, setWeight] = useState('');
    const [plan, setPlan] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const API_URL = process.env.REACT_APP_API_URL || 'https://dmqw5nub51.execute-api.us-east-2.amazonaws.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!weight || isNaN(weight) || weight <= 0) {
            setError('Please enter a valid weight in pounds.');
            return;
        }

        setLoading(true);
        setError('');
        setPlan('');

        try {
            const response = await fetch(`${API_URL}/get-powerlifting-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    liftType,
                    weight: parseInt(weight),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setPlan(data.plan);
        } catch (error) {
            console.error('Error fetching the powerlifting plan:', error);
            setError('Failed to fetch the powerlifting plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header>
                <h2>Powerlifting Plan Generator</h2>
            </header>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="liftType">Choose a Lift:</label>
                    <select id="liftType" value={liftType} onChange={(e) => setLiftType(e.target.value)}>
                        <option value="Bench Press">Bench Press</option>
                        <option value="Squat">Squat</option>
                        <option value="Deadlift">Deadlift</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="weight">Enter Weight (lbs):</label>
                    <input 
                        id="weight" 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        placeholder="Enter weight in lbs" 
                        required 
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Create Powerlifting Plan'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {plan && (
                <div>
                    <h3>Your Powerlifting Plan:</h3>
                    <pre className="plan-text">{plan}</pre>
                </div>
            )}
        </div>
    );
}

export default PowerliftingForm;