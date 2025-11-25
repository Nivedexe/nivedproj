import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const AdminConventionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        tariff: '',
        hotelDetails: '',
        maxCapacity: 100
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (isEditMode) {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/conventions/${id}`, config);
                    const convention = res.data;

                    setFormData({
                        name: convention.name,
                        location: convention.location,
                        startDate: convention.startDate,
                        endDate: convention.endDate,
                        description: convention.description,
                        tariff: convention.tariff,
                        hotelDetails: convention.hotelDetails,
                        maxCapacity: convention.maxCapacity
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/conventions/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/conventions', formData, config);
            }
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save convention');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditMode ? 'Edit Convention' : 'Create Convention'}</h1>

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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">Location</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="location"
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
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

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelDetails">Hotel Details</label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="hotelDetails"
                            name="hotelDetails"
                            value={formData.hotelDetails}
                            onChange={handleChange}
                        >
                            <option value="">Select a Hotel</option>
                            <option value="Grand Hyatt - 5 Star Luxury">Grand Hyatt - 5 Star Luxury</option>
                            <option value="Marriott Suites - Premium Stay">Marriott Suites - Premium Stay</option>
                            <option value="Hilton Garden Inn - Comfort & Style">Hilton Garden Inn - Comfort & Style</option>
                            <option value="Holiday Inn Express - Budget Friendly">Holiday Inn Express - Budget Friendly</option>
                            <option value="Radisson Blu - Business Class">Radisson Blu - Business Class</option>
                        </select>
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
                            onClick={() => navigate('/admin')}
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
