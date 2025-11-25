import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/feedback', { message, rating }, config);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError('Failed to submit feedback.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">We Value Your Feedback</h1>

                    {success ? (
                        <div className="text-center text-green-600 font-medium py-10">
                            Thank you for your feedback!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Rating</label>
                                <div className="flex justify-center space-x-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl focus:outline-none transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-bold mb-2">Your Message</label>
                                <textarea
                                    className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows="4"
                                    placeholder="Tell us about your experience..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-indigo-700 transition-colors"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
