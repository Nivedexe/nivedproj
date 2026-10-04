import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const AdminConventionForm = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        location: 'Kochi, Kerala',
        startDate: '',
        endDate: '',
        description: '',
        tariff: '',
        hotelName: '',
        mapLink: '',
        roomTariffs: {
            "Single": "",
            "Double": "",
            "Suite": ""
        },
        maxCapacity: 100,
        coordinatorName: (!isEditMode && user?.role === 'volunteer') ? (user.username || user.name || '').toUpperCase() : '',
        coordinatorPhone: (!isEditMode && user?.role === 'volunteer') ? (user.phone || '') : ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEditMode && user?.role === 'volunteer') {
            setFormData(prev => ({
                ...prev,
                coordinatorName: prev.coordinatorName || (user.username || user.name || '').toUpperCase(),
                coordinatorPhone: prev.coordinatorPhone || user.phone || ''
            }));
        }
    }, [user, isEditMode]);

    useEffect(() => {
        const fetchData = async () => {
            if (isEditMode) {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/conventions/${id}`, config);
                    const convention = res.data;

                    setFormData({
                        name: convention.name || '',
                        location: convention.location || 'Kochi, Kerala',
                        startDate: convention.startDate || '',
                        endDate: convention.endDate || '',
                        description: convention.description || '',
                        tariff: convention.tariff || '',
                        hotelName: convention.hotelName || '',
                        mapLink: convention.mapLink || '',
                        roomTariffs: convention.roomTariffs || { "Single": "", "Double": "", "Suite": "" },
                        maxCapacity: convention.maxCapacity || 100,
                        coordinatorName: convention.coordinatorName || '',
                        coordinatorPhone: convention.coordinatorPhone || ''
                    });
                } catch (err) {
                    setError('Failed to fetch convention details');
                }
            }
        };
        fetchData();
    }, [isEditMode, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoomTariffChange = (e, roomType) => {
        setFormData({
            ...formData,
            roomTariffs: {
                ...formData.roomTariffs,
                [roomType]: e.target.value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Clean up empty tariffs before sending
            const cleanedTariffs = {};
            for (const [type, price] of Object.entries(formData.roomTariffs)) {
                if (price !== null && price !== "") {
                    cleanedTariffs[type] = Number(price);
                }
            }

            const payload = { ...formData, roomTariffs: cleanedTariffs };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/conventions/${id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/conventions', payload, config);
            }
            
            if (user?.role === 'volunteer') {
                alert(isEditMode ? 'Convention updated successfully!' : 'Convention submitted! Waiting for administrator approval.');
                navigate('/volunteer-dashboard');
            } else {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save convention');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditMode ? 'Edit Convention' : 'Create Convention'}</h1>

                {user?.role === 'volunteer' && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0 text-xl">⏳</div>
                            <div className="ml-3">
                                <h3 className="text-sm font-bold text-amber-900">Volunteer Moderation Notice</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    Conventions created by volunteers are submitted to the Administrator for approval. The convention will show as "Waiting for Approval" on your dashboard and will not be displayed to Tipplers until approved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Convention Name</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-5 bg-indigo-50/70 p-4 rounded-lg border border-indigo-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                            <label className="block text-gray-900 text-sm font-bold flex items-center">
                                <span className="mr-1.5 text-base">👤</span> Coordinator Information
                            </label>
                            {user?.role === 'volunteer' && (
                                <span className="text-xs text-indigo-700 bg-indigo-100 font-semibold px-2 py-0.5 rounded-full inline-block">
                                    Defaulted to your username (CAPITALIZED) & editable
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="coordinatorName">
                                    Coordinator Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white uppercase"
                                    id="coordinatorName"
                                    name="coordinatorName"
                                    type="text"
                                    required
                                    placeholder="COORDINATOR NAME"
                                    value={formData.coordinatorName}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500 mt-1">Visible to Tipplers and attendees during booking.</p>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="coordinatorPhone">
                                    Coordinator Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                                    id="coordinatorPhone"
                                    name="coordinatorPhone"
                                    type="tel"
                                    required
                                    placeholder="e.g. 9876543210"
                                    value={formData.coordinatorPhone}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500 mt-1">Direct contact for attendee questions and coordination.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                            <span className="flex items-center justify-between">
                                <span>City Location <span className="text-red-500">*</span></span>
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Kochi Active</span>
                            </span>
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                            id="location"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <optgroup label="Active Cities">
                                <option value="Kochi, Kerala">Kochi, Kerala</option>
                                <option value="Munnar, Kerala">Munnar, Kerala</option>
                                <option value="Kovalam, Kerala">Kovalam, Kerala</option>
                                <option value="Wayanad, Kerala">Wayanad, Kerala</option>
                            </optgroup>
                            <optgroup label="Other Popular Cities (Coming Soon)">
                                <option value="Bengaluru, Karnataka (Coming Soon)" disabled>Bengaluru, Karnataka (Coming Soon)</option>
                                <option value="Mumbai, Maharashtra (Coming Soon)" disabled>Mumbai, Maharashtra (Coming Soon)</option>
                                <option value="Delhi-NCR (Coming Soon)" disabled>Delhi-NCR (Coming Soon)</option>
                                <option value="Chennai, Tamil Nadu (Coming Soon)" disabled>Chennai, Tamil Nadu (Coming Soon)</option>
                                <option value="Hyderabad, Telangana (Coming Soon)" disabled>Hyderabad, Telangana (Coming Soon)</option>
                                <option value="Kolkata, West Bengal (Coming Soon)" disabled>Kolkata, West Bengal (Coming Soon)</option>
                                <option value="Pune, Maharashtra (Coming Soon)" disabled>Pune, Maharashtra (Coming Soon)</option>
                                <option value="Ahmedabad, Gujarat (Coming Soon)" disabled>Ahmedabad, Gujarat (Coming Soon)</option>
                            </optgroup>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Conventions are mapped to city locations. Specific hotel or venue name is specified below.</p>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">Start Date</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="startDate"
                                name="startDate"
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">End Date</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="endDate"
                                name="endDate"
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tariff">Tariff (₹)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="tariff"
                                name="tariff"
                                type="number"
                                step="0.01"
                                value={formData.tariff}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxCapacity">Max Capacity (Persons)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="maxCapacity"
                                name="maxCapacity"
                                type="number"
                                min="1"
                                value={formData.maxCapacity}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelName">Hotel / Venue Name</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="hotelName"
                                name="hotelName"
                                type="text"
                                value={formData.hotelName}
                                onChange={handleChange}
                                placeholder="e.g. Grand Hyatt Kochi Bolgatty"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mapLink">
                                <span className="flex items-center">
                                    <span className="mr-1.5">🗺️</span> Google Maps / Location Link
                                    <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Optional</span>
                                </span>
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="mapLink"
                                name="mapLink"
                                type="url"
                                value={formData.mapLink || ''}
                                onChange={handleChange}
                                placeholder="e.g. https://maps.google.com/?q=Grand+Hyatt+Kochi"
                            />
                            <p className="text-xs text-gray-500 mt-1">Attendees can open this link to navigate to the venue directly.</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Room Tariffs (₹ per night)</label>
                            <div className="space-y-2">
                                {Object.keys(formData.roomTariffs).map(roomType => (
                                    <div key={roomType} className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600 w-16">{roomType}:</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={formData.roomTariffs[roomType]}
                                            onChange={(e) => handleRoomTariffChange(e, roomType)}
                                            placeholder={`Rate for ${roomType}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {isEditMode ? 'Update Convention' : 'Create Convention'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(user?.role === 'volunteer' ? '/volunteer-dashboard' : '/admin')}
                            className="inline-block align-baseline font-bold text-sm text-primary hover:text-indigo-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminConventionForm;
