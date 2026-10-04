import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedConvention, setSelectedConvention] = useState(null);
    const [registrationData, setRegistrationData] = useState({
        memberCount: 1,
        foodPreference: 'Veg',
        roomType: 'Single'
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConventions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get('http://localhost:5000/api/conventions', config);
                setConventions(res.data);
            } catch (err) {
                setError('Failed to load conventions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConventions();
    }, []);

    const handleRegisterClick = (convention) => {
        if (!user) {
            navigate('/login', { state: { from: '/conventions' } });
            return;
        }

        // Grab the default room type from dynamic roomTariffs if available
        let defaultRoomType = 'Single';
        if (convention.roomTariffs) {
            const types = Object.keys(convention.roomTariffs);
            if (types.length > 0) defaultRoomType = types[0];
        }

        setSelectedConvention(convention);
        setRegistrationData({
            memberCount: 1,
            foodPreference: 'Veg',
            roomType: defaultRoomType
        });
        setShowPayment(false);
    };

    const handleRegistrationChange = (e) => {
        setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        if (!selectedConvention) return 0;

        let roomCost = 0;
        if (selectedConvention.roomTariffs && selectedConvention.roomTariffs[registrationData.roomType]) {
            roomCost = parseFloat(selectedConvention.roomTariffs[registrationData.roomType]);
        } else {
            // fallback to base tariff
            roomCost = parseFloat(selectedConvention.tariff);
        }

        let foodCost = 0;
        switch (registrationData.foodPreference) {
            case 'Non-Veg': foodCost = 500; break;
            case 'Buffet': foodCost = 800; break; // Added Buffer for dynamic req
            case 'Vegan': foodCost = 600; break;
            default: foodCost = 300; // Veg
        }
        return (roomCost + foodCost) * registrationData.memberCount;
    };

    const handleProceedToPayment = () => {
        setShowPayment(true);
    };

    const handleVolunteerAttend = async () => {
        setProcessingPayment(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(
                `http://localhost:5000/api/conventions/${selectedConvention.id}/register`,
                {
                    memberCount: 1,
                    foodPreference: registrationData.foodPreference || 'Veg',
                    roomType: 'Volunteer Delegate',
                    totalAmount: 0
                },
                config
            );

            alert(`Attendance Confirmed! You are registered for ${selectedConvention.name}.`);
            setSelectedConvention(null);

            // Refresh to update registered count
            const refreshRes = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(refreshRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Attendance confirmation failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const totalAmount = calculateTotal();

            // 1. Register for convention
            const regRes = await axios.post(
                `http://localhost:5000/api/conventions/${selectedConvention.id}/register`,
                {
                    memberCount: registrationData.memberCount,
                    foodPreference: registrationData.foodPreference,
                    roomType: registrationData.roomType,
                    totalAmount
                },
                config
            );

            // 2. Process Payment
            await axios.post(
                'http://localhost:5000/api/payments',
                {
                    amount: totalAmount,
                    method: paymentMethod,
                    conventionId: selectedConvention.id,
                    conventionRegistrationId: regRes.data.id
                },
                config
            );

            alert('Registration and Payment Successful!');
            setSelectedConvention(null);
            setShowPayment(false);

            // Refresh to update registered count
            const refreshRes = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(refreshRes.data);

        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Conventions & Retreats</h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                        Join our large gatherings for intensive recovery workshops, spiritual renewal, and extended fellowship. Note that users MUST be Approved Members to attend some conventions.
                    </p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {conventions.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500">No conventions scheduled at the moment.</div>
                    ) : (
                        conventions.map(conv => (
                            <div key={conv.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition duration-300 hover:shadow-xl">
                                <div className="h-48 bg-indigo-600 relative">
                                    <div className="absolute inset-0 bg-black opacity-20"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="text-2xl font-bold mb-1 truncate">{conv.name}</h3>
                                        <p className="text-sm flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {conv.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-4 text-sm text-gray-500 font-medium">
                                            <span>{new Date(conv.startDate).toLocaleDateString()}</span>
                                            <span>&#8594;</span>
                                            <span>{new Date(conv.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm line-clamp-3 hover:line-clamp-none transition-all">{conv.description}</p>

                                        <div className="bg-gray-50 p-3 rounded text-sm mb-4 border border-gray-100">
                                            <p><span className="font-semibold">Hotel:</span> {conv.hotelName || (conv.hotelDetails ? conv.hotelDetails.substring(0, 25) + '...' : 'TBA')}</p>
                                            {user?.role === 'volunteer' ? (
                                                <p className="mt-1 text-emerald-600 font-semibold"><span className="text-gray-700 font-normal">Volunteer Pass:</span> Free / Complimentary</p>
                                            ) : (
                                                <p className="mt-1"><span className="font-semibold">Base Tariff:</span> ₹{conv.tariff}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                                {conv.registeredCount} / {conv.maxCapacity} Registered
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRegisterClick(conv)}
                                        disabled={conv.registeredCount >= conv.maxCapacity}
                                        className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${conv.registeredCount >= conv.maxCapacity ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                                    >
                                        {conv.registeredCount >= conv.maxCapacity 
                                            ? 'Sold Out' 
                                            : user?.role === 'volunteer' 
                                                ? 'Attend' 
                                                : 'Register Now'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Registration Modal */}
                {selectedConvention && (
                    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedConvention(null)}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                                {user?.role === 'volunteer' 
                                                    ? `Attend Confirmation: ${selectedConvention.name}`
                                                    : showPayment 
                                                        ? 'Payment Checkout' 
                                                        : `Register for ${selectedConvention.name}`}
                                            </h3>

                                            {user?.role === 'volunteer' ? (
                                                /* Volunteer Attend Confirmation View */
                                                <div className="mt-4 space-y-4">
                                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-200 text-indigo-800 uppercase tracking-wide">
                                                                Volunteer Delegate Pass
                                                            </span>
                                                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                Complimentary
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900 mt-2">{selectedConvention.name}</h4>
                                                        <p className="text-sm text-indigo-700 font-medium mt-1">
                                                            📍 {selectedConvention.location}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            🗓️ {new Date(selectedConvention.startDate).toLocaleDateString()} — {new Date(selectedConvention.endDate).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
                                                        <p><span className="font-semibold text-gray-800">Hotel / Venue:</span> {selectedConvention.hotelName || 'TBA'}</p>
                                                        {selectedConvention.hotelDetails && (
                                                            <p className="mt-1 text-gray-600 text-xs">{selectedConvention.hotelDetails}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h5 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">Conference Overview</h5>
                                                        <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-md border border-gray-200">
                                                            {selectedConvention.description}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference (Complimentary)</label>
                                                        <select
                                                            name="foodPreference"
                                                            value={registrationData.foodPreference}
                                                            onChange={handleRegistrationChange}
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        >
                                                            <option value="Veg">Vegetarian</option>
                                                            <option value="Non-Veg">Non-Vegetarian</option>
                                                            <option value="Vegan">Vegan</option>
                                                            <option value="Buffet">Buffet Access</option>
                                                        </select>
                                                    </div>

                                                    <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-emerald-800 text-xs flex items-center">
                                                        <svg className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>As an active Volunteer, your attendance is fully supported. No ticket fees, room tariffs, or payment processing are required.</span>
                                                    </div>
                                                </div>
                                            ) : !showPayment ? (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Number of Members</label>
                                                        <select
                                                            name="memberCount"
                                                            value={registrationData.memberCount}
                                                            onChange={handleRegistrationChange}
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        >
                                                            {[1, 2, 3, 4, 5].map(num => (
                                                                <option key={num} value={num}>{num}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Dynamic Room Types */}
                                                    {selectedConvention.roomTariffs && Object.keys(selectedConvention.roomTariffs).length > 0 && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Room Type Requirements</label>
                                                            <select
                                                                name="roomType"
                                                                value={registrationData.roomType}
                                                                onChange={handleRegistrationChange}
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                            >
                                                                {Object.keys(selectedConvention.roomTariffs).map(type => (
                                                                    <option key={type} value={type}>{type} (₹{selectedConvention.roomTariffs[type]})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Food Preference</label>
                                                        <select
                                                            name="foodPreference"
                                                            value={registrationData.foodPreference}
                                                            onChange={handleRegistrationChange}
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        >
                                                            <option value="Veg">Vegetarian</option>
                                                            <option value="Non-Veg">Non-Vegetarian</option>
                                                            <option value="Vegan">Vegan</option>
                                                            <option value="Buffet">Buffet Access</option>
                                                        </select>
                                                    </div>

                                                    <div className="bg-blue-50 p-4 rounded-md mt-6 border border-blue-100">
                                                        <div className="flex justify-between font-medium text-blue-900 border-b border-blue-200 pb-2 mb-2">
                                                            <span>Room Tariff</span>
                                                            <span>₹{selectedConvention.roomTariffs ? selectedConvention.roomTariffs[registrationData.roomType] : selectedConvention.tariff}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold text-lg text-blue-900 mt-2">
                                                            <span>Total Amount</span>
                                                            <span>₹{calculateTotal()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">
                                                    <div className="bg-gray-50 p-4 rounded text-center mb-6 border border-gray-200">
                                                        <p className="text-sm text-gray-500">Amount to pay</p>
                                                        <p className="text-3xl font-bold text-gray-900">₹{calculateTotal()}</p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {['Credit/Debit Card', 'UPI', 'Net Banking'].map(method => (
                                                            <label key={method} className={`flex items-center p-3 border rounded cursor-pointer ${paymentMethod === method ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value={method}
                                                                    checked={paymentMethod === method}
                                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mr-3"
                                                                    required
                                                                />
                                                                <span className="text-gray-900 font-medium">{method}</span>
                                                            </label>
                                                        ))}
                                                    </div>

                                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                        <button
                                                            type="submit"
                                                            disabled={processingPayment}
                                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${processingPayment ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'}`}
                                                        >
                                                            {processingPayment ? 'Processing...' : `Pay ₹${calculateTotal().toFixed(2)}`}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPayment(false)}
                                                            disabled={processingPayment}
                                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                        >
                                                            Back
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {user?.role === 'volunteer' ? (
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleVolunteerAttend}
                                            disabled={processingPayment}
                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2.5 bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm ${processingPayment ? 'bg-gray-400 cursor-wait' : ''}`}
                                        >
                                            {processingPayment ? 'Confirming Attendance...' : 'Attend Confirmation'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedConvention(null)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : !showPayment && (
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleProceedToPayment}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Proceed to Payment
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedConvention(null)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Conventions;
