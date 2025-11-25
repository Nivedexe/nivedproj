import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConvention, setSelectedConvention] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Registration State
    const [memberCount, setMemberCount] = useState(1);
    const [foodPreference, setFoodPreference] = useState('Veg');

    useEffect(() => {
        const fetchConventions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/conventions', config);
                setConventions(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching conventions', error);
                setLoading(false);
            }
        };
        fetchConventions();
    }, []);

    const handleRegisterClick = (convention) => {
        setSelectedConvention(convention);
        setMemberCount(1);
        setFoodPreference('Veg');
        setShowPaymentModal(true);
        setPaymentSuccess(false);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Process Payment (Mock)
            // In a real app, we'd verify payment first, then register.
            // For now, we'll assume payment is part of the registration flow or handled here.
            // The user requested "pay according to it", so we calculate total.

            const totalAmount = selectedConvention.tariff * memberCount;

            // 2. Register User
            await axios.post(`http://localhost:5000/api/conventions/${selectedConvention.id}/register`, {
                memberCount,
                foodPreference
            }, config);

            // 3. Record Payment (Optional, for record keeping if separate)
            await axios.post('http://localhost:5000/api/payments', {
                conventionId: selectedConvention.id,
                amount: totalAmount,
                paymentMethod: 'Credit Card' // Mock
            }, config);

            setPaymentProcessing(false);
            setPaymentSuccess(true);

            // Refresh conventions to update counts
            const res = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(res.data);

            setTimeout(() => {
                setShowPaymentModal(false);
                setSelectedConvention(null);
            }, 2000);
        } catch (error) {
            console.error('Registration/Payment failed', error);
            setPaymentProcessing(false);
            alert(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Conventions</h1>

                {loading ? (
                    <div className="text-center">Loading conventions...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {conventions.map((convention) => {
                            const seatsRemaining = convention.maxCapacity - convention.registeredCount;
                            const isFull = seatsRemaining <= 0;

                            return (
                                <div key={convention.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow flex flex-col">
                                    <div className="px-4 py-5 sm:p-6 flex-grow">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {convention.location}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(convention.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{convention.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4">{convention.description}</p>
                                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                                            <p><strong>Cost:</strong> ₹{convention.tariff} / person</p>
                                            <p className="truncate"><strong>Hotel:</strong> {convention.hotelDetails}</p>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                                <span className="text-xs text-gray-500">Capacity: {convention.maxCapacity}</span>
                                                <span className={`text-xs font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                                                    {isFull ? 'FULL' : `${seatsRemaining} seats left`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <button
                                            onClick={() => handleRegisterClick(convention)}
                                            disabled={isFull}
                                            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isFull
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                                }`}
                                        >
                                            {isFull ? 'Sold Out' : 'Register Now'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {conventions.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No upcoming conventions found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            {showPaymentModal && selectedConvention && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowPaymentModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <span className="text-purple-600 font-bold">📝</span>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Register for {selectedConvention.name}
                                        </h3>

                                        {!paymentSuccess ? (
                                            <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">

                                                {/* Member Count */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Number of Members</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={selectedConvention.maxCapacity - selectedConvention.registeredCount}
                                                        value={memberCount}
                                                        onChange={(e) => setMemberCount(parseInt(e.target.value) || 1)}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                        required
                                                    />
                                                </div>

                                                {/* Food Preference */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Food Preference</label>
                                                    <select
                                                        value={foodPreference}
                                                        onChange={(e) => setFoodPreference(e.target.value)}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    >
                                                        <option value="Veg">Veg</option>
                                                        <option value="Non-Veg">Non-Veg</option>
                                                        <option value="Vegan">Vegan</option>
                                                    </select>
                                                </div>

                                                {/* Total Cost Display */}
                                                <div className="bg-gray-50 p-3 rounded-md">
                                                    <p className="text-sm text-gray-500">Cost per person: ₹{selectedConvention.tariff}</p>
                                                    <p className="text-lg font-bold text-gray-900 mt-1">
                                                        Total to Pay: ₹{(selectedConvention.tariff * memberCount).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4 mt-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Details</h4>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                                        <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Expiry</label>
                                                            <input type="text" placeholder="MM/YY" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">CVC</label>
                                                            <input type="text" placeholder="123" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        disabled={paymentProcessing}
                                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {paymentProcessing ? 'Processing...' : `Pay ₹${(selectedConvention.tariff * memberCount).toFixed(2)}`}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPaymentModal(false)}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="text-center py-4">
                                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-2">
                                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Registration Successful!</h3>
                                                <p className="text-sm text-gray-500">You have successfully registered {memberCount} person(s).</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Conventions;
