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
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [memberCount, setMemberCount] = useState(1);
    const [numDays, setNumDays] = useState(1);
    const [roomType, setRoomType] = useState('Single');
    // Food Preference removed
    const [selectedMeals, setSelectedMeals] = useState({
        breakfast: true,
        lunch: true,
        dinner: true
    });
    const [paymentMethod, setPaymentMethod] = useState('Card'); // Card, UPI, Cash

    // Pricing Constants
    const ROOM_PRICES = {
        'Single': 1000,
        'Double AC': 2000,
        'Non-AC': 1500
    };

    const MEAL_PRICES = {
        breakfast: 100,
        lunch: 200,
        dinner: 200
    };

    const MEAL_DETAILS = {
        breakfast: "Veg: Idli, Dosa, Pongal | Non-Veg: Omelette, Chicken Sausages",
        lunch: "Veg: Rice, Sambar, Paneer Butter Masala | Non-Veg: Chicken Biryani, Fish Fry",
        dinner: "Veg: Chapati, Dal Tadka, Veg Pulao | Non-Veg: Butter Chicken, Mutton Rogan Josh"
    };

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
        setStep(1);
        setMemberCount(1);
        setNumDays(1);
        setRoomType('Single');
        setSelectedMeals({ breakfast: true, lunch: true, dinner: true });
        setPaymentMethod('Card');
        setShowPaymentModal(true);
        setPaymentSuccess(false);
    };

    const handleMealChange = (meal) => {
        setSelectedMeals(prev => ({
            ...prev,
            [meal]: !prev[meal]
        }));
    };

    const calculateTotal = () => {
        if (!selectedConvention) return 0;

        // 1. Convention Tariff (Entry Fee per person)
        const conventionCost = selectedConvention.tariff * memberCount;

        // 2. Room Cost (Price * Days)
        const roomCost = ROOM_PRICES[roomType] * numDays;

        // 3. Meal Cost (Sum of selected meals * Members * Days)
        let dailyMealCost = 0;
        if (selectedMeals.breakfast) dailyMealCost += MEAL_PRICES.breakfast;
        if (selectedMeals.lunch) dailyMealCost += MEAL_PRICES.lunch;
        if (selectedMeals.dinner) dailyMealCost += MEAL_PRICES.dinner;

        const totalMealCost = dailyMealCost * memberCount * numDays;

        return conventionCost + roomCost + totalMealCost;
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const totalAmount = calculateTotal();

            // 2. Register User
            await axios.post(`http://localhost:5000/api/conventions/${selectedConvention.id}/register`, {
                memberCount,
                foodPreference: 'Buffet', // Default value
                details: {
                    numDays,
                    roomType,
                    selectedMeals,
                    paymentMethod,
                    totalAmount
                }
            }, config);

            // 3. Record Payment
            await axios.post('http://localhost:5000/api/payments', {
                conventionId: selectedConvention.id,
                amount: totalAmount,
                paymentMethod: paymentMethod
            }, config);

            setPaymentProcessing(false);
            setPaymentSuccess(true);

            // Refresh conventions
            const res = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(res.data);

            setTimeout(() => {
                setShowPaymentModal(false);
                setSelectedConvention(null);
            }, 3000);
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
                                            <p><strong>Entry Fee:</strong> ₹{convention.tariff} / person</p>
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
                                            {step === 1 ? 'Booking Details' : 'Payment'} - {selectedConvention.name}
                                        </h3>

                                        {!paymentSuccess ? (
                                            <div className="mt-4">
                                                {step === 1 ? (
                                                    <div className="space-y-4">
                                                        {/* Step 1: Booking Details */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Members</label>
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
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Days</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={numDays}
                                                                    onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Room Type</label>
                                                            <select
                                                                value={roomType}
                                                                onChange={(e) => setRoomType(e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                            >
                                                                <option value="Single">Single (₹1000/day)</option>
                                                                <option value="Double AC">Double AC (₹2000/day)</option>
                                                                <option value="Non-AC">Non-AC (₹1500/day)</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Meals (Daily)</label>
                                                            <div className="flex flex-col space-y-2">
                                                                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                                                    <div key={meal} className="relative group">
                                                                        <label className="inline-flex items-center cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedMeals[meal]}
                                                                                onChange={() => handleMealChange(meal)}
                                                                                className="form-checkbox h-4 w-4 text-purple-600"
                                                                            />
                                                                            <span className="ml-2 text-sm text-gray-700 capitalize">
                                                                                {meal} (₹{MEAL_PRICES[meal]})
                                                                            </span>
                                                                            <span className="ml-2 text-gray-400 text-xs">ⓘ</span>
                                                                        </label>
                                                                        {/* Tooltip */}
                                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded p-2 z-10 shadow-lg">
                                                                            {MEAL_DETAILS[meal]}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50 p-3 rounded-md mt-4">
                                                            <p className="text-lg font-bold text-gray-900 text-right">
                                                                Estimated Total: ₹{calculateTotal().toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                            <button
                                                                type="button"
                                                                onClick={() => setStep(2)}
                                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                            >
                                                                Proceed to Payment
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPaymentModal(false)}
                                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                                        {/* Step 2: Payment */}
                                                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                                                            <h4 className="font-medium text-gray-900 mb-2">Bill Summary</h4>
                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                <div className="flex justify-between">
                                                                    <span>Entry Fee ({memberCount} x ₹{selectedConvention.tariff})</span>
                                                                    <span>₹{memberCount * selectedConvention.tariff}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Room ({numDays} days x ₹{ROOM_PRICES[roomType]})</span>
                                                                    <span>₹{numDays * ROOM_PRICES[roomType]}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Meals ({memberCount} ppl x {numDays} days)</span>
                                                                    <span>₹{calculateTotal() - (memberCount * selectedConvention.tariff) - (numDays * ROOM_PRICES[roomType])}</span>
                                                                </div>
                                                                <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-bold text-gray-900">
                                                                    <span>Total Payable</span>
                                                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div
                                                                    onClick={() => setPaymentMethod('Card')}
                                                                    className={`cursor-pointer border rounded-md p-3 text-center text-sm ${paymentMethod === 'Card' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                                                >
                                                                    💳 Card
                                                                </div>
                                                                <div
                                                                    onClick={() => setPaymentMethod('UPI')}
                                                                    className={`cursor-pointer border rounded-md p-3 text-center text-sm ${paymentMethod === 'UPI' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                                                >
                                                                    📱 UPI
                                                                </div>
                                                                <div
                                                                    onClick={() => setPaymentMethod('Cash')}
                                                                    className={`cursor-pointer border rounded-md p-3 text-center text-sm ${paymentMethod === 'Cash' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-300 hover:bg-gray-50'}`}
                                                                >
                                                                    💵 Cash on Arrival
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {paymentMethod === 'Card' && (
                                                            <div className="space-y-3 p-3 border border-gray-200 rounded-md">
                                                                <input type="text" placeholder="Card Number" className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm" required />
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <input type="text" placeholder="MM/YY" className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm" required />
                                                                    <input type="text" placeholder="CVC" className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm" required />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentMethod === 'UPI' && (
                                                            <div className="p-3 border border-gray-200 rounded-md">
                                                                <input type="text" placeholder="Enter UPI ID (e.g. user@upi)" className="block w-full border-gray-300 rounded-md shadow-sm p-2 text-sm" required />
                                                            </div>
                                                        )}

                                                        {paymentMethod === 'Cash' && (
                                                            <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                                                                You can pay the full amount of ₹{calculateTotal().toFixed(2)} upon arrival at the venue.
                                                            </div>
                                                        )}

                                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                            <button
                                                                type="submit"
                                                                disabled={paymentProcessing}
                                                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {paymentProcessing ? 'Processing...' : (paymentMethod === 'Cash' ? 'Confirm Booking' : `Pay ₹${calculateTotal().toFixed(2)}`)}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setStep(1)}
                                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                            >
                                                                Back
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-2">
                                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">Booking Successful!</h3>
                                                <p className="text-sm text-gray-500">
                                                    Your booking for {memberCount} person(s) has been confirmed.
                                                    {paymentMethod === 'Cash' && <br />}
                                                    {paymentMethod === 'Cash' && <span className="text-yellow-600 font-medium">Please pay ₹{calculateTotal().toFixed(2)} on arrival.</span>}
                                                </p>
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
