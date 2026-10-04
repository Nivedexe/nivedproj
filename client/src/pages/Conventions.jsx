import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { POPULAR_CITIES, MAIN_DISTRICTS, ALL_INDIA_DISTRICTS } from '../utils/locationData';

const renderCityIcon = (cityName) => {
    switch (cityName) {
        case 'Mumbai':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 42h36M10 42V18h5v24M33 42V18h5v24M15 18h18M15 18l3-8h12l3 8M21 10V6h6v4M18 42V26a6 6 0 0112 0v16" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22h1M35 22h1M12 28h1M35 28h1M12 34h1M35 34h1" strokeLinecap="round"/>
                </svg>
            );
        case 'Delhi-NCR':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M8 42h32M12 42V18h4v-6h16v6h4v24M16 12l8-5 8 5M18 42V25a6 6 0 0112 0v17M14 22h20M12 18h24" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'Bengaluru':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 42h36M10 42V24h6V14l8-6 8 6v10h6v18M18 24h12M14 42V32h5v10M29 42V32h5v10M20 42V28a4 4 0 018 0v14" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="18" r="2" stroke="currentColor" />
                </svg>
            );
        case 'Hyderabad':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M8 42h32M10 42V14l3-6 3 6v28M32 42V14l3-6 3 6v28M16 22h16M16 28h16M18 42V30a6 6 0 0112 0v12" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="18" r="2" stroke="currentColor" />
                </svg>
            );
        case 'Chandigarh':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 42h24M24 42V26m0 0l-7-7c-1-1-1-3 1-3 1.5 0 2.5 1 3.5 2l2.5 2.5V10c0-1.5 1-2.5 2.5-2.5S29 8.5 29 10v12l3-3c1-1 2.5-.5 3 1 .5 1.5 0 2.5-1 3.5l-10 10.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'Ahmedabad':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M8 42h32M11 42V18l3-8 3 8v24M31 42V18l3-8 3 8v24M17 28h14M19 42V32a5 5 0 0110 0v10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 22c2-2 6-2 8 0" strokeLinecap="round"/>
                </svg>
            );
        case 'Pune':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M8 42h32M10 42V22h7V14h14v8h7v20M14 22l10-8 10 8M19 42V32a5 5 0 0110 0v10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 28h4M30 28h4M14 34h4M30 34h4" strokeLinecap="round"/>
                </svg>
            );
        case 'Chennai':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M10 42h28M13 42l4-28h14l4 28M15 36h18M17 30h14M19 24h10M21 18h6M22 14v-4h4v4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 42v-5a3 3 0 016 0v5" strokeLinecap="round"/>
                </svg>
            );
        case 'Kolkata':
            return (
                <svg className="w-10 h-10 mx-auto text-gray-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 42h36M10 42V28h28v14M16 28a8 8 0 0116 0M24 20V10M18 10h12M12 42V34h4v8M32 42V34h4v8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="8" r="2" stroke="currentColor"/>
                </svg>
            );
        case 'Kochi':
            return (
                <svg className="w-11 h-11 mx-auto text-teal-600 drop-shadow-sm" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 14c3-2 6 0 8 5-1-4 2-8 6-7-2 4-1 7 1 9M34 14c-3-2-6 0-8 5 1-4-2-8-6-7 2 4 1 7-1 9" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 19v12M38 19v12" strokeLinecap="round"/>
                    <path d="M12 36c4-3 20-3 24 0M14 34c0-7 5-10 10-10s10 3 10 10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 41c6 2 12-2 18 0s12-2 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="20" y="27" width="8" height="6" rx="1" fill="#0d9488" fillOpacity="0.2" stroke="currentColor"/>
                </svg>
            );
        default:
            return <span className="text-2xl block my-1">📍</span>;
    }
};

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedConvention, setSelectedConvention] = useState(null);
    const [isAddMembersMode, setIsAddMembersMode] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Kochi');
    const [showCityModal, setShowCityModal] = useState(false);
    const [citySearchQuery, setCitySearchQuery] = useState('');
    const [showAllCities, setShowAllCities] = useState(false);
    const [cityNotice, setCityNotice] = useState('');
    const [registrationData, setRegistrationData] = useState({
        attendeeName: '',
        attendeePhone: '',
        memberCount: 1,
        foodPreference: 'Veg',
        roomType: 'Single'
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchConventions();
    }, [user]);

    const handleSelectCity = (cityName) => {
        setSelectedCity(cityName);
        setShowCityModal(false);
        setCityNotice('');
    };

    // Dynamically identify available locations where conventions exist in the database
    const availableLocations = Array.from(
        new Set([
            'Kochi',
            ...conventions
                .map(c => (c.location ? c.location.split(',')[0].trim() : ''))
                .filter(Boolean)
        ])
    );

    const isAvailableLocation = (name) => {
        return availableLocations.some(
            avail => avail.toLowerCase() === name.toLowerCase() ||
                     name.toLowerCase().includes(avail.toLowerCase()) ||
                     avail.toLowerCase().includes(name.toLowerCase())
        );
    };

    const handleDisabledCityClick = (cityName) => {
        setCityNotice(`Conventions are currently only hosted in available locations (${availableLocations.join(', ')}). Stay tuned as we expand to ${cityName} soon!`);
    };

    const filteredPopularCities = POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(citySearchQuery.toLowerCase())
    );

    // Available locations matching search query (always shown first!)
    const displayedAvailableLocations = availableLocations.filter(loc =>
        !citySearchQuery || loc.toLowerCase().includes(citySearchQuery.toLowerCase())
    );

    // When searching: search across all Indian districts. When not searching: show main prominent districts
    const searchPool = citySearchQuery ? ALL_INDIA_DISTRICTS : MAIN_DISTRICTS;
    const displayedOtherLocations = searchPool.filter(district => {
        if (isAvailableLocation(district)) return false;
        if (!citySearchQuery) return true;
        return district.toLowerCase().includes(citySearchQuery.toLowerCase());
    });

    const filteredConventions = conventions.filter(conv => {
        if (!selectedCity || selectedCity === 'All') return true;
        const loc = (conv.location || '').toLowerCase();
        return loc.includes(selectedCity.toLowerCase());
    });

    const handleRegisterClick = (convention) => {
        if (!user) {
            navigate('/login', { state: { from: '/conventions' } });
            return;
        }

        // If user is already registered, redirect to add members mode
        if (convention.isUserRegistered) {
            handleAddMembersClick(convention);
            return;
        }

        // Grab the default room type from dynamic roomTariffs if available
        let defaultRoomType = 'Single';
        if (convention.roomTariffs) {
            const types = Object.keys(convention.roomTariffs);
            if (types.length > 0) defaultRoomType = types[0];
        }

        setSelectedConvention(convention);
        setIsAddMembersMode(false);
        // Pre-fill attendee name with username in capital letters, editable
        const defaultName = (user?.username || user?.name || '').toUpperCase();
        const defaultPhone = user?.phone || '';
        setRegistrationData({
            attendeeName: defaultName,
            attendeePhone: defaultPhone,
            memberCount: 1,
            foodPreference: 'Veg',
            roomType: defaultRoomType
        });
        setShowPayment(false);
        setError('');
    };

    const handleAddMembersClick = (convention) => {
        if (!user) {
            navigate('/login', { state: { from: '/conventions' } });
            return;
        }

        let defaultRoomType = 'Single';
        if (convention.roomTariffs) {
            const types = Object.keys(convention.roomTariffs);
            if (types.length > 0) defaultRoomType = types[0];
        }

        setSelectedConvention(convention);
        setIsAddMembersMode(true);
        const defaultName = (convention.userRegistration?.attendeeName || user?.username || user?.name || '').toUpperCase();
        const defaultPhone = convention.userRegistration?.attendeePhone || user?.phone || '';
        setRegistrationData({
            attendeeName: defaultName,
            attendeePhone: defaultPhone,
            memberCount: 1, // Number of additional members
            foodPreference: convention.userRegistration?.foodPreference || 'Veg',
            roomType: convention.userRegistration?.roomType || defaultRoomType
        });
        setShowPayment(false);
        setError('');
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
        if (!registrationData.attendeeName || !registrationData.attendeeName.trim()) {
            setError('Please enter your full name for the booking registration.');
            return;
        }
        if (!registrationData.attendeePhone || !registrationData.attendeePhone.trim()) {
            setError('Please enter your contact phone number for the booking registration.');
            return;
        }
        setError('');
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
                    attendeeName: (registrationData.attendeeName || user?.username || '').trim(),
                    attendeePhone: (registrationData.attendeePhone || user?.phone || '').trim(),
                    memberCount: Number(registrationData.memberCount) || 1,
                    foodPreference: registrationData.foodPreference || 'Veg',
                    roomType: 'Volunteer Delegate',
                    totalAmount: 0,
                    isAddMembers: isAddMembersMode
                },
                config
            );

            alert(isAddMembersMode ? 'Additional delegate members added successfully!' : `Attendance Confirmed! You are registered for ${selectedConvention.name}.`);
            setSelectedConvention(null);
            setIsAddMembersMode(false);

            // Refresh to update registered count
            const refreshRes = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(refreshRes.data);
        } catch (err) {
            if (err.response?.data?.alreadyRegistered) {
                setIsAddMembersMode(true);
            }
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

            // 1. Register for convention or add additional members
            const regRes = await axios.post(
                `http://localhost:5000/api/conventions/${selectedConvention.id}/register`,
                {
                    attendeeName: registrationData.attendeeName.trim(),
                    attendeePhone: registrationData.attendeePhone.trim(),
                    memberCount: Number(registrationData.memberCount) || 1,
                    foodPreference: registrationData.foodPreference,
                    roomType: registrationData.roomType,
                    totalAmount,
                    isAddMembers: isAddMembersMode
                },
                config
            );

            // 2. Process Payment if amount > 0
            if (totalAmount > 0) {
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
            }

            alert(isAddMembersMode ? 'Additional members added and payment successful!' : 'Registration and Payment Successful!');
            setSelectedConvention(null);
            setShowPayment(false);
            setIsAddMembersMode(false);

            // Refresh to update registered count and status
            const refreshRes = await axios.get('http://localhost:5000/api/conventions', config);
            setConventions(refreshRes.data);

        } catch (err) {
            if (err.response?.data?.alreadyRegistered) {
                setIsAddMembersMode(true);
            }
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
                {/* Header with City Location Selector (BookMyShow Style) */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Conventions & Retreats</h1>
                        <p className="mt-2 text-base text-gray-500 max-w-2xl">
                            Join our large gatherings for intensive recovery workshops, spiritual renewal, and extended fellowship.
                        </p>
                    </div>

                    {/* Location Selector Button */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">Location:</span>
                        <button
                            type="button"
                            onClick={() => {
                                setCitySearchQuery('');
                                setCityNotice('');
                                setShowCityModal(true);
                            }}
                            className="group inline-flex items-center space-x-2 bg-white px-4 py-2.5 rounded-full border border-gray-300 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-sm font-semibold text-gray-800 focus:outline-none"
                            title="Click to change city"
                        >
                            <span className="text-indigo-600 text-base">📍</span>
                            <span className="text-gray-900 font-bold">{selectedCity === 'All' ? 'All Locations' : selectedCity}</span>
                            {selectedCity === 'Kochi' && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                    Active
                                </span>
                            )}
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredConventions.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                            <span className="text-4xl mb-3 block">📍</span>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No conventions scheduled in {selectedCity}</h3>
                            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                                Conventions are currently active in Kochi, Kerala. You can switch to Kochi or view all locations to explore available events.
                            </p>
                            <div className="flex items-center justify-center space-x-3">
                                <button
                                    onClick={() => handleSelectCity('Kochi')}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Switch to Kochi
                                </button>
                                <button
                                    onClick={() => handleSelectCity('All')}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    View All Locations
                                </button>
                            </div>
                        </div>
                    ) : (
                        filteredConventions.map(conv => (
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

                                        <div className="bg-gray-50 p-3.5 rounded-lg text-sm mb-4 border border-gray-100 shadow-inner">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p><span className="font-semibold text-gray-800">Hotel:</span> {conv.hotelName || (conv.hotelDetails ? conv.hotelDetails.substring(0, 25) + '...' : 'TBA')}</p>
                                                    {user?.role === 'volunteer' ? (
                                                        <p className="mt-1 text-emerald-600 font-semibold"><span className="text-gray-700 font-normal">Volunteer Pass:</span> Free / Complimentary</p>
                                                    ) : (
                                                        <p className="mt-1"><span className="font-semibold text-gray-800">Base Tariff:</span> ₹{conv.tariff}</p>
                                                    )}
                                                </div>
                                                {conv.mapLink && (
                                                    <a
                                                        href={conv.mapLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-semibold whitespace-nowrap transition-colors"
                                                        title="Open in Google Maps"
                                                    >
                                                        <span className="mr-1">🗺️</span> Map ↗
                                                    </a>
                                                )}
                                            </div>
                                            
                                            {/* Organizing Volunteer / Coordinator Details for Tippler & Attendees */}
                                            <div className="mt-2.5 pt-2 border-t border-gray-200 text-xs text-indigo-950 bg-indigo-50/80 p-2.5 rounded-md border border-indigo-100">
                                                <p className="font-bold text-gray-900 flex items-center mb-1">
                                                    <span className="mr-1.5">👤</span> Organizing Coordinator:
                                                </p>
                                                <p className="font-medium text-indigo-900">
                                                    <span className="text-gray-600 font-normal">Name: </span>
                                                    {conv.coordinatorName || (conv.creator?.username ? conv.creator.username.toUpperCase() : 'VOLUNTEER COORDINATOR')}
                                                </p>
                                                <p className="mt-0.5 text-indigo-900">
                                                    <span className="text-gray-600 font-normal">Phone: </span>
                                                    {conv.coordinatorPhone || conv.creator?.phone || '+91 9876543210'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Registration Count Badge */}
                                        <div className="mt-3">
                                            {user?.role === 'volunteer' ? (
                                                <div className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg text-indigo-800 bg-indigo-50 border border-indigo-200 flex items-center justify-between flex-wrap gap-1">
                                                    <span className="font-bold text-indigo-950 flex items-center">
                                                        <span className="mr-1">👥</span> {conv.registeredUsersCount || 0} User{(conv.registeredUsersCount || 0) === 1 ? '' : 's'} Registered
                                                    </span>
                                                    <span className="text-indigo-600 font-normal">
                                                        ({conv.registeredAttendeesCount || conv.registeredCount || 0} People Total / {conv.maxCapacity} Max)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-indigo-700 bg-indigo-100 border border-indigo-200">
                                                        {conv.registeredAttendeesCount || conv.registeredCount || 0} / {conv.maxCapacity} Booked ({conv.registeredUsersCount || 0} User{(conv.registeredUsersCount || 0) === 1 ? '' : 's'})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons: Already Registered vs Register Now */}
                                    {conv.isUserRegistered ? (
                                        <div className="mt-5 space-y-2">
                                            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-md">
                                                <span className="flex items-center text-xs font-bold text-emerald-800">
                                                    <svg className="w-4 h-4 mr-1.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Already Registered
                                                </span>
                                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    {conv.userRegisteredCount || 1} Member{(conv.userRegisteredCount || 1) > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleAddMembersClick(conv)}
                                                disabled={conv.registeredCount >= conv.maxCapacity}
                                                className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-semibold transition duration-150 ${
                                                    conv.registeredCount >= conv.maxCapacity
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                                }`}
                                            >
                                                {conv.registeredCount >= conv.maxCapacity ? 'Capacity Full' : '+ Add More Members'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRegisterClick(conv)}
                                            disabled={conv.registeredCount >= conv.maxCapacity}
                                            className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                                conv.registeredCount >= conv.maxCapacity 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                            }`}
                                        >
                                            {conv.registeredCount >= conv.maxCapacity 
                                                ? 'Sold Out' 
                                                : user?.role === 'volunteer' 
                                                    ? 'Attend' 
                                                    : 'Register Now'}
                                        </button>
                                    )}
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
                                            <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2" id="modal-title">
                                                {user?.role === 'volunteer' 
                                                    ? (isAddMembersMode ? `Add Delegate Members: ${selectedConvention.name}` : `Attend Confirmation: ${selectedConvention.name}`)
                                                    : showPayment 
                                                        ? (isAddMembersMode ? 'Payment Checkout: Additional Members' : 'Payment Checkout')
                                                        : (isAddMembersMode ? `Add Members: ${selectedConvention.name}` : `Register for ${selectedConvention.name}`)}
                                            </h3>

                                            {/* Already Registered Alert for Add Members Mode */}
                                            {isAddMembersMode && (
                                                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 mb-4 shadow-sm">
                                                    <div className="font-bold flex items-center text-amber-950">
                                                        <span className="mr-1.5 text-base">ℹ️</span> Already Registered Notice
                                                    </div>
                                                    <p className="mt-1 leading-relaxed">
                                                        You are currently registered for <strong>{selectedConvention.userRegisteredCount || 1} member{(selectedConvention.userRegisteredCount || 1) > 1 ? 's' : ''}</strong> for this convention. Select how many <em>additional</em> members you want to add below.
                                                    </p>
                                                </div>
                                            )}

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

                                                    {/* Organizing Volunteer / Coordinator Information */}
                                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900">
                                                        <p className="font-bold text-xs text-indigo-950 flex items-center mb-1">
                                                            <span className="mr-1.5">👤</span> Organizing Volunteer / Coordinator Details
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-800">
                                                            <div>
                                                                <span className="text-gray-600 font-normal">Coordinator: </span>
                                                                <strong className="font-bold text-indigo-950">
                                                                    {selectedConvention.coordinatorName || (selectedConvention.creator?.username ? selectedConvention.creator.username.toUpperCase() : 'VOLUNTEER COORDINATOR')}
                                                                </strong>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600 font-normal">Contact Phone: </span>
                                                                <strong className="font-bold text-indigo-950">
                                                                    {selectedConvention.coordinatorPhone || selectedConvention.creator?.phone || '+91 9876543210'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <p><span className="font-semibold text-gray-800">Hotel / Venue:</span> {selectedConvention.hotelName || 'TBA'}</p>
                                                            {selectedConvention.mapLink && (
                                                                <a
                                                                    href={selectedConvention.mapLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1 rounded transition-colors"
                                                                >
                                                                    <span className="mr-1">🗺️</span> Google Maps ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                        {selectedConvention.hotelDetails && (
                                                            <p className="mt-1 text-gray-600 text-xs">{selectedConvention.hotelDetails}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-bold uppercase text-gray-700">Delegate Contact Details</label>
                                                            <span className="text-xs text-indigo-600 font-medium">Editable</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Delegate Name</label>
                                                                <input
                                                                    type="text"
                                                                    name="attendeeName"
                                                                    value={registrationData.attendeeName}
                                                                    onChange={handleRegistrationChange}
                                                                    placeholder="YOUR NAME"
                                                                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded uppercase bg-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-600 mb-1">Delegate Phone Number</label>
                                                                <input
                                                                    type="tel"
                                                                    name="attendeePhone"
                                                                    value={registrationData.attendeePhone}
                                                                    onChange={handleRegistrationChange}
                                                                    placeholder="e.g. 9876543210"
                                                                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {isAddMembersMode ? 'Number of Additional Delegate Members' : 'Number of Delegate Passes'}
                                                        </label>
                                                        <select
                                                            name="memberCount"
                                                            value={registrationData.memberCount}
                                                            onChange={handleRegistrationChange}
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        >
                                                            {[1, 2, 3, 4, 5].map(num => (
                                                                <option key={num} value={num}>
                                                                    {num} {isAddMembersMode ? (num === 1 ? 'Additional Delegate' : 'Additional Delegates') : (num === 1 ? 'Delegate' : 'Delegates')}
                                                                </option>
                                                            ))}
                                                        </select>
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
                                                    {/* Organizing Volunteer / Coordinator Information for Tippler */}
                                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 shadow-sm">
                                                        <div className="font-bold text-xs uppercase tracking-wide text-indigo-950 flex items-center mb-1">
                                                            <span className="mr-1.5">👤</span> Organizing Volunteer / Coordinator
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-800">
                                                            <div>
                                                                <span className="text-gray-600 font-normal">Coordinator: </span>
                                                                <strong className="text-indigo-950 font-semibold">
                                                                    {selectedConvention.coordinatorName || (selectedConvention.creator?.username ? selectedConvention.creator.username.toUpperCase() : 'VOLUNTEER COORDINATOR')}
                                                                </strong>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600 font-normal">Contact Phone: </span>
                                                                <strong className="text-indigo-950 font-semibold">
                                                                    {selectedConvention.coordinatorPhone || selectedConvention.creator?.phone || '+91 9876543210'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Hotel / Venue Information with Google Maps Link for Tippler */}
                                                    <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <p><span className="font-semibold text-gray-800">Hotel / Venue:</span> {selectedConvention.hotelName || 'TBA'}</p>
                                                            {selectedConvention.mapLink && (
                                                                <a
                                                                    href={selectedConvention.mapLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1 rounded transition-colors"
                                                                >
                                                                    <span className="mr-1">🗺️</span> View on Google Maps ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                        {selectedConvention.hotelDetails && (
                                                            <p className="mt-1 text-gray-600 text-xs">{selectedConvention.hotelDetails}</p>
                                                        )}
                                                    </div>

                                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                                                Your Booking Contact Information
                                                            </label>
                                                            <span className="text-xs text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded font-medium">
                                                                Capitalized & Editable
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="attendeeName">
                                                                    Attendee Full Name <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="attendeeName"
                                                                    name="attendeeName"
                                                                    required
                                                                    value={registrationData.attendeeName}
                                                                    onChange={handleRegistrationChange}
                                                                    placeholder="ENTER YOUR NAME"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white uppercase"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="attendeePhone">
                                                                    Phone Number <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    id="attendeePhone"
                                                                    name="attendeePhone"
                                                                    required
                                                                    value={registrationData.attendeePhone}
                                                                    onChange={handleRegistrationChange}
                                                                    placeholder="e.g. 9876543210"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {isAddMembersMode ? 'Number of Additional Members to Add' : 'Number of Members'}
                                                        </label>
                                                        <select
                                                            name="memberCount"
                                                            value={registrationData.memberCount}
                                                            onChange={handleRegistrationChange}
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                        >
                                                            {[1, 2, 3, 4, 5].map(num => (
                                                                <option key={num} value={num}>
                                                                    {num} {isAddMembersMode ? (num === 1 ? 'Additional Member' : 'Additional Members') : (num === 1 ? 'Member' : 'Members')}
                                                                </option>
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
                                                            <span>{isAddMembersMode ? 'Room Tariff (per added member)' : 'Room Tariff'}</span>
                                                            <span>₹{selectedConvention.roomTariffs ? selectedConvention.roomTariffs[registrationData.roomType] : selectedConvention.tariff}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold text-lg text-blue-900 mt-2">
                                                            <span>{isAddMembersMode ? 'Additional Amount to Pay' : 'Total Amount'}</span>
                                                            <span>₹{calculateTotal()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">
                                                    <div className="bg-gray-50 p-4 rounded text-center mb-6 border border-gray-200">
                                                        <p className="text-sm text-gray-500">
                                                            {isAddMembersMode ? 'Additional amount to pay' : 'Amount to pay'}
                                                        </p>
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
                                                            {processingPayment ? 'Processing...' : (isAddMembersMode ? `Pay ₹${calculateTotal().toFixed(2)} to Add Members` : `Pay ₹${calculateTotal().toFixed(2)}`)}
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
                                            {processingPayment 
                                                ? 'Confirming...' 
                                                : (isAddMembersMode 
                                                    ? `Confirm Adding ${registrationData.memberCount} Additional Member(s)` 
                                                    : 'Attend Confirmation')}
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
                                            {isAddMembersMode 
                                                ? `Proceed to Pay for ${registrationData.memberCount} More Member(s)` 
                                                : 'Proceed to Payment'}
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

                {/* BookMyShow Style City Selection Modal */}
                {showCityModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
                            {/* Modal Header with Search and Close */}
                            <div className="p-4 sm:p-5 border-b border-gray-100">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="relative flex-1">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Search for your city"
                                            value={citySearchQuery}
                                            onChange={(e) => setCitySearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowCityModal(false)}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                                        title="Close"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Option to view all locations */}
                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCity('All')}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                                    >
                                        Show All Locations ({conventions.length})
                                    </button>
                                </div>

                                {/* Notification banner when user clicks a disabled city */}
                                {cityNotice && (
                                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-base">ℹ️</span>
                                            <span>{cityNotice}</span>
                                        </div>
                                        <button onClick={() => setCityNotice('')} className="text-amber-700 hover:text-amber-900 font-bold ml-2">×</button>
                                    </div>
                                )}
                            </div>

                            {/* Modal Body */}
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
                                {/* Popular Cities */}
                                <div>
                                    <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                                        Popular Cities
                                    </h3>
                                    
                                    <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
                                        {filteredPopularCities.map((city) => {
                                            const isSelected = selectedCity === city.name;
                                            const isAvailable = city.available;

                                            return (
                                                <button
                                                    key={city.name}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            handleSelectCity(city.name);
                                                        } else {
                                                            handleDisabledCityClick(city.name);
                                                        }
                                                    }}
                                                    className={`relative flex flex-col items-center justify-between p-2 rounded-xl text-center transition-all ${
                                                        isAvailable
                                                            ? (isSelected
                                                                ? 'bg-teal-50 border-2 border-teal-500 shadow-sm scale-105'
                                                                : 'hover:bg-teal-50/70 border border-teal-300 hover:border-teal-500 cursor-pointer shadow-sm')
                                                            : 'opacity-40 hover:opacity-70 bg-gray-50/70 border border-transparent cursor-not-allowed hover:bg-gray-100'
                                                    }`}
                                                    title={isAvailable ? `Select ${city.name} (Active)` : `${city.name} - Coming Soon (No conventions registered yet)`}
                                                >
                                                    {isAvailable && (
                                                        <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-teal-600 text-[9px] font-bold text-white rounded-full uppercase tracking-tighter shadow-sm">
                                                            Active
                                                        </span>
                                                    )}
                                                    <div className="h-11 flex items-center justify-center">
                                                        {renderCityIcon(city.name)}
                                                    </div>
                                                    <span className={`text-xs mt-1.5 font-medium truncate w-full ${
                                                        isAvailable ? 'text-gray-900 font-bold' : 'text-gray-400'
                                                    }`}>
                                                        {city.name}
                                                    </span>
                                                    {!isAvailable && (
                                                        <span className="text-[9px] text-gray-400 font-normal">Soon</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* View / Hide Other Locations Link */}
                                <div className="text-center pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAllCities(!showAllCities)}
                                        className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors focus:outline-none"
                                    >
                                        {showAllCities ? 'Hide other locations' : 'View other locations'}
                                    </button>
                                </div>

                                {/* Other Locations Section (Visible when toggled or when searching) */}
                                {(showAllCities || citySearchQuery.length > 0) && (
                                    <div className="border-t border-gray-100 pt-5 animate-in fade-in space-y-4">
                                        <div className="text-center">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                                                Other Locations
                                            </h4>
                                            <p className="text-[11px] text-gray-400">
                                                {citySearchQuery
                                                    ? `Showing matching locations for "${citySearchQuery}" across Indian districts`
                                                    : 'Available convention locations are shown first, followed by major district locations.'}
                                            </p>
                                        </div>

                                        {/* Available Locations First */}
                                        {displayedAvailableLocations.length > 0 && (
                                            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center">
                                                        <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                                                        Available Locations ({displayedAvailableLocations.length})
                                                    </span>
                                                    <span className="text-[10px] text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full font-bold">
                                                        Events Registered
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                                                    {displayedAvailableLocations.map((locName) => {
                                                        const isSelected = selectedCity.toLowerCase() === locName.toLowerCase();
                                                        return (
                                                            <button
                                                                key={locName}
                                                                type="button"
                                                                onClick={() => handleSelectCity(locName)}
                                                                className={`text-left px-3 py-2 rounded-lg font-bold transition-all flex items-center justify-between group cursor-pointer ${
                                                                    isSelected
                                                                        ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400'
                                                                        : 'bg-white text-teal-950 border border-teal-300 hover:border-teal-500 hover:bg-teal-100/60 shadow-xs'
                                                                }`}
                                                                title={`Select ${locName} (Conventions active)`}
                                                            >
                                                                <span className="truncate flex items-center">
                                                                    <span className="mr-1.5 text-sm">📍</span>
                                                                    {locName}
                                                                </span>
                                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                                                    isSelected ? 'bg-teal-700 text-teal-100' : 'bg-teal-100 text-teal-800'
                                                                }`}>
                                                                    Active
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Other / Upcoming Locations (Disabled) */}
                                        {displayedOtherLocations.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                                        {citySearchQuery ? `Other Districts (${displayedOtherLocations.length} found)` : 'Main Districts (Coming Soon)'}
                                                    </h5>
                                                    <span className="text-[10px] text-gray-400">Coming Soon</span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-2 gap-x-3 text-xs max-h-64 overflow-y-auto pr-1">
                                                    {displayedOtherLocations.map((districtName) => (
                                                        <button
                                                            key={districtName}
                                                            type="button"
                                                            onClick={() => handleDisabledCityClick(districtName)}
                                                            className="text-left text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2.5 py-1.5 rounded-md cursor-not-allowed transition-colors truncate flex items-center justify-between group border border-transparent hover:border-gray-200"
                                                            title={`${districtName} - Coming Soon (No conventions registered yet)`}
                                                        >
                                                            <span className="truncate">{districtName}</span>
                                                            <span className="text-[9px] text-gray-300 group-hover:text-gray-400 ml-1">Soon</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {displayedAvailableLocations.length === 0 && displayedOtherLocations.length === 0 && (
                                            <div className="text-center py-6 text-xs text-gray-400">
                                                No districts found matching "{citySearchQuery}". Try searching another district or city name.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <span>Currently active location: <strong className="text-teal-700 font-bold">Kochi, Kerala</strong></span>
                                <button
                                    onClick={() => setShowCityModal(false)}
                                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Conventions;
