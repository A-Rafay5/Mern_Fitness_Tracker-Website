import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreateProgress = () => {
    const [weight, setWeight] = useState('');
    const [bodyMeasurements, setBodyMeasurements] = useState({});
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [date, setDate] = useState(''); // State for the manual date input
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

            const response = await axios.post(
                'http://localhost:5000/api/progress/add',
                {
                    weight,
                    bodyMeasurements,
                    performanceMetrics,
                    date, // Send the manually entered date to the server
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                alert('Progress entry added successfully!');
                // Reset the form fields
                setWeight('');
                setBodyMeasurements({});
                setPerformanceMetrics({});
                setDate('');
                // Redirect to the progress dashboard
                navigate('/dashboard/progress');
            } else {
                throw new Error('Unexpected server response');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add progress entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-semibold text-center mb-6">Add Progress Entry</h2>
            <form onSubmit={handleSubmit}>
                {/* Weight Input */}
                <div className="mb-4">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Weight (kg)
                    </label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                {/* Body Measurements */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-4">Body Measurements</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Waist (cm)</label>
                            <input
                                type="number"
                                name="waist"
                                value={bodyMeasurements.waist || ''}
                                onChange={(e) => setBodyMeasurements({ ...bodyMeasurements, waist: e.target.value })}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chest (cm)</label>
                            <input
                                type="number"
                                name="chest"
                                value={bodyMeasurements.chest || ''}
                                onChange={(e) => setBodyMeasurements({ ...bodyMeasurements, chest: e.target.value })}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-4">Performance Metrics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Run Time (minutes)</label>
                            <input
                                type="number"
                                name="runTime"
                                value={performanceMetrics.runTime || ''}
                                onChange={(e) => setPerformanceMetrics({ ...performanceMetrics, runTime: e.target.value })}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bench Press (kg)</label>
                            <input
                                type="number"
                                name="benchPress"
                                value={performanceMetrics.benchPress || ''}
                                onChange={(e) => setPerformanceMetrics({ ...performanceMetrics, benchPress: e.target.value })}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Input */}
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
                    >
                        {loading ? 'Submitting...' : 'Submit Progress Entry'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default CreateProgress;
