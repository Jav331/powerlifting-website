import React, { useState } from 'react';
import './styles/Calculate.css';

export default function Calculate() {
    const [weight, setWeight] = useState('');
    const [rep, setRep] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        try {
            calculate(weight, rep);
        } catch (error) {
            setError(error.message)
        }
    };

    function calculate(weight, rep) {
        
        setError('');
        
        if (!weight || !rep) {
            throw new Error('Pleae enter both weight and repitiion')
            return;
        }

        // Convert weight and rep to numbers
        const weightNum = parseFloat(weight);
        const repNum = parseInt(rep, 10);

        if (weight <= 0 || rep <=0){
            throw new Error('Weight and repititions must be positive numbers')
        }

        // Calculate 1RM using Brzycki formula
        const oneRepMax = weightNum * (36 / (37 - repNum));

        // Generate table data for different percentages
        const percentages = [
            { percentage: 100, reps: 1 },
            { percentage: 95, reps: 2 },
            { percentage: 90, reps: 4 },
            { percentage: 85, reps: 6 },
            { percentage: 80, reps: 8 },
            { percentage: 75, reps: 10 },
            { percentage: 70, reps: 12 },
            { percentage: 65, reps: 16 },
            { percentage: 60, reps: 20 },
            { percentage: 55, reps: 24 },
            { percentage: 50, reps: 30 },
        ];

        const calculatedResults = percentages.map(({ percentage, reps }) => ({
            percentage,
            liftWeight: (oneRepMax * (percentage / 100)).toFixed(1),
            reps
        }));

        setResults({ oneRepMax: oneRepMax.toFixed(1), tableData: calculatedResults });
    };

    return (
        <div>
            <header>
                <h2>Calculate One Rep Max</h2>
            </header>

            <form onSubmit={handleSubmit}>
                <div>
                    <label> Weight (lbs) </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder='Enter in lbs'
                        required
                    />
                </div>
                <div>
                    <label> Repetitions </label>
                    <input
                        type="number"
                        value={rep}
                        onChange={(e) => setRep(e.target.value)}
                        placeholder='Reps'
                        required
                    />
                </div>
                <button type='submit'>Calculate</button>
            </form>
            {error && <div style={{ color:'red' }}>{error}</div>}
            {results && (
                <div>
                    <h3>Your One Rep Max is {results.oneRepMax} lbs</h3>
                    <table>
                        <thead>
                            <tr>
                                <th className="header-cell">Percentage of 1RM</th>
                                <th className="header-cell">Lift Weight</th>
                                <th className="header-cell">Repetitions of 1RM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.tableData.map(({ percentage, liftWeight, reps }) => (
                                <tr key={percentage}>
                                    <td>{percentage}%</td>
                                    <td>{liftWeight} lbs</td>
                                    <td>{reps}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
