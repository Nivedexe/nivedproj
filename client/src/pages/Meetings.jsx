import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/meetings', config);
                setMeetings(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching meetings', error);
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    const handleJoinClick = (meeting) => {
        if (meeting.price && parseFloat(meeting.price) > 0) {
            setSelectedMeeting(meeting);
            setShowPaymentModal(true);
            setPaymentSuccess(false);
        } else {
            window.open(meeting.link, '_blank');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentProcessing(true);

        // Simulate payment delay
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Record mock payment
                await axios.post('http://localhost:5000/api/payments', {
                    itemId: selectedMeeting.id,
                    itemType: 'Meeting',
                    amount: selectedMeeting.price,
                    status: 'completed'
                }, config);

                setPaymentProcessing(false);
                setPaymentSuccess(true);

                // Auto close and open link after success
                setTimeout(() => {
                    setShowPaymentModal(false);
                    window.open(selectedMeeting.link, '_blank');
                    setSelectedMeeting(null);
                }, 2000);

            } catch (error) {
                console.error('Payment failed', error);
                setPaymentProcessing(false);
                alert('Payment failed. Please try again.');
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Online Meetings</h1>

                {loading ? (
                    <div className="text-center">Loading meetings...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {meetings.map((meeting) => (
                            <div key={meeting.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${meeting.type === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {meeting.type}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(meeting.dateTime).toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{meeting.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{meeting.description}</p>

                                    {meeting.price && parseFloat(meeting.price) > 0 && (
                                        <div className="mb-4 text-lg font-bold text-gray-900">
                                            Price: ₹{meeting.price}
                                        </div>
                                    )}

                                    {meeting.link && (
                                        <button
                                            onClick={() => handleJoinClick(meeting)}
                                            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${meeting.price && parseFloat(meeting.price) > 0
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-primary hover:bg-indigo-700'
                                                }`}
                                        >
                                            {meeting.price && parseFloat(meeting.price) > 0 ? 'Pay & Join' : 'Join Meeting'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {meetings.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No meetings found.
                            </div>
                        )}
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && selectedMeeting && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Payment for {selectedMeeting.title}
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-4">
                                                    Amount to Pay: <span className="font-bold text-gray-900">₹{selectedMeeting.price}</span>
                                                </p>

                                                {!paymentSuccess ? (
                                                    <form onSubmit={handlePaymentSubmit}>
                                                        <div className="mb-4">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2">Card Number (Mock)</label>
                                                            <input type="text" placeholder="0000 0000 0000 0000" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                        </div>
                                                        <div className="flex mb-4 space-x-4">
                                                            <div className="w-1/2">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">Expiry</label>
                                                                <input type="text" placeholder="MM/YY" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                            </div>
                                                            <div className="w-1/2">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">CVC</label>
                                                                <input type="text" placeholder="123" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={paymentProcessing}
                                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${paymentProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                                                        >
                                                            {paymentProcessing ? 'Processing...' : 'Pay Now'}
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Successful!</h3>
                                                        <p className="text-sm text-gray-500 mt-2">Redirecting to meeting...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meetings;
