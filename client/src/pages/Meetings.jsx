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
    const [currentTime, setCurrentTime] = useState(new Date());

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

        // Keep current time updated every 30 seconds for live slot status transitions
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // Helper to calculate slot status for the 3 basic daily meetings
    const getMeetingSlotStatus = (meeting) => {
        if (!meeting.isBasic || !meeting.slot) {
            return {
                isBasic: false,
                isJoinable: true,
                isActive: true,
                statusText: null,
                timeWindowText: null
            };
        }

        const hour = currentTime.getHours(); // 0 to 23

        // Determine current phase of day:
        // Morning to Noon: 6:00 AM – 11:59 AM (hour >= 6 && hour < 12)
        // Noon to Evening: 12:00 PM – 5:59 PM (hour >= 12 && hour < 18)
        // Evening to Next Morning: 6:00 PM – 5:59 AM (hour >= 18 || hour < 6)
        let currentPhase = 'evening';
        if (hour >= 6 && hour < 12) {
            currentPhase = 'morning';
        } else if (hour >= 12 && hour < 18) {
            currentPhase = 'noon';
        } else {
            currentPhase = 'evening';
        }

        const slot = meeting.slot.toLowerCase();
        const isActive = (slot === currentPhase);

        let statusText = '';
        let buttonLabel = '';
        let timeWindowText = '';
        let icon = '';

        if (slot === 'morning') {
            icon = '🌅';
            timeWindowText = 'Morning Slot: 6:00 AM – 12:00 PM';
            if (isActive) {
                statusText = 'Active Now (Morning Session)';
                buttonLabel = 'Join Morning Meeting';
            } else if (currentPhase === 'noon') {
                statusText = 'Closed • Reopens Tomorrow 6:00 AM';
                buttonLabel = 'Closed (Opens Tomorrow at 6:00 AM)';
            } else {
                statusText = 'Closed • Opens at 6:00 AM';
                buttonLabel = 'Opens at 6:00 AM';
            }
        } else if (slot === 'noon') {
            icon = '☀️';
            timeWindowText = 'Noon Slot: 12:00 PM – 6:00 PM';
            if (isActive) {
                statusText = 'Active Now (Noon Session)';
                buttonLabel = 'Join Midday Meeting';
            } else if (currentPhase === 'morning') {
                statusText = 'Upcoming • Opens at 12:00 PM';
                buttonLabel = 'Opens at 12:00 PM (Noon)';
            } else {
                statusText = 'Closed • Reopens Tomorrow 12:00 PM';
                buttonLabel = 'Opens Tomorrow at 12:00 PM';
            }
        } else if (slot === 'evening') {
            icon = '🌙';
            timeWindowText = 'Evening Slot: 6:00 PM – 6:00 AM';
            if (isActive) {
                statusText = 'Active Now (Evening Session)';
                buttonLabel = 'Join Evening Meeting';
            } else {
                statusText = 'Upcoming • Opens at 6:00 PM';
                buttonLabel = 'Opens at 6:00 PM (Evening)';
            }
        }

        return {
            isBasic: true,
            slot,
            icon,
            isActive,
            isJoinable: isActive,
            statusText,
            buttonLabel,
            timeWindowText,
            currentPhase
        };
    };

    const handleJoinClick = (meeting) => {
        const slotStatus = getMeetingSlotStatus(meeting);

        // Guard against joining locked basic meetings
        if (meeting.isBasic && !slotStatus.isJoinable) {
            alert(`This daily meeting is currently locked. It is active during its designated time window: ${slotStatus.timeWindowText}`);
            return;
        }

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

        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                await axios.post('http://localhost:5000/api/payments', {
                    itemId: selectedMeeting.id,
                    itemType: 'Meeting',
                    amount: selectedMeeting.price,
                    status: 'completed'
                }, config);

                setPaymentProcessing(false);
                setPaymentSuccess(true);

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

    // Separate basic daily meetings and custom/assigned meetings
    const basicMeetings = meetings.filter(m => m.isBasic);
    const customMeetings = meetings.filter(m => !m.isBasic);

    // Format current time nicely
    const formattedCurrentTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-200 mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recovery Meetings</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Connect with daily fellowship support circles and assigned recovery groups.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2.5 bg-white px-3.5 py-1.5 rounded-lg shadow-sm border border-gray-200 self-start sm:self-auto">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                            Current Time: <span className="text-indigo-600 font-bold">{formattedCurrentTime}</span>
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-500 text-base">Loading fellowship meetings...</div>
                ) : (
                    <div className="space-y-10">
                        {/* Section 1: 3 Basic Daily Recovery Meetings */}
                        <div>
                            <div className="mb-5">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">🕊️</span>
                                    <h2 className="text-2xl font-bold text-gray-900">Daily Fellowship Meetings (3 Sessions)</h2>
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5 max-w-3xl">
                                    Permanent daily support meetings open to all members. Each session activates during its designated time window:
                                    <strong className="text-gray-800 font-semibold"> Morning (6 AM–12 PM)</strong>, 
                                    <strong className="text-gray-800 font-semibold"> Noon (12 PM–6 PM)</strong>, and 
                                    <strong className="text-gray-800 font-semibold"> Evening (6 PM–6 AM)</strong>.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {basicMeetings.map((meeting) => {
                                    const slotStatus = getMeetingSlotStatus(meeting);
                                    const isActive = slotStatus.isActive;

                                    return (
                                        <div
                                            key={meeting.id}
                                            className={`relative bg-white overflow-hidden rounded-xl shadow-md transition-all duration-200 border-2 flex flex-col justify-between ${
                                                isActive
                                                    ? 'border-green-500 ring-4 ring-green-400/20 shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {/* Active Banner */}
                                            {isActive && (
                                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center space-x-2">
                                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                                    <span>Live Session Active Now</span>
                                                </div>
                                            )}

                                            <div className="p-6 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-3.5">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                            {slotStatus.icon} {slotStatus.slot ? slotStatus.slot.toUpperCase() : 'DAILY'}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                                isActive
                                                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                                                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                                                            }`}
                                                        >
                                                            {isActive ? '🟢 Active' : '🔒 Locked'}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                                                        {meeting.title}
                                                    </h3>
                                                    {meeting.groupName && (
                                                        <p className="text-xs font-semibold text-indigo-600 mb-2.5 uppercase tracking-wider">
                                                            {meeting.groupName}
                                                        </p>
                                                    )}
                                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 min-h-[60px]">
                                                        {meeting.description}
                                                    </p>
                                                </div>

                                                <div className="pt-4 border-t border-gray-100">
                                                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                                                        <p className="font-semibold text-gray-700">🕒 {slotStatus.timeWindowText}</p>
                                                        <p className={`font-medium ${isActive ? 'text-green-700 font-bold' : 'text-amber-700'}`}>
                                                            {slotStatus.statusText}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleJoinClick(meeting)}
                                                        disabled={!isActive}
                                                        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-xs ${
                                                            isActive
                                                                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                        }`}
                                                    >
                                                        {isActive ? (
                                                            <>
                                                                <span>🎥</span>
                                                                <span>{slotStatus.buttonLabel}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>🔒</span>
                                                                <span>{slotStatus.buttonLabel}</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {basicMeetings.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-6 bg-white rounded-lg border border-gray-200 text-sm">
                                        No daily basic meetings currently configured.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Special & Group Meetings (Assigned by Volunteer / Admin) */}
                        <div>
                            <div className="mb-5">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">👥</span>
                                    <h2 className="text-2xl font-bold text-gray-900">Assigned & Group Meetings</h2>
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5 max-w-3xl">
                                    Special recovery workshops, step studies, and fellowship groups scheduled by volunteers and administrators.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {customMeetings.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-shadow border border-gray-200 flex flex-col justify-between"
                                    >
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-3.5">
                                                    <span
                                                        className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${
                                                            meeting.type === 'Open'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}
                                                    >
                                                        {meeting.type}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        📅 {new Date(meeting.dateTime).toLocaleDateString()} at{' '}
                                                        {new Date(meeting.dateTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                                                    {meeting.title}
                                                </h3>
                                                {meeting.groupName && (
                                                    <p className="text-xs font-semibold text-purple-600 mb-2.5 uppercase tracking-wider">
                                                        {meeting.groupName}
                                                    </p>
                                                )}
                                                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 min-h-[60px]">
                                                    {meeting.description}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100">
                                                {meeting.price && parseFloat(meeting.price) > 0 && (
                                                    <div className="mb-3 text-sm font-bold text-gray-900">
                                                        Registration: ₹{meeting.price}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handleJoinClick(meeting)}
                                                    className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white transition-all cursor-pointer ${
                                                        meeting.price && parseFloat(meeting.price) > 0
                                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                                            : 'bg-primary hover:bg-indigo-700'
                                                    }`}
                                                >
                                                    {meeting.price && parseFloat(meeting.price) > 0
                                                        ? '💳 Pay & Join'
                                                        : '🎥 Join Meeting'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {customMeetings.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-10 bg-white rounded-xl border border-dashed border-gray-300 text-sm">
                                        No special assigned group meetings at this time.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && selectedMeeting && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
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

                                                {paymentSuccess ? (
                                                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                                                        <div className="flex">
                                                            <div className="flex-shrink-0">
                                                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm text-green-700">
                                                                    Payment successful! Redirecting to meeting...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="4242 •••• •••• 4242"
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Expires</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    placeholder="MM/YY"
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">CVC</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    placeholder="123"
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                            <button
                                                                type="submit"
                                                                disabled={paymentProcessing}
                                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                                            >
                                                                {paymentProcessing ? 'Processing...' : `Pay ₹${selectedMeeting.price}`}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPaymentModal(false)}
                                                                disabled={paymentProcessing}
                                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
